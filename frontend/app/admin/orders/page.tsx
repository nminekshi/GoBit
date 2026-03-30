"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, CheckCircle2, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { auctionAPI } from "../../lib/api";

type PayoutStatus = "Paid" | "Processing" | "Pending";

type PayoutRow = {
  id: string;
  buyer: string;
  seller?: string;
  amount: number;
  status: PayoutStatus;
  eta: string;
};

export default function AdminPayoutsPage() {
  const [rows, setRows] = useState<PayoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await auctionAPI.fetchAuctions(undefined, "completed");
        type AuctionLike = {
          _id?: string;
          id?: string;
          bids?: { bidAmount?: number }[];
          currentBid?: number;
          startPrice?: number;
          saleStatus?: string;
          winnerId?: { username?: string; email?: string } | string;
          sellerId?: { username?: string; email?: string };
        };

        const mapped: PayoutRow[] = (Array.isArray(data) ? data : []).map((a) => {
          const auction = a as AuctionLike;
          const latestBid = auction.bids?.length ? auction.bids[auction.bids.length - 1] : null;
          const amount = latestBid?.bidAmount || auction.currentBid || auction.startPrice || 0;
          const status: PayoutStatus = auction.saleStatus === "paid" ? "Paid" : auction.saleStatus === "claim-initiated" ? "Processing" : "Pending";
          const winner = typeof auction.winnerId === "object" && auction.winnerId !== null ? auction.winnerId : undefined;
          const buyerName = winner?.username || winner?.email || "Unknown";
          const sellerName = auction.sellerId?.username || auction.sellerId?.email || undefined;
          const idBase = auction._id || auction.id || "0000";

          return {
            id: `P-${idBase.toString().slice(-4)}`,
            buyer: buyerName,
            seller: sellerName,
            amount,
            status,
            eta: status === "Paid" ? "Settled" : status === "Processing" ? "Today" : "Awaiting",
          };
        });
        setRows(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load payouts");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = useMemo(() => rows.reduce((sum, r) => sum + (r.amount || 0), 0), [rows]);

  const handleExport = () => {
    const header = ["payout_id", "buyer", "seller", "amount", "status", "eta"];
    const csv = [header.join(","), ...rows.map((r) => [r.id, r.buyer, r.seller ?? "", r.amount, r.status, r.eta].join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payouts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-none space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Admin</p>
            <h1 className="text-3xl font-bold">Payouts</h1>
            <p className="text-sm text-white/60">Track seller payouts and settlement status.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/60"
              disabled={rows.length === 0}
            >
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between px-2 pb-3 text-sm text-white/70">
            <span>Total completed: {rows.length} payouts</span>
            <span className="font-semibold text-emerald-300">${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[1fr_1fr_1fr_0.8fr_0.8fr] items-center bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
              <span>Payout</span>
              <span>Buyer</span>
              <span>Seller</span>
              <span>Amount</span>
              <span className="text-right">Status</span>
            </div>

            {loading && (
              <div className="flex items-center gap-2 px-4 py-6 text-sm text-white/60">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading payouts...
              </div>
            )}

            {!loading && error && (
              <div className="flex items-center gap-2 px-4 py-6 text-sm text-amber-200">
                <AlertTriangle className="h-4 w-4" /> {error}
              </div>
            )}

            {!loading && !error && rows.length === 0 && (
              <div className="px-4 py-6 text-sm text-white/60">No payouts found.</div>
            )}

            {!loading && !error && rows.length > 0 && (
              <div className="divide-y divide-white/5">
                {rows.map((p) => (
                  <div key={p.id} className="grid grid-cols-[1fr_1fr_1fr_0.8fr_0.8fr] items-center px-4 py-3 text-sm hover:bg-white/5">
                    <span className="font-semibold text-white">{p.id}</span>
                    <span className="text-white/80">{p.buyer}</span>
                    <span className="text-white/80">{p.seller ?? "-"}</span>
                    <span className="text-white/80">${p.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    <div className="flex items-center justify-end gap-2 text-xs font-semibold">
                      <StatusBadge status={p.status} />
                      <span className="text-white/60">{p.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: PayoutStatus }) {
  if (status === "Paid") {
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300 border border-emerald-400/40"><CheckCircle2 className="h-4 w-4" /> Paid</span>;
  }
  if (status === "Processing") {
    return <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-blue-200 border border-blue-400/40"><Clock className="h-4 w-4" /> Processing</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-amber-200 border border-amber-400/40"><Clock className="h-4 w-4" /> Pending</span>;
}

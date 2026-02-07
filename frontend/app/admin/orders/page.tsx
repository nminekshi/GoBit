"use client";

import { Wallet, Download, CheckCircle2, Clock } from "lucide-react";

export default function AdminPayoutsPage() {
  const payouts = [
    { id: "P-8821", seller: "seller_21", amount: "$4,900", status: "Processing", eta: "Today" },
    { id: "P-8819", seller: "watch_vault", amount: "$9,800", status: "Paid", eta: "Settled" },
    { id: "P-8818", seller: "pixel_parts", amount: "$1,420", status: "Pending", eta: "Awaiting" },
  ];

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Admin</p>
            <h1 className="text-3xl font-bold">Payouts</h1>
            <p className="text-sm text-white/60">Track seller payouts and settlement status.</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/60">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[1.2fr_1fr_0.9fr_0.8fr] items-center bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
              <span>Payout</span>
              <span>Seller</span>
              <span>Amount</span>
              <span className="text-right">Status</span>
            </div>
            <div className="divide-y divide-white/5">
              {payouts.map((p) => (
                <div key={p.id} className="grid grid-cols-[1.2fr_1fr_0.9fr_0.8fr] items-center px-4 py-3 text-sm hover:bg-white/5">
                  <span className="font-semibold text-white">{p.id}</span>
                  <span className="text-white/80">{p.seller}</span>
                  <span className="text-white/80">{p.amount}</span>
                  <div className="flex items-center justify-end gap-2 text-xs font-semibold">
                    <StatusBadge status={p.status} />
                    <span className="text-white/60">{p.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: "Paid" | "Processing" | "Pending" }) {
  if (status === "Paid") {
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300 border border-emerald-400/40"><CheckCircle2 className="h-4 w-4" /> Paid</span>;
  }
  if (status === "Processing") {
    return <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-blue-200 border border-blue-400/40"><Clock className="h-4 w-4" /> Processing</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-amber-200 border border-amber-400/40"><Clock className="h-4 w-4" /> Pending</span>;
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { auctionAPI } from "../../lib/api";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await auctionAPI.fetchAuctionById(id as string);
        setAuction(data);

        // If returning from PayHere (gateway param) and backend hasn't marked as paid yet, mark it now.
        const gateway = searchParams?.get("gateway");
        if (gateway === "payhere" && data?.saleStatus !== "paid" && !data?.winnerPaidAt) {
          setSyncing(true);
          try {
            await auctionAPI.payAuction(id as string);
            const refreshed = await auctionAPI.fetchAuctionById(id as string);
            setAuction(refreshed);
          } catch (payErr: any) {
            console.error("Failed to sync PayHere payment", payErr);
          } finally {
            setSyncing(false);
          }
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040918] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#040918] text-white gap-4">
        <p className="text-xl text-rose-400">{error || "Order not found"}</p>
        <Link href="/buyer/dashboard" className="text-emerald-400 hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const latestBid = auction.bids?.length ? auction.bids[auction.bids.length - 1] : null;
  const amount = latestBid?.bidAmount || auction.currentBid;

  return (
    <div className="min-h-screen bg-[#040918] text-white px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-6 text-center">
        <h1 className="text-3xl font-bold">Payment Confirmed</h1>
        <p className="text-white/70">Your order is confirmed. We'll notify you when shipping or pickup is ready.</p>
        {syncing && <p className="text-xs text-emerald-200/80">Syncing payment status...</p>}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left space-y-3">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Item</span>
            <span className="font-semibold text-white">{auction.title}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Category</span>
            <span className="font-semibold text-white">{auction.category}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Auction type</span>
            <span className="font-semibold text-white">{auction.auctionType === "live" ? "Live" : "Normal"}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Paid amount</span>
            <span className="font-semibold text-emerald-300">${amount?.toLocaleString()}</span>
          </div>
          {auction.paymentOrderId && (
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Order ID</span>
              <span className="font-semibold text-white">{auction.paymentOrderId}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link href="/buyer/dashboard" className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400">
            Go to Dashboard
          </Link>
          <Link href={`/auctions/${auction._id}`} className="text-emerald-300 hover:underline text-sm">View auction</Link>
        </div>
      </div>
    </div>
  );
}

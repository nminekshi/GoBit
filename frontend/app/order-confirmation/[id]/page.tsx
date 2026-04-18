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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-br from-[#02050D] via-[#051126] to-[#010308] text-white gap-4">
        <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 border-t-2 border-b-2 border-emerald-500 rounded-full animate-spin"></div>
            <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_#34d399]"></div>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-br from-[#02050D] via-[#051126] to-[#010308] text-white p-4">
        <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-[#040918]/80 p-8 text-center backdrop-blur-2xl shadow-xl flex flex-col items-center gap-4">
           <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/30">
              <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
           </div>
           <p className="text-xl font-bold">{error || "Order not found"}</p>
           <Link href="/buyer/dashboard" className="w-full mt-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-semibold uppercase tracking-wider">
             Back Dashboard
           </Link>
        </div>
      </div>
    );
  }

  const latestBid = auction.bids?.length ? auction.bids[auction.bids.length - 1] : null;
  const amount = latestBid?.bidAmount || auction.currentBid;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-br from-[#02050D] via-[#051126] to-[#010308] text-white p-4 font-sans selection:bg-emerald-500/30">
      {/* Master Box Covering Everything */}
      <div className="w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 md:p-12 text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow in background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-40 bg-emerald-500/10 blur-[80px] pointer-events-none rounded-full"></div>

        <div className="relative z-10 flex flex-col items-center space-y-6">
          
          {/* Success Icon */}
          <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <svg className="h-8 w-8 md:h-10 md:w-10 text-emerald-400 drop-shadow-[0_0_8px_#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-md text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-white to-emerald-50">Payment Confirmed</h1>
            <p className="text-sm text-white/50 font-medium leading-relaxed max-w-[90%] mx-auto">
              Your order has been completely secured. We'll notify you when your shipping or pickup gets finalized.
            </p>
            {syncing && (
               <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Syncing payment...
               </div>
            )}
          </div>

          {/* Minimal Internal Order Details Box */}
          <div className="w-full text-left space-y-4 rounded-3xl border border-white/5 bg-black/30 p-6 md:p-8 mt-4 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <svg className="w-32 h-32 text-white translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h2.25c.12.98.98 1.46 2.26 1.46 1.54 0 2.22-.71 2.22-1.55 0-1.14-1.28-1.41-3.1-1.9-2.22-.59-3.41-1.63-3.41-3.35 0-1.62 1.32-2.81 3.05-3.15V4h2.67v1.95c1.4.3 2.65 1.15 2.94 2.8h-2.26c-.16-.83-.88-1.23-1.92-1.23-1.1 0-1.96.53-1.96 1.45 0 1.05 1.25 1.31 3.25 1.84 2.37.64 3.26 1.84 3.26 3.4 0 1.76-1.34 2.9-3.31 3.23z"/></svg>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <span className="text-xs font-bold tracking-[0.2em] text-emerald-400/80 uppercase">Purchased</span>
              <span className="text-lg font-bold text-white max-w-[60%] truncate text-right">{auction.title}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
               <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Category</span>
                  <span className="text-sm font-semibold text-white/90 truncate">{auction.category}</span>
               </div>
               <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Type</span>
                  <span className="text-sm font-semibold text-white/90">{auction.auctionType === "live" ? "Live" : "Standard"}</span>
               </div>
            </div>

            <div className="flex items-center justify-between pt-2 relative z-10">
              <span className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">Amount</span>
              <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.2)] tracking-tight">
                ${amount?.toLocaleString()}
              </span>
            </div>

            {auction.paymentOrderId && (
              <div className="pt-4 border-t border-white/5 relative z-10 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Ref ID</span>
                <span className="text-xs font-mono font-medium text-white/70">{auction.paymentOrderId}</span>
              </div>
            )}
          </div>

          {/* Navigation Buttons grouped at the bottom of the card */}
          <div className="w-full flex w-full flex-col sm:flex-row items-stretch gap-3 pt-4">
            <Link href="/buyer/dashboard" className="flex-1 px-4 py-3.5 rounded-xl bg-emerald-500 text-[#010308] font-bold text-sm tracking-wide uppercase transition-all duration-300 shadow-[0_5px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5">
              Dashboard
            </Link>
            <Link href={`/auctions/${auction._id}`} className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-sm text-white/80 transition-all duration-300 transform hover:-translate-y-0.5 uppercase tracking-wide">
              View Item
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

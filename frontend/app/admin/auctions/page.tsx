"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Plus, Filter, Search } from "lucide-react";
import { auctionAPI } from "../../lib/api";

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        const data = await auctionAPI.fetchAuctions();
        setAuctions(data);
      } catch (err) {
        console.error("Failed to load auctions:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAuctions();
  }, []);

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-none space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Admin</p>
            <h1 className="text-3xl font-bold">Auctions</h1>
            <p className="text-sm text-white/60">Review, filter, and launch auctions.</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/60">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <Link href="/seller/create-auction">
              <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400">
                <Plus className="h-4 w-4" /> New Auction
              </button>
            </Link>
          </div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/70">
              <Layers className="h-4 w-4" />
              <span>{auctions.filter(a => a.status === 'pending' || a.status === 'draft').length} queued</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/70">
              <Search className="h-4 w-4" />
              <input
                className="bg-transparent text-sm text-white placeholder-white/40 outline-none"
                placeholder="Search auctions"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[1.1fr_1fr_0.7fr_0.7fr] items-center bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
              <span>ID</span>
              <span>Title</span>
              <span>Status</span>
              <span className="text-right">Bids · Current Price</span>
            </div>
            <div className="divide-y divide-white/5">
              {loading ? (
                <div className="p-8 text-center text-white/60">Loading auctions...</div>
              ) : auctions.length === 0 ? (
                <div className="p-8 text-center text-white/60">No auctions found.</div>
              ) : (
                auctions.map((a) => (
                  <div key={a._id} className="grid grid-cols-[1.1fr_1fr_0.7fr_0.7fr] items-center px-4 py-3 text-sm hover:bg-white/5">
                    <span className="font-semibold text-white truncate max-w-[150px]">{a._id}</span>
                    <span className="text-white/80 truncate">{a.title}</span>
                    <span className={`inline-flex items-center justify-center rounded-full border border-white/15 px-3 py-1 text-xs font-semibold ${a.status === 'active' ? 'text-emerald-400' : 'text-white/80'
                      }`}>{a.status}</span>
                    <div className="flex justify-end gap-2 text-white/80">
                      <span>{a.bidsCount || 0} bids</span>
                      <span className="font-semibold text-white">${(a.currentBid || a.startPrice || 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Layers, Plus, Filter, Search, Eye, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { auctionAPI } from "../../lib/api";

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const data = await auctionAPI.fetchAuctions(undefined, statusFilter);
      setAuctions(data);
    } catch (err) {
      console.error("Failed to load auctions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuctions();
  }, [statusFilter]);

  const filteredAuctions = useMemo(() => {
    return auctions.filter(a => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.sellerId?.username || "").toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [auctions, searchTerm]);

  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setAuctions(prev => prev.map(a => a._id === id ? { ...a, isVerified: !currentStatus } : a));

      await auctionAPI.updateAuction(id, { isVerified: !currentStatus });
    } catch (err) {
      console.error("Failed to toggle verification:", err);
      // Revert on error
      loadAuctions();
    }
  };

  const handleUpdateCommission = async (id: string, currentCommission: number) => {
    const newVal = prompt("Enter new commission percentage:", currentCommission.toString());
    if (newVal === null) return;

    const commission = parseFloat(newVal);
    if (isNaN(commission)) {
      alert("Please enter a valid number");
      return;
    }

    try {
      // Optimistic update
      setAuctions(prev => prev.map(a => a._id === id ? { ...a, commission } : a));
      await auctionAPI.updateAuction(id, { commission });
    } catch (err) {
      console.error("Failed to update commission:", err);
      loadAuctions();
    }
  };

  const handleDeleteAuction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this auction?")) return;

    try {
      await auctionAPI.deleteAuction(id);
      setAuctions(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error("Failed to delete auction:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-none space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Admin</p>
            <h1 className="text-3xl font-bold">Auctions</h1>
            <p className="text-sm text-white/60">Review, filter, and launch auctions.</p>
          </div>
          <div className="flex gap-2 relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${statusFilter !== 'all' ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400' : 'border-white/10 bg-white/5 text-white hover:border-emerald-400/60'
                }`}
            >
              <Filter className="h-4 w-4" />
              {statusFilter === 'all' ? 'Filter' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </button>

            {showFilterMenu && (
              <div className="absolute top-full right-0 mt-2 w-40 rounded-xl border border-white/10 bg-[#0a1020] p-1 shadow-2xl z-50">
                {['all', 'pending', 'active', 'completed', 'canceled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === status ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}

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
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/70 min-w-[250px]">
              <Search className="h-4 w-4 text-white/40" />
              <input
                className="bg-transparent text-sm text-white placeholder-white/40 outline-none w-full"
                placeholder="Search auctions or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[0.5fr_0.8fr_2fr_1.5fr_1fr_1fr_1.2fr_1fr_1.2fr] items-center bg-white/5 px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-white/60">
              <span>S.N</span>
              <span>Image</span>
              <span>Title</span>
              <span>User</span>
              <span>Commission</span>
              <span>Price</span>
              <span>Bid Amount</span>
              <span>Verify</span>
              <span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-white/5">
              {loading && filteredAuctions.length === 0 ? (
                <div className="p-8 text-center text-white/60">Loading auctions...</div>
              ) : filteredAuctions.length === 0 ? (
                <div className="p-8 text-center text-white/60">No auctions found.</div>
              ) : (
                filteredAuctions.map((a, index) => (
                  <div key={a._id} className="grid grid-cols-[0.5fr_0.8fr_2fr_1.5fr_1fr_1fr_1.2fr_1fr_1.2fr] items-center px-4 py-4 text-sm hover:bg-white/5 transition-colors">
                    <span className="text-white/60 font-medium">{index + 1}</span>
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-white/5">
                      <img
                        src={a.imageUrl || "https://images.unsplash.com/photo-1550259114-ad7188f0a967?auto=format&fit=crop&q=80&w=260&h=200"}
                        alt={a.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-white/80 truncate pr-2 font-medium" title={a.title}>{a.title}</span>
                    <span className="text-white/60 truncate pr-2">{a.sellerId?.username || "Unknown"}</span>
                    <button
                      onClick={() => handleUpdateCommission(a._id, a.commission || 0)}
                      className="text-left text-white/80 hover:text-emerald-400 group flex items-center gap-1"
                    >
                      {a.commission || 0}%
                      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <span className="text-white/80">${(a.startPrice || 0).toLocaleString()}</span>
                    <span className="text-white font-medium">${(a.currentBid || a.startPrice || 0).toLocaleString()}</span>
                    <div>
                      <button
                        onClick={() => handleToggleVerify(a._id, !!a.isVerified)}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${a.isVerified
                            ? 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20'
                            : 'text-rose-400 bg-rose-400/10 hover:bg-rose-400/20'
                          }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${a.isVerified ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                        {a.isVerified ? 'Yes' : 'No'}
                      </button>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Link href={`/auctions/${a._id}`}>
                        <button className="p-2 text-white/40 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      <button className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAuction(a._id)}
                        className="p-2 text-white/40 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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


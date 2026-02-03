"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// --- Types ---
interface Auction {
  id: string;
  title: string;
  category: string;
  startPrice: number;
  currentBid: number;
  status: "active" | "draft" | "sold";
  bidsCount: number;
  imageUrl: string;
  views: number;
  createdAt: Date;
}

// --- Mock Data ---
const MOCK_SELLER_AUCTIONS: Auction[] = [
  {
    id: "s1",
    title: "Vintage Leica M3",
    category: "Cameras",
    startPrice: 1200,
    currentBid: 1550,
    status: "active",
    bidsCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=260&h=200",
    views: 124,
    createdAt: new Date(),
  },
  {
    id: "s2",
    title: "Eames Lounge Chair Replica",
    category: "Furniture",
    startPrice: 500,
    currentBid: 500,
    status: "draft",
    bidsCount: 0,
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=260&h=200",
    views: 0,
    createdAt: new Date(),
  },
  {
    id: "s3",
    title: "Signed Basketball Jersey",
    category: "Sports",
    startPrice: 200,
    currentBid: 450,
    status: "sold",
    bidsCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=260&h=200", // placeholder
    views: 340,
    createdAt: new Date(),
  },
];

export default function SellerDashboard() {
  // --- State ---
  const [myAuctions, setMyAuctions] = useState<Auction[]>(MOCK_SELLER_AUCTIONS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  // Dashboard Filters
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft" | "sold">("all");

  // Create Form State
  const [newAuction, setNewAuction] = useState({
    title: "",
    category: "Electronics",
    startPrice: "",
    imageUrl: "",
  });

  // --- Effects ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const username = parsed?.user?.username as string | undefined;
      if (username) {
        setDisplayName(username);
      }

      // Load auctions from local storage
      const savedAuctions = window.localStorage.getItem("global_auctions");
      if (savedAuctions) {
        const parsedAuctions = JSON.parse(savedAuctions);
        // Filter only auctions created by current user (or all for demo simplicity)
        // For demo, we just merge mock and saved unique ones
        const existingIds = new Set(MOCK_SELLER_AUCTIONS.map(a => a.id));
        const newAuctions = parsedAuctions.filter((a: any) => !existingIds.has(a.id));
        setMyAuctions([...MOCK_SELLER_AUCTIONS, ...newAuctions]);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // --- Handlers ---
  const handleCreateAuction = (e: React.FormEvent) => {
    e.preventDefault();
    const auction: Auction = {
      id: Math.random().toString(36).substr(2, 9),
      title: newAuction.title,
      category: newAuction.category,
      startPrice: Number(newAuction.startPrice),
      currentBid: Number(newAuction.startPrice),
      status: "active",
      bidsCount: 0,
      imageUrl: newAuction.imageUrl || "https://images.unsplash.com/photo-1550259114-ad7188f0a967?auto=format&fit=crop&q=80&w=260&h=200", // default placeholder
      views: 0,
      createdAt: new Date(),
    };

    const updatedAuctions = [auction, ...myAuctions];
    setMyAuctions(updatedAuctions);

    // Save to LocalStorage
    try {
      const savedAuctionsRaw = window.localStorage.getItem("global_auctions");
      const savedAuctions = savedAuctionsRaw ? JSON.parse(savedAuctionsRaw) : [];
      const newGlobalAuctions = [auction, ...savedAuctions];
      window.localStorage.setItem("global_auctions", JSON.stringify(newGlobalAuctions));
    } catch (err) {
      console.error("Failed to save auction locally:", err);
    }

    setIsCreateOpen(false);
    setNewAuction({ title: "", category: "Electronics", startPrice: "", imageUrl: "" });
    alert("Auction Created Successfully!");
  };

  // --- Derived State ---
  const filteredAuctions = myAuctions.filter(a => filterStatus === "all" || a.status === filterStatus);

  const totalEarnings = myAuctions
    .filter((a) => a.status === "sold")
    .reduce((sum, a) => sum + a.currentBid, 0);

  const activeListings = myAuctions.filter(a => a.status === 'active').length;
  const totalViews = myAuctions.reduce((sum, a) => sum + a.views, 0);

  return (
    <main className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Seller Dashboard
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your listings, track earnings, and reach more buyers.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/buyer/dashboard">
              <button className="rounded-xl bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20">
                Switch to Buyer View
              </button>
            </Link>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              + Create New Auction
            </button>
          </div>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-400">Total Earnings</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">${totalEarnings.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-400">Active Listings</p>
            <p className="mt-2 text-3xl font-bold text-white">{activeListings}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-400">Total Views</p>
            <p className="mt-2 text-3xl font-bold text-blue-400">{totalViews}</p>
          </div>
        </section>

        {/* Content Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">My Listings</h2>
            <div className="flex space-x-1 rounded-xl bg-white/5 p-1">
              {(['all', 'active', 'sold', 'draft'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${filterStatus === status
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAuctions.length === 0 ? (
              <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                <p className="text-slate-500">No auctions found in this category.</p>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-4 text-emerald-400 hover:underline"
                >
                  Create your first auction
                </button>
              </div>
            ) : (
              filteredAuctions.map(auction => (
                <div key={auction.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-emerald-500/30">
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full bg-slate-800">
                    <img src={auction.imageUrl} alt={auction.title} className="h-full w-full object-cover" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full ${auction.status === 'active' ? 'bg-emerald-500 text-black' :
                        auction.status === 'sold' ? 'bg-blue-500 text-white' :
                          'bg-slate-500 text-white'
                        }`}>
                        {auction.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-1 text-lg font-bold text-white">{auction.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{auction.category}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-lg bg-white/5 p-2">
                        <p className="text-[10px] uppercase text-slate-500">Current Bid</p>
                        <p className="font-semibold text-white">${auction.currentBid}</p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-2">
                        <p className="text-[10px] uppercase text-slate-500">Bids</p>
                        <p className="font-semibold text-white">{auction.bidsCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0B1121] border border-white/10 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Create New Auction</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateAuction} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Item Title</label>
                <input
                  required
                  type="text"
                  value={newAuction.title}
                  onChange={e => setNewAuction({ ...newAuction, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Vintage Camera Lens"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Category</label>
                  <select
                    value={newAuction.category}
                    onChange={e => setNewAuction({ ...newAuction, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Collectibles">Collectibles</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Start Price</label>
                  <input
                    required
                    type="number"
                    value={newAuction.startPrice}
                    onChange={e => setNewAuction({ ...newAuction, startPrice: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Image URL (Optional)</label>
                <input
                  type="text"
                  value={newAuction.imageUrl}
                  onChange={e => setNewAuction({ ...newAuction, imageUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-6 py-2 text-sm font-bold text-white hover:bg-emerald-600"
                >
                  Create Auction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

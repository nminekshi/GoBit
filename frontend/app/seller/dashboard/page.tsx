"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// --- Types ---
interface Auction {
  id: string;
  title: string;
  category: string;
  description: string;
  startPrice: number;
  currentBid: number;
  status: "active" | "draft" | "sold";
  startTime: Date;
  endTime: Date;
  winner?: string;
  bidsCount: number;
  imageUrl: string;
  views: number;
  createdAt: Date;
}

// --- Mock Data ---
const MOCK_SELLER_AUCTIONS: Auction[] = [
  {
    id: "s1",
    title: "2021 Tesla Model 3 Long Range", // Updated to match style of request
    category: "Electronics",
    description: "All-Wheel Drive, 28,000 miles. Autopilot enabled. Includes Wall Connector and...",
    startPrice: 32500,
    currentBid: 32500,
    status: "active",
    startTime: new Date("2026-02-01T13:47:00"),
    endTime: new Date("2026-02-05T13:50:00"),
    bidsCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=260&h=200",
    views: 124,
    createdAt: new Date(),
  },
  {
    id: "s2",
    title: "Eames Lounge Chair Replica",
    category: "Art & Editions",
    description: "High-quality reproduction with premium Italian leather and walnut veneer finish.",
    startPrice: 500,
    currentBid: 500,
    status: "draft",
    startTime: new Date("2026-02-10T09:00:00"),
    endTime: new Date("2026-02-15T18:00:00"),
    bidsCount: 0,
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=260&h=200",
    views: 0,
    createdAt: new Date(),
  },
  {
    id: "s3",
    title: "Signed Basketball Jersey",
    category: "Art & Editions",
    description: "Authentic signed jersey from the 2024 championship game. COA included.",
    startPrice: 200,
    currentBid: 52000,
    status: "sold",
    startTime: new Date("2026-01-20T10:00:00"),
    endTime: new Date("2026-02-01T13:50:00"),
    winner: "Dili@gmail.com",
    bidsCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=260&h=200", // placeholder
    views: 340,
    createdAt: new Date(),
  },
];

export default function SellerDashboard() {
  // --- State ---
  const [myAuctions, setMyAuctions] = useState<Auction[]>(MOCK_SELLER_AUCTIONS);
  const [displayName, setDisplayName] = useState<string | null>(null);

  // Dashboard Filters
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft" | "sold">("all");



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

        // Merge logic: Create a map with MOCKs, then override with saved auctions if ID matches
        const auctionMap = new Map();
        MOCK_SELLER_AUCTIONS.forEach(a => auctionMap.set(a.id, a));
        parsedAuctions.forEach((a: any) => auctionMap.set(a.id, a));

        setMyAuctions(Array.from(auctionMap.values()) as Auction[]);
      }
    } catch {
      // ignore parse errors
    }
  }, []);



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
            <Link href="/seller/create-auction">
              <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600">
                + Create New Auction
              </button>
            </Link>
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
                <Link href="/seller/create-auction">
                  <button className="mt-4 text-emerald-400 hover:underline">
                    Create your first auction
                  </button>
                </Link>
              </div>
            ) : (
              filteredAuctions.map(auction => {
                // Calculate time left (mock logic for demo, real would differ)
                const timeLeft = auction.status === 'active' ? '2d 14h' : auction.status === 'sold' ? 'Ended' : '-';

                return (
                  <div key={auction.id} className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 font-sans">
                    {/* Image */}
                    <div className="relative flex h-56 w-full items-center justify-center overflow-hidden border-b border-white/10 bg-black/30">
                      <img
                        src={auction.imageUrl}
                        alt={auction.title}
                        className="h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md ${auction.status === 'active' ? 'bg-emerald-500 text-black' :
                          auction.status === 'sold' ? 'bg-blue-500 text-white' :
                            'bg-slate-500 text-white'
                          }`}>
                          {auction.status}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-xl font-semibold text-white leading-tight line-clamp-1">{auction.title}</h3>
                      <p className="mt-1 text-sm text-white/60">
                        {auction.category}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                          <p className="text-xs uppercase tracking-wide text-white/50">
                            Current bid
                          </p>
                          <p className="text-lg font-semibold text-white">${auction.currentBid.toLocaleString()}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                          <p className="text-xs uppercase tracking-wide text-white/50">
                            Ends in
                          </p>
                          <p className="text-lg font-semibold text-white">{timeLeft}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-white/60">{auction.views} watchers</span>
                        <span className="text-emerald-300">Bid ready</span>
                      </div>

                      <Link href={`/seller/edit-auction/${auction.id}`}>
                        <button className="mt-5 w-full rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white/90 shadow-lg shadow-white/5">
                          Manage Listing
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>


    </main>
  );
}

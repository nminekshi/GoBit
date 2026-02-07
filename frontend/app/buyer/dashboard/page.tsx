"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// --- Types ---
interface Auction {
  id: string;
  title: string;
  category: string;
  imageUrl: string; // Using simple placeholders for now
  currentBid: number;
  myBid?: number; // The user's highest bid if any
  endsIn: string; // content string like "2h 15m"
  bidsCount: number;
  isWatchlisted: boolean;
  status: "active" | "won" | "ended";
  seller: string;
  trustScore: number;
}

// --- Mock Data ---
const MOCK_AUCTIONS: Auction[] = [
  {
    id: "1",
    title: "Vintage Rolex Datejust",
    category: "Watches",
    imageUrl: "https://images.unsplash.com/photo-1587839600078-450eb93895e6?auto=format&fit=crop&q=80&w=260&h=200",
    currentBid: 5430,
    endsIn: "2h 15m",
    bidsCount: 12,
    isWatchlisted: false,
    status: "active",
    seller: "LuxuryTime",
    trustScore: 4.9,
  },
  {
    id: "2",
    title: "Sony PlayStation 5 Digital",
    category: "Gaming",
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=260&h=200",
    currentBid: 320,
    endsIn: "45m",
    bidsCount: 28,
    isWatchlisted: true,
    status: "active",
    seller: "GameHub",
    trustScore: 4.7,
  },
  {
    id: "3",
    title: "MacBook Pro M3 Max",
    category: "Computers",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=260&h=200",
    currentBid: 2900,
    endsIn: "1d 4h",
    bidsCount: 5,
    isWatchlisted: false,
    status: "active",
    seller: "AppleReseller",
    trustScore: 5.0,
  },
  {
    id: "4",
    title: "Herman Miller Aeron Chair",
    category: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=260&h=200",
    currentBid: 650,
    endsIn: "5h 30m",
    bidsCount: 8,
    isWatchlisted: false,
    status: "active",
    seller: "OfficeComfort",
    trustScore: 4.5,
  },
  {
    id: "5",
    title: "Nikon Z6 II Body",
    category: "Cameras",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=260&h=200",
    currentBid: 1400,
    endsIn: "Ended",
    bidsCount: 15,
    isWatchlisted: false,
    status: "won",
    seller: "CamWorld",
    trustScore: 4.8,
    myBid: 1400,
  },
];

export default function BuyerDashboard() {
  // --- State ---
  const [auctions, setAuctions] = useState<Auction[]>(MOCK_AUCTIONS);
  const [activeTab, setActiveTab] = useState<"all" | "bidding" | "watchlist">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [displayName, setDisplayName] = useState<string | null>(null);

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

      // Load global auctions from local storage
      const savedAuctionsRaw = window.localStorage.getItem("global_auctions");
      if (savedAuctionsRaw) {
        const savedAuctions = JSON.parse(savedAuctionsRaw);
        // Convert seller auction format to buyer auction format if needed
        const formattedSavedAuctions = savedAuctions.map((a: any) => ({
          id: a.id,
          title: a.title,
          category: a.category,
          imageUrl: a.imageUrl,
          currentBid: a.currentBid,
          // saved auctions don't have endsIn, mock it
          endsIn: "3d 5h",
          bidsCount: a.bidsCount,
          isWatchlisted: false,
          status: a.status,
          seller: displayName || "Local Seller", // assume current user is seller for demo
          trustScore: 5.0
        }));

        setAuctions((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = formattedSavedAuctions.filter((a: any) => !existingIds.has(a.id));
          return [...uniqueNew, ...prev];
        });
      }

    } catch {
      // ignore parse errors
    }
  }, []);

  // --- Handlers ---
  const handleBid = (id: string) => {
    setAuctions((prev) =>
      prev.map((auction) => {
        if (auction.id === id) {
          const nextBid = auction.currentBid + 50; // Simple increment
          return { ...auction, currentBid: nextBid, myBid: nextBid, bidsCount: auction.bidsCount + 1 };
        }
        return auction;
      })
    );
    alert("Bid placed successfully!");
  };

  const toggleWatchlist = (id: string) => {
    setAuctions((prev) =>
      prev.map((auction) => {
        if (auction.id === id) {
          return { ...auction, isWatchlisted: !auction.isWatchlisted };
        }
        return auction;
      })
    );
  };

  // --- Derived State ---
  const filteredAuctions = auctions.filter((auction) => {
    // 1. Filter by Tab
    if (activeTab === "watchlist" && !auction.isWatchlisted) return false;
    if (activeTab === "bidding" && auction.myBid === undefined) return false;

    if (activeCategory !== "all" && auction.category.toLowerCase() !== activeCategory) {
      return false;
    }

    // 2. Filter by Search
    if (searchQuery && !auction.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Stats
  const activeBidsCount = auctions.filter((a) => a.myBid && a.status === "active").length;
  const watchlistCount = auctions.filter((a) => a.isWatchlisted).length;
  const auctionsWon = auctions.filter((a) => a.status === "won").length;

  return (
    <main className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        {/* Header Section */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Hello, <span className="text-emerald-400">{displayName || "Buyer"}</span>
            </h1>
            <p className="mt-2 text-slate-400">
              Welcome to your auction command center. Find, bid, and win.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/categories">
              <button className="rounded-xl bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20">
                Browse Categories
              </button>
            </Link>
            <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600">
              Deposit Funds
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-400">Active Bids</p>
            <p className="mt-2 text-3xl font-bold text-white">{activeBidsCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-400">Watchlist</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">{watchlistCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-400">Auctions Won</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">{auctionsWon}</p>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <FiltersPanel
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
          />
          {/* Main Feed */}
          <div className="flex-1 space-y-6">
            {/* Controls */}
            <div className="flex flex-col gap-4 sticky top-4 z-10 bg-[#040918]/90 py-2 backdrop-blur md:flex-row md:items-center md:justify-between">
              {/* Tabs */}
              <div className="flex space-x-1 rounded-xl bg-white/5 p-1">
                {(["all", "bidding", "watchlist"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === tab
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                      }`}
                  >
                    {tab === "all" ? "All Auctions" : tab === "bidding" ? "My Bids" : "Watchlist"}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search current auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 pl-10 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 md:w-64"
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Auction Grid */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredAuctions.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-500">No auctions found matching your criteria.</p>
                </div>
              ) : (
                filteredAuctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    onBid={handleBid}
                    onWatchlist={toggleWatchlist}
                  />
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

// --- Components ---

type FiltersPanelProps = {
  activeCategory: string;
  onCategorySelect: (value: string) => void;
};

function FiltersPanel({ activeCategory, onCategorySelect }: FiltersPanelProps) {
  const categories = [
    { label: "All", value: "all" },
    { label: "Watches", value: "watches" },
    { label: "Electronics", value: "electronics" },
    { label: "Computers", value: "computers" },
    { label: "Vehicles", value: "vehicles" },
    { label: "Real Estate", value: "real estate" },
    { label: "Art", value: "art" },
    { label: "Cameras", value: "cameras" },
    { label: "Furniture", value: "furniture" },
    { label: "Gaming", value: "gaming" },
  ];

  const inputClasses = "w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none";

  return (
    <aside className="w-full shrink-0 space-y-4 lg:w-80">
      <div className="rounded-3xl border border-white/10 bg-[#0b1020] p-5 backdrop-blur">
        <p className="text-sm uppercase tracking-wide text-white/60">Categories</p>
        <div className="mt-4 space-y-2">
          {categories.map((category) => {
            const isActive = activeCategory === category.value;
            return (
              <button
                key={category.value}
                onClick={() => onCategorySelect(category.value)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-white bg-white text-gray-900 shadow"
                    : "border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                <span>{category.label}</span>
                {isActive && <span className="text-xs font-normal text-gray-700">Live</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0b1020] p-5 backdrop-blur">
        <p className="text-sm uppercase tracking-wide text-white/60">Filters</p>
        <div className="mt-4 space-y-4 text-sm text-white/80">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-white/60">Brand</p>
            <input type="text" placeholder="Brand" className={inputClasses} />
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-white/60">Condition</p>
            <select className={inputClasses}>
              <option value="">All</option>
              <option value="new" className="text-gray-900">New</option>
              <option value="used" className="text-gray-900">Used</option>
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-white/60">Price</p>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" className={inputClasses} />
              <input type="number" placeholder="Max" className={inputClasses} />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-white/60">Keywords</p>
            <input type="text" placeholder="Enter keywords" className={inputClasses} />
          </div>
          <button className="w-full rounded-2xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white">Apply filters</button>
        </div>
      </div>
    </aside>
  );
}


function AuctionCard({
  auction,
  onBid,
  onWatchlist,
}: {
  auction: Auction;
  onBid: (id: string) => void;
  onWatchlist: (id: string) => void;
}) {
  const statusTone = auction.status === "won"
    ? "bg-amber-500/20 text-amber-200"
    : auction.status === "active"
      ? "bg-emerald-500/15 text-emerald-200"
      : "bg-white/10 text-white/70";

  return (
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white transition hover:border-white/30 hover:shadow-[0_18px_40px_rgba(16,185,129,0.2)]">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          {auction.category}
        </span>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone}`}>
            {auction.status}
          </span>
          <button
            onClick={() => onWatchlist(auction.id)}
            className="rounded-full border border-white/10 bg-black/30 p-2 text-white transition hover:border-rose-400/60 hover:text-rose-300"
            aria-label="Toggle watchlist"
          >
            <svg
              className={`h-5 w-5 ${auction.isWatchlisted ? "fill-rose-500 text-rose-400" : "text-white"}`}
              fill={auction.isWatchlisted ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <img
          src={auction.imageUrl}
          alt={auction.title}
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040918] via-transparent to-transparent opacity-70" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-semibold leading-tight group-hover:text-emerald-300">
          {auction.title}
        </h3>
        <p className="text-sm text-white/60">
          Sold by <span className="text-white/80">{auction.seller}</span> · ★ {auction.trustScore}
        </p>
        {auction.myBid && (
          <p className="text-xs font-semibold text-emerald-300">Your bid ${auction.myBid.toLocaleString()}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-white/50">Current bid</p>
          <p className="text-lg font-semibold">${auction.currentBid.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-white/50">Ends in</p>
          <p className={`text-lg font-semibold ${auction.endsIn === "Ended" ? "text-rose-400" : "text-emerald-300"}`}>
            {auction.endsIn}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-white/50">Bids</p>
          <p className="text-lg font-semibold">{auction.bidsCount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-white/60">
        <span>{auction.isWatchlisted ? "On your watchlist" : "Add to watchlist"}</span>
        <span className="text-emerald-300">Secure escrow</span>
      </div>

      <div className="flex gap-3">
        {auction.status === "won" ? (
          <button className="flex-1 rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-amber-400">
            Claim item
          </button>
        ) : (
          <button
            onClick={() => onBid(auction.id)}
            className="flex-1 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-white/90"
          >
            Place bid ${`${(auction.currentBid + 50).toLocaleString()}`}
          </button>
        )}
        <button
          onClick={() => onWatchlist(auction.id)}
          className="rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
        >
          {auction.isWatchlisted ? "Unwatch" : "Watch"}
        </button>
      </div>
    </div>
  );
}

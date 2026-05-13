"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { auctionAPI } from "../lib/api";

type Auction = {
  _id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl?: string;
  startPrice: number;
  currentBid: number;
  startTime?: string;
  endTime: string;
  auctionType?: "normal" | "live";
  bids?: { bidAmount: number; timestamp: string }[];
  watchers?: number;
};

type SortKey = "ending" | "price" | "bids";

const accentByCategory: Record<string, string> = {
  Electronics: "from-sky-400/30 via-transparent to-transparent",
  Watches: "from-amber-400/30 via-transparent to-transparent",
  Vehicles: "from-rose-400/30 via-transparent to-transparent",
  "Real Estate": "from-emerald-400/30 via-transparent to-transparent",
  Art: "from-purple-400/30 via-transparent to-transparent",
  Computers: "from-blue-400/30 via-transparent to-transparent",
};

const now = () => new Date().getTime();

const isActive = (auction: Auction) => {
  const start = auction.startTime ? new Date(auction.startTime).getTime() : now();
  const end = new Date(auction.endTime).getTime();
  return start <= now() && end > now();
};

const formatCountdown = (endTime: string) => {
  const diff = new Date(endTime).getTime() - now();
  if (diff <= 0) return "Ended";
  const totalMinutes = Math.floor(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${Math.max(1, minutes)}m left`;
};

const bidProgress = (current: number, startPrice: number) => {
  const base = startPrice || 1;
  return Math.min(100, Math.round((current / base) * 40));
};

export default function TrendingAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Auction | null>(null);
  const [bid, setBid] = useState("");
  const [bidError, setBidError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("bids");

  const loadAuctions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auctionAPI.fetchAuctions();
      const items = Array.isArray(data) ? (data as Auction[]) : [];
      const active = items.filter(isActive);
      const ranked = [...active].sort((a, b) => (b.watchers || 0) + (b.bids?.length || 0) - ((a.watchers || 0) + (a.bids?.length || 0)));
      setAuctions(ranked);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load trending auctions";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuctions();
  }, []);

  const categoryFilters = useMemo(() => ["All", ...new Set(auctions.map((a) => a.category))], [auctions]);

  const filteredAuctions = auctions.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedAuctions = useMemo(() => {
    return [...filteredAuctions].sort((a, b) => {
      if (sortBy === "ending") return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      if (sortBy === "price") return (b.currentBid || 0) - (a.currentBid || 0);
      const bidsA = a.bids?.length || 0;
      const bidsB = b.bids?.length || 0;
      return bidsB - bidsA;
    });
  }, [filteredAuctions, sortBy]);

  const heroHighlight = sortedAuctions[0] ?? auctions[0];
  const closingSoon = useMemo(
    () => [...auctions].sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime()).slice(0, 3),
    [auctions]
  );

  const openModal = (item: Auction) => {
    setSelectedItem(item);
    setBid("");
    setBidError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setBid("");
    setBidError("");
  };

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    const amount = Number(bid);
    if (!amount || isNaN(amount) || amount <= (selectedItem.currentBid || 0)) {
      setBidError("Enter a bid higher than the current bid.");
      return;
    }
    try {
      await auctionAPI.placeBid(selectedItem._id, amount);
      await loadAuctions();
      closeModal();
      alert("Bid placed successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to place bid";
      setBidError(message);
    }
  };

  const liveStats = useMemo(() => {
    const lots = auctions.length;
    const totalBids = auctions.reduce((sum, a) => sum + (a.bids?.length || 0), 0);
    const watchers = auctions.reduce((sum, a) => sum + (a.watchers || 0), 0);
    return [
      { label: "Lots trending", value: `${lots}`, change: "live now" },
      { label: "Total bids", value: `${totalBids}`, change: "across these lots" },
      { label: "Watchers", value: watchers ? `${watchers}` : "–", change: "following now" },
      { label: "Auction mix", value: "Normal & Live", change: "realtime" },
    ];
  }, [auctions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1020] text-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1020] text-white flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg text-rose-300">{error}</p>
        <button
          onClick={loadAuctions}
          className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0a1020] text-white">
      <section className="w-full bg-white text-[#0b1524]">
        <div className="flex min-h-screen w-full flex-col justify-center gap-12 px-6 py-16 lg:px-12 xl:px-20 2xl:px-32">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="order-2 flex flex-col gap-6 lg:order-1">
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#0b1524]/10 px-4 py-1 text-1.5xl font-semibold text-[#0b1524]">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                {auctions.length} lots trending now
              </span>
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                Stay ahead of trending lots with instant market signals
              </h1>
              <p className="text-base md:text-lg text-[#4b5563] max-w-2xl">
                Track the hottest assets as they surge in demand. Filter by category, compare bid velocity, and jump in before these listings close.
              </p>
              <div className="flex flex-wrap gap-4">
                {heroHighlight && (
                  <button
                    onClick={() => openModal(heroHighlight)}
                    className="rounded-2xl bg-[#0b1524] text-white px-8 py-3 font-semibold transition hover:bg-[#111c30]"
                  >
                    Place a live bid
                  </button>
                )}
                <Link
                  href="/categories"
                  className="rounded-2xl border border-[#0b1524]/20 px-8 py-3 font-semibold text-[#0b1524] hover:border-[#0b1524]"
                >
                  Browse categories
                </Link>
              </div>
            </div>

            {heroHighlight && (
              <div className="order-1 rounded-[32px] border border-slate-100 bg-[#0b1524] p-8 shadow-[0_25px_80px_rgba(15,23,42,0.12)] flex flex-col gap-6 lg:order-2">
                <div className="flex items-center justify-between text-sm font-medium text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Trending now
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide text-slate-600">
                    {heroHighlight.category}
                  </span>
                </div>
                <div className="relative h-72 rounded-3xl bg-slate-50 overflow-hidden">
                  <Image
                    src={heroHighlight.imageUrl || "/images/placeholder.png"}
                    alt={heroHighlight.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold text-[#0b1524]">{heroHighlight.title}</h2>
                  <p className="text-sm text-slate-500">{heroHighlight.description || "High-demand lot—bid while it’s hot."}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-slate-500">Current bid</p>
                    <p className="text-2xl font-semibold text-[#0b1524]">LKR {(heroHighlight.currentBid || heroHighlight.startPrice).toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-slate-500">Ends in</p>
                    <p className="text-2xl font-semibold text-[#0b1524]">{formatCountdown(heroHighlight.endTime)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {liveStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-slate-100 bg-[#0b1524] px-6 py-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
                <p className="text-2xl text-slate-500">{stat.label}</p>
                <p className="text-5xl font-semibold text-[#ccd2dc] mt-2">{stat.value}</p>
                <p className="text-1xl text-emerald-500 mt-1">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full px-6 pb-24 lg:px-12 xl:px-20 2xl:px-32">

        <section className="mt-12 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {categoryFilters.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    activeCategory === category
                      ? "border-white bg-white text-gray-900"
                      : "border-white/15 text-white/70 hover:border-white/40"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex w-full gap-4 lg:w-auto">
              <div className="flex-1">
                <label className="sr-only" htmlFor="auction-search">
                  Search auctions
                </label>
                <input
                  id="auction-search"
                  type="search"
                  placeholder="Search lots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="auction-sort">
                  Sort auctions
                </label>
                <select
                  id="auction-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "ending" | "price" | "bids")}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:border-white focus:outline-none"
                >
                  <option value="ending">Ending soon</option>
                  <option value="price">Highest bid</option>
                  <option value="bids">Most bids</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
            <aside className="order-2 space-y-6 lg:order-1">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Trending radar</h3>
                <p className="text-1.5xl text-white/60 mt-1">
                  Watch the lots gaining the most new followers.
                </p>
                <div className="mt-5 space-y-4">
                  {closingSoon.map((lot) => (
                    <Link key={lot._id} href={`/auctions/${lot._id}`} className="block rounded-2xl bg-black/20 p-4 hover:bg-black/30 transition">
                      <div className="flex items-center justify-between text-sm text-white/60">
                        <span>{lot.category}</span>
                        <span>{formatCountdown(lot.endTime)}</span>
                      </div>
                      <p className="mt-2 font-semibold">{lot.title}</p>
                      <p className="text-sm text-white/60">LKR {(lot.currentBid || lot.startPrice).toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0 p-6">
                <h3 className="text-lg font-semibold">Signal boosts</h3>
                <ul className="mt-4 space-y-3 text-1.5xl text-white/70">
                  <li>Star the lot to move it into your cross-platform watchlist.</li>
                  <li>Turn on SMS alerts so you get pinged inside the last 15 minutes.</li>
                  <li>Use proxy bids to mirror top bidders without hovering in the app.</li>
                </ul>
              </div>
            </aside>

            <div className="order-1 space-y-6 lg:order-2">
              {sortedAuctions.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                  <p className="text-lg font-semibold">No matching lots</p>
                  <p className="text-white/60 mt-2">
                    Adjust your filters or search term to discover fresh trending assets.
                  </p>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {sortedAuctions.map((item) => {
                  const progress = bidProgress(item.currentBid || item.startPrice, item.startPrice);
                  const accent = accentByCategory[item.category] || "from-emerald-400/20 via-transparent to-transparent";
                  return (
                    <Link
                      key={item._id}
                      href={`/auctions/${item._id}`}
                      className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-black/20 p-6 backdrop-blur hover:border-white/30 transition"
                    >
                      <div
                        className={`absolute inset-0 rounded-3xl bg-gradient-to-br opacity-40 pointer-events-none ${accent}`}
                      />
                      <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide">
                            {item.category}
                          </span>
                          <span className="text-white/60">
                            {(item.watchers || 0)} watchers · {(item.bids?.length || 0)} bids
                          </span>
                        </div>
                        <div className="relative h-48 rounded-2xl bg-black/30 overflow-hidden">
                          <Image src={item.imageUrl || "/images/placeholder.png"} alt={item.title} fill className="object-contain" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{item.title}</h3>
                          <p className="text-sm text-white/60 mt-1">{item.description || "Trending fast—join the bidding."}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="rounded-2xl bg-white/5 p-3">
                            <p className="text-white/60">Current bid</p>
                            <p className="text-2xl font-semibold">LKR {(item.currentBid || item.startPrice).toLocaleString()}</p>
                          </div>
                          <div className="rounded-2xl bg-white/5 p-3">
                            <p className="text-white/60">Start price</p>
                            <p className="text-2xl font-semibold">LKR {item.startPrice?.toLocaleString()}</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm text-white/60">
                            <span>{formatCountdown(item.endTime)}</span>
                            <span className="capitalize">{item.auctionType || "normal"}</span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-lime-400"
                              style={{ width: `${progress}%` }}
                              aria-label={`Bid progress ${progress}%`}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 md:flex-row">
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); openModal(item); }}
                            className="flex-1 rounded-2xl bg-white text-gray-900 py-3 font-semibold hover:bg-white/90"
                          >
                            Bid now
                          </button>
                          <span className="flex-1 rounded-2xl border border-white/30 py-3 text-center font-semibold">
                            View lot
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {modalOpen && selectedItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0a111d] p-8 shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-2xl text-white/40 hover:text-white"
              aria-label="Close bid modal"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold">Bid for {selectedItem.title}</h2>
            <p className="text-sm text-white/60 mt-1">Ends {formatCountdown(selectedItem.endTime)}</p>
            <div className="mt-4 rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Current bid</span>
                <span>Start</span>
              </div>
              <div className="flex items-center justify-between text-2xl font-semibold mt-1">
                <span>LKR {(selectedItem.currentBid || selectedItem.startPrice).toLocaleString()}</span>
                <span>LKR {selectedItem.startPrice?.toLocaleString()}</span>
              </div>
            </div>
            <form onSubmit={handleBid} className="mt-6 space-y-4">
              <label className="text-sm text-white/70" htmlFor="bid-input">
                Your bid
              </label>
              <input
                id="bid-input"
                type="number"
                min={(selectedItem.currentBid || selectedItem.startPrice) + 1}
                value={bid}
                onChange={(e) => setBid(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-white focus:outline-none"
                placeholder={`Enter amount above LKR ${(selectedItem.currentBid || selectedItem.startPrice).toLocaleString()}`}
                autoFocus
              />
              {bidError && <div className="text-red-400 text-sm">{bidError}</div>}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-white py-3 font-semibold text-gray-900 hover:bg-white/90"
                >
                  Place bid
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-2xl border border-white/30 py-3 font-semibold text-white hover:border-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

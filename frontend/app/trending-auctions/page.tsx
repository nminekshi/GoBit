"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type Auction = {
  name: string;
  img: string;
  category: string;
  currentBid: number;
  reserve: number;
  bids: number;
  watchers: number;
  endsInMinutes: number;
  link: string;
  description: string;
  location: string;
  accent: string;
};

const trendingLots: Auction[] = [
  {
    name: "Apple Watch Ultra",
    img: "/images/Apple Watch Ultra.png",
    category: "Watches",
    currentBid: 925,
    reserve: 1200,
    bids: 61,
    watchers: 312,
    endsInMinutes: 45,
    link: "/categories/watches",
    description: "Titanium case, ocean band, and battery health at 100%.",
    location: "Dubai logistics hub",
    accent: "from-amber-400/30 via-transparent to-transparent"
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    img: "/images/Sony WH-1000XM5 Headphones.png",
    category: "Electronics",
    currentBid: 250,
    reserve: 380,
    bids: 44,
    watchers: 188,
    endsInMinutes: 185,
    link: "/categories/electronics",
    description: "Noise-canceling flagship with travel kit and 2-year warranty.",
    location: "Berlin audio lab",
    accent: "from-purple-400/30 via-transparent to-transparent"
  },
  {
    name: "HP Spectre x360",
    img: "/images/HP Spectre x360.png",
    category: "Computers",
    currentBid: 1300,
    reserve: 1600,
    bids: 28,
    watchers: 137,
    endsInMinutes: 210,
    link: "/categories/computers",
    description: "13th-gen Intel Evo, OLED panel, and active stylus included.",
    location: "Toronto studio",
    accent: "from-sky-400/30 via-transparent to-transparent"
  },
  {
    name: "BMW X5",
    img: "/images/BMW X5 .png",
    category: "Vehicles",
    currentBid: 42000,
    reserve: 47000,
    bids: 18,
    watchers: 95,
    endsInMinutes: 310,
    link: "/categories/vehicles",
    description: "2022 xDrive40i M Sport, full dealer history, 18k miles.",
    location: "Zurich delivery bay",
    accent: "from-slate-400/30 via-transparent to-transparent"
  },
  {
    name: "Luxury Penthouse",
    img: "/images/Luxury Penthouse.png",
    category: "Real Estate",
    currentBid: 1200000,
    reserve: 1350000,
    bids: 9,
    watchers: 76,
    endsInMinutes: 920,
    link: "/categories/realestate",
    description: "Skyline duplex with rooftop plunge pool and rental yield study.",
    location: "Colombo 07",
    accent: "from-rose-400/30 via-transparent to-transparent"
  },
  {
    name: "Modern Art Canvas",
    img: "/images/Modern Art Canvas.png",
    category: "Art",
    currentBid: 15000,
    reserve: 26000,
    bids: 33,
    watchers: 164,
    endsInMinutes: 500,
    link: "/categories/art",
    description: "Oversized acrylic-on-linen, catalogued for Basel 2024.",
    location: "Barcelona atelier",
    accent: "from-indigo-400/30 via-transparent to-transparent"
  },
  {
    name: "Tesla Model S",
    img: "/images/Tesla Model S.png",
    category: "Vehicles",
    currentBid: 56200,
    reserve: 62000,
    bids: 26,
    watchers: 148,
    endsInMinutes: 360,
    link: "/categories/vehicles",
    description: "Dual-motor Long Range with FSD transfer and 24k miles.",
    location: "San Francisco showroom",
    accent: "from-red-400/30 via-transparent to-transparent"
  },
  {
    name: "Rolex Submariner",
    img: "/images/Rolex Submariner.png",
    category: "Watches",
    currentBid: 9800,
    reserve: 12500,
    bids: 38,
    watchers: 221,
    endsInMinutes: 260,
    link: "/categories/watches",
    description: "2021 stainless-steel date model with box, papers, and receipt.",
    location: "London vault",
    accent: "from-emerald-400/30 via-transparent to-transparent"
  },
  {
    name: "MacBook Pro 16\"",
    img: "/images/MacBook Pro 16.png",
    category: "Computers",
    currentBid: 2380,
    reserve: 2800,
    bids: 47,
    watchers: 156,
    endsInMinutes: 270,
    link: "/categories/computers",
    description: "M3 Max, 64GB RAM, 1TB SSD, and AppleCare through 2026.",
    location: "Los Angeles studio",
    accent: "from-cyan-400/30 via-transparent to-transparent"
  }
];

const categoryFilters = [
  "All",
  ...Array.from(new Set(trendingLots.map((item) => item.category)))
];

const liveStats = [
  { label: "Watchers online", value: "68k", change: "+8% today" },
  { label: "Lots trending", value: "42", change: "refreshes hourly" },
  { label: "Avg. uplift", value: "21%", change: "vs last week" },
  { label: "Verified sellers", value: "1.4k", change: "+57 new" }
];

const formatTime = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs <= 0) {
    return `${mins}m left`;
  }
  return `${hrs}h ${mins}m left`;
};

const getProgress = (current: number, reserve: number) => {
  if (!reserve) return 0;
  return Math.min(100, Math.round((current / reserve) * 100));
};

export default function TrendingAuctionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Auction | null>(null);
  const [bid, setBid] = useState("");
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"ending" | "price" | "bids">("ending");

  const filteredAuctions = trendingLots.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedAuctions = useMemo(() => {
    return [...filteredAuctions].sort((a, b) => {
      if (sortBy === "ending") {
        return a.endsInMinutes - b.endsInMinutes;
      }
      if (sortBy === "price") {
        return b.currentBid - a.currentBid;
      }
      return b.bids - a.bids;
    });
  }, [filteredAuctions, sortBy]);

  const heroHighlight = sortedAuctions[0] ?? trendingLots[0];
  const closingSoon = useMemo(
    () =>
      [...trendingLots]
        .sort((a, b) => a.endsInMinutes - b.endsInMinutes)
        .slice(0, 3),
    []
  );

  const openModal = (item: Auction) => {
    setSelectedItem(item);
    setBid("");
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setBid("");
    setError("");
  };

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bid || isNaN(Number(bid)) || Number(bid) <= (selectedItem?.currentBid || 0)) {
      setError("Please enter a valid bid higher than the current bid.");
      return;
    }
    closeModal();
    alert("Your bid has been placed!");
  };

  return (
    <div className="bg-[#0a1020] text-white">
      <section className="w-full bg-white text-[#0b1524]">
        <div className="flex min-h-screen w-full flex-col justify-center gap-12 px-6 py-16 lg:px-12 xl:px-20 2xl:px-32">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="order-2 flex flex-col gap-6 lg:order-1">
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#0b1524]/10 px-4 py-1 text-1.5xl font-semibold text-[#0b1524]">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Most watched lots live now
              </span>
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                Stay ahead of trending lots with instant market signals
              </h1>
              <p className="text-base md:text-lg text-[#4b5563] max-w-2xl">
                Track the hottest assets as they surge in demand. Filter by category, compare bid velocity, and jump in before these listings close.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => heroHighlight && openModal(heroHighlight)}
                  className="rounded-2xl bg-[#0b1524] text-white px-8 py-3 font-semibold transition hover:bg-[#111c30]"
                >
                  Place a live bid
                </button>
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
                <div className="h-72 rounded-3xl bg-slate-50 flex items-center justify-center">
                  <img
                    src={heroHighlight.img}
                    alt={heroHighlight.name}
                    className="h-52 object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold text-[#0b1524]">{heroHighlight.name}</h2>
                  <p className="text-sm text-slate-500">{heroHighlight.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-slate-500">Current bid</p>
                    <p className="text-2xl font-semibold text-[#0b1524]">${heroHighlight.currentBid.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-slate-500">Ends in</p>
                    <p className="text-2xl font-semibold text-[#0b1524]">{formatTime(heroHighlight.endsInMinutes)}</p>
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
                    <div key={lot.name} className="rounded-2xl bg-black/20 p-4">
                      <div className="flex items-center justify-between text-sm text-white/60">
                        <span>{lot.category}</span>
                        <span>{formatTime(lot.endsInMinutes)}</span>
                      </div>
                      <p className="mt-2 font-semibold">{lot.name}</p>
                      <p className="text-sm text-white/60">${lot.currentBid.toLocaleString()}</p>
                    </div>
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
                  const progress = getProgress(item.currentBid, item.reserve);
                  return (
                    <div
                      key={item.name}
                      className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-black/20 p-6 backdrop-blur"
                    >
                      <div
                        className={`absolute inset-0 rounded-3xl bg-gradient-to-br opacity-40 pointer-events-none ${item.accent}`}
                      />
                      <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide">
                            {item.category}
                          </span>
                          <span className="text-white/60">
                            {item.watchers} watchers · {item.bids} bids
                          </span>
                        </div>
                        <div className="h-48 rounded-2xl bg-black/30 flex items-center justify-center">
                          <img src={item.img} alt={item.name} className="max-h-40 object-contain" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                          <p className="text-sm text-white/60 mt-1">{item.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="rounded-2xl bg-white/5 p-3">
                            <p className="text-white/60">Current bid</p>
                            <p className="text-2xl font-semibold">${item.currentBid.toLocaleString()}</p>
                          </div>
                          <div className="rounded-2xl bg-white/5 p-3">
                            <p className="text-white/60">Reserve</p>
                            <p className="text-2xl font-semibold">${item.reserve.toLocaleString()}</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm text-white/60">
                            <span>{formatTime(item.endsInMinutes)}</span>
                            <span>{item.location}</span>
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
                            onClick={() => openModal(item)}
                            className="flex-1 rounded-2xl bg-white text-gray-900 py-3 font-semibold hover:bg-white/90"
                          >
                            Bid now
                          </button>
                          <Link
                            href={item.link}
                            className="flex-1 rounded-2xl border border-white/30 py-3 text-center font-semibold hover:border-white"
                          >
                            View lot
                          </Link>
                        </div>
                      </div>
                    </div>
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
            <h2 className="text-2xl font-bold">Bid for {selectedItem.name}</h2>
            <p className="text-sm text-white/60 mt-1">{selectedItem.location}</p>
            <div className="mt-4 rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Current bid</span>
                <span>Reserve</span>
              </div>
              <div className="flex items-center justify-between text-2xl font-semibold mt-1">
                <span>${selectedItem.currentBid.toLocaleString()}</span>
                <span>${selectedItem.reserve.toLocaleString()}</span>
              </div>
            </div>
            <form onSubmit={handleBid} className="mt-6 space-y-4">
              <label className="text-sm text-white/70" htmlFor="bid-input">
                Your bid
              </label>
              <input
                id="bid-input"
                type="number"
                min={selectedItem.currentBid + 1}
                value={bid}
                onChange={(e) => setBid(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-white focus:outline-none"
                placeholder={`Enter amount above $${selectedItem.currentBid.toLocaleString()}`}
                autoFocus
              />
              {error && <div className="text-red-400 text-sm">{error}</div>}
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

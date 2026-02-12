"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Eye, Bookmark, Wallet, Settings, Menu, Star } from "lucide-react";

// --- Types ---
interface Auction {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  currentBid: number;
  myBid?: number;
  endsIn: string;
  bidsCount: number;
  isWatchlisted: boolean;
  status: "active" | "won" | "ended";
  seller: string;
  trustScore: number;
}

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  userId: string | null;
};

type StoredBid = {
  id?: string;
  title?: string;
  category?: string;
  amount?: number;
  imageUrl?: string;
  placedAt?: string;
  userId?: string;
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&q=80&w=260&h=200";

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

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, tab: "all" as const },
  { label: "Active Bids", icon: Eye, tab: "bidding" as const },
  { label: "Watchlist", icon: Bookmark, tab: "watchlist" as const },
  { label: "My Reviews", icon: Star, tab: "reviews" as const },
  { label: "Payments", icon: Wallet, href: "/buyer/payments" },
  { label: "Settings", icon: Settings, href: "/buyer/settings" },
];

export default function BuyerDashboard() {
  // --- State ---
  const router = useRouter();
  const [auctions, setAuctions] = useState<Auction[]>(MOCK_AUCTIONS);
  const [activeTab, setActiveTab] = useState<"all" | "bidding" | "watchlist" | "reviews">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string | null; name: string | null; role: string | null } | null>(null);
  const [buyerReviews, setBuyerReviews] = useState<Review[]>([]);
  const pathname = usePathname();

  // --- Load user ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const id = parsed?.user?._id || parsed?.user?.id || parsed?.user?.uid || parsed?.user?.email || parsed?.user?.username || null;
      const name = parsed?.user?.username || parsed?.user?.name || parsed?.user?.email || null;
      const role = parsed?.user?.role || null;
      setCurrentUser({ id, name, role });
    } catch {
      // ignore
    }
  }, []);

  // --- Effects ---
  useEffect(() => {
    const loadAuctions = async () => {
      try {
        const { auctionAPI } = await import("../../lib/api");
        const apiAuctions = await auctionAPI.fetchAuctions();

        const formattedApiAuctions = apiAuctions.map((a: any) => ({
          id: a._id || a.id || `api-${Math.random()}`,
          title: a.title,
          category: a.category,
          imageUrl: a.imageUrl || FALLBACK_IMAGE,
          currentBid: a.currentBid || a.startPrice || 0,
          endsIn: "3d 5h", // Placeholder for actual time left logic
          bidsCount: a.bidsCount || 0,
          isWatchlisted: false,
          status: (a.status as "active" | "won" | "ended") || "active",
          seller: a.seller?.username || "Verified Seller",
          trustScore: 4.8,
        }));

        setAuctions((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNew = formattedApiAuctions.filter((a: any) => a.id && !existingIds.has(a.id));
          return [...uniqueNew, ...prev];
        });
      } catch (err) {
        console.error("Failed to load auctions for buyer:", err);
      }
    };
    loadAuctions();
  }, []);

  // --- Load buyer reviews ---
  useEffect(() => {
    if (typeof window === "undefined" || !currentUser?.id) return;
    try {
      const raw = window.localStorage.getItem("buyer-reviews");
      if (!raw) {
        setBuyerReviews([]);
        return;
      }
      const parsed = JSON.parse(raw) as Review[];
      const mine = Array.isArray(parsed)
        ? parsed.filter((r) => r.userId === currentUser.id)
        : [];
      setBuyerReviews(mine);
    } catch {
      setBuyerReviews([]);
    }
  }, [currentUser]);

  // --- Load buyer bids into dashboard ---
  useEffect(() => {
    if (typeof window === "undefined" || !currentUser?.id) return;
    try {
      const raw = window.localStorage.getItem("buyer-bids");
      const parsed = raw ? JSON.parse(raw) : [];
      const mine = Array.isArray(parsed)
        ? parsed.filter((b: StoredBid) => b.userId === currentUser.id)
        : [];

      if (mine.length === 0) return;

      const mapped: Auction[] = mine.map((b) => {
        const amount = Number(b.amount) || 0;
        return {
          id: b.id || `${b.title || "auction"}-${b.placedAt || b.userId || "bid"}`,
          title: b.title || "Auction",
          category: b.category || "General",
          imageUrl: b.imageUrl || FALLBACK_IMAGE,
          currentBid: amount || 100,
          myBid: amount || 100,
          endsIn: "Ends soon",
          bidsCount: 1,
          isWatchlisted: false,
          status: "active",
          seller: "Local Seller",
          trustScore: 4.8,
        };
      });

      setAuctions((prev) => {
        const mappedIds = new Set(mapped.map((m) => m.id));
        const remaining = prev.filter((a) => a.id && !mappedIds.has(a.id));
        return [...mapped, ...remaining];
      });
    } catch {
      // ignore parse/storage errors
    }
  }, [currentUser]);

  // --- Handlers ---
  const handleBid = (id: string) => {
    setAuctions((prev) =>
      prev.map((auction) => {
        if (auction.id === id) {
          const nextBid = auction.currentBid + 50;
          return { ...auction, currentBid: nextBid, myBid: nextBid, bidsCount: auction.bidsCount + 1 };
        }
        return auction;
      })
    );
    alert("Bid placed successfully!");
  };

  const handleClaim = (id: string) => {
    setAuctions((prev) =>
      prev.map((auction) =>
        auction.id === id
          ? { ...auction, status: "won", endsIn: "Ended" }
          : auction
      )
    );
    alert("Item claimed successfully!");
  };

  const toggleWatchlist = (id: string) => {
    setAuctions((prev) =>
      prev.map((auction) => (auction.id === id ? { ...auction, isWatchlisted: !auction.isWatchlisted } : auction))
    );
  };

  // --- Derived State ---
  const filteredAuctions = activeTab === "reviews"
    ? []
    : auctions.filter((auction) => {
      if (activeTab === "watchlist" && !auction.isWatchlisted) return false;
      if (activeTab === "bidding" && auction.myBid === undefined) return false;
      if (searchQuery && !auction.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

  const activeBidsCount = auctions.filter((a) => a.myBid && a.status === "active").length;
  const watchlistCount = auctions.filter((a) => a.isWatchlisted).length;
  const auctionsWon = auctions.filter((a) => a.status === "won").length;

  const isNavActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.tab) return activeTab === item.tab;
    return pathname === item.href;
  };

  const handleNavClick = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.tab) {
      setActiveTab(item.tab);
    }
  };

  const handleDeleteReview = (id: string) => {
    if (!currentUser?.id || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("buyer-reviews");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Review[];
      const nextAll = parsed.filter((r) => !(r.id === id && r.userId === currentUser.id));
      window.localStorage.setItem("buyer-reviews", JSON.stringify(nextAll));
      setBuyerReviews(nextAll.filter((r) => r.userId === currentUser.id));
    } catch {
      // ignore
    }
  };

  const renderStars = (count: number) => (
    <div className="flex items-center gap-1 text-lg text-emerald-300">
      {Array.from({ length: 5 }).map((_, idx) => (
        <span key={idx} className={idx < count ? "text-emerald-300" : "text-slate-600"}>★</span>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Hello, <span className="text-emerald-400">{displayName || "Buyer"}</span>
            </h1>
            <p className="mt-2 text-slate-400">Welcome to your auction command center. Find, bid, and win.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/categories">
              <button className="rounded-xl bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20">
                Browse Categories
              </button>
            </Link>
            <button
              onClick={() => router.push("/buyer/payments")}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              Deposit Funds
            </button>
          </div>
        </header>

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

        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <aside
            className={`relative shrink-0 rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b1324] to-[#050914] backdrop-blur transition-all duration-300 ${isCollapsed ? "w-28 p-2" : "w-full lg:w-72 p-3"
              } min-h-[80vh]`}
          >
            <div className="flex h-full flex-col gap-3">
              <div className="flex items-center gap-3 pr-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-white">
                    {(displayName || "B").charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`flex flex-col transition-all duration-300 ${isCollapsed
                      ? "pointer-events-none opacity-0 translate-x-1 w-0 max-w-0 overflow-hidden"
                      : "opacity-100 w-auto max-w-[180px]"
                      }`}
                  >
                    <p className="text-xs uppercase tracking-wide text-white/50">Profile</p>
                    <p className="text-sm font-semibold text-white">{displayName || "Buyer"}</p>
                  </div>
                </div>
                <button
                  aria-label="Toggle sidebar"
                  onClick={() => setIsCollapsed((prev) => !prev)}
                  className="ml-auto rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:border-emerald-400/60 hover:text-emerald-200"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-3">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item);
                  const body = (
                    <div
                      className={`group flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-200 ${active
                        ? "border-emerald-400/60 bg-emerald-500/10 text-white shadow-[0_10px_30px_rgba(16,185,129,0.15)]"
                        : "border-white/10 text-white/70 hover:border-emerald-400/50 hover:text-white"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span
                        className={`transition-all duration-200 ${isCollapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-xs"
                          }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );

                  if (item.tab) {
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleNavClick(item)}
                        className="w-full text-left"
                      >
                        {body}
                      </button>
                    );
                  }

                  return (
                    <Link key={item.href} href={item.href!}>
                      {body}
                    </Link>
                  );
                })}
              </nav>

              {!isCollapsed && (
                <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-indigo-500/20 p-3 text-sm text-emerald-50 shadow-[0_12px_28px_rgba(16,185,129,0.16)]">
                  <p className="text-xs uppercase tracking-wide text-emerald-50/80">Save more</p>
                  <p className="mt-1 text-sm font-semibold text-white">Enable alerts</p>
                  <p className="mt-1 text-emerald-50/80">Get notified when bids move or auctions end.</p>
                  <button className="mt-3 w-full rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white">
                    Turn on alerts
                  </button>
                </div>
              )}
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            {activeTab === "reviews" ? (
              <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Your reviews</p>
                    <h2 className="text-2xl font-bold text-white">Buyer feedback you shared</h2>
                    <p className="text-sm text-slate-400">Only your reviews appear here. You can delete them anytime.</p>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
                    {buyerReviews.length} total
                  </span>
                </div>

                {buyerReviews.length === 0 ? (
                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-400">
                    No reviews yet. Share feedback from the homepage review form—your entries will show here.
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {buyerReviews.map((review) => {
                      const formattedDate = review.date
                        ? new Date(review.date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
                        : "";
                      const initials = review.name
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join("") || "?";

                      return (
                        <div key={review.id} className="rounded-2xl border border-emerald-400/20 bg-[#0b1220] p-4 shadow-lg shadow-emerald-500/10">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/90 text-sm font-bold text-[#0b1220]">
                              {initials}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <p className="text-base font-semibold text-white">{review.name}</p>
                              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Buyer{formattedDate ? ` • ${formattedDate}` : ""}</p>
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-slate-200">{review.text}</p>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review.id)}
                            className="mt-3 inline-flex text-sm font-semibold text-red-300 hover:text-red-200"
                          >
                            Delete review
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            ) : (
              <>
                <div className="sticky top-4 z-10 flex flex-col gap-4 bg-[#040918]/90 py-2 backdrop-blur md:flex-row md:items-center md:justify-between">
                  <div className="flex space-x-1 rounded-xl bg-white/5 p-1">
                    {(["all", "bidding", "watchlist"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === tab ? "bg-emerald-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                          }`}
                      >
                        {tab === "all" ? "All Auctions" : tab === "bidding" ? "My Bids" : "Watchlist"}
                      </button>
                    ))}
                  </div>

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
                        onClaim={handleClaim}
                        onWatchlist={toggleWatchlist}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Components ---

function AuctionCard({
  auction,
  onBid,
  onClaim,
  onWatchlist,
}: {
  auction: Auction;
  onBid: (id: string) => void;
  onClaim: (id: string) => void;
  onWatchlist: (id: string) => void;
}) {
  const statusTone = auction.status === "won"
    ? "bg-amber-500/20 text-amber-200"
    : auction.status === "active"
      ? "bg-emerald-500/15 text-emerald-200"
      : "bg-white/10 text-white/70";

  const shouldShowClaim = auction.status === "won" || auction.myBid !== undefined;

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
          className="absolute inset-0 h-full w-full object-contain object-center transition duration-500 group-hover:scale-105"
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
        {shouldShowClaim ? (
          <button
            onClick={() => onClaim(auction.id)}
            className="flex-1 rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-amber-400"
          >
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

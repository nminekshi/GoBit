"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Eye, Bookmark, Settings, Menu, Star, Bot } from "lucide-react";

// --- Types ---
interface Auction {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  currentBid: number;
  myBid?: number;
  endsIn: string;
  startTime?: string;
  endTime?: string;
  saleStatus?: "pending" | "claim-initiated" | "paid";
  paidAt?: string;
  winnerId?: string;
  bidsCount: number;
  isWatchlisted: boolean;
  status: "active" | "won" | "ended" | "paid";
  seller: string;
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

// --- Helpers ---
const formatDuration = (ms: number) => {
  if (ms <= 0) return "0m";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${Math.max(1, minutes)}m`;
};

const getPhaseLabel = (startTime?: string | Date, endTime?: string | Date) => {
  const now = Date.now();
  const start = startTime ? new Date(startTime).getTime() : now;
  const end = endTime ? new Date(endTime).getTime() : now;

  if (start > now) return { label: `Starts in ${formatDuration(start - now)}`, phase: "upcoming" as const };
  if (end <= now) return { label: "Ended", phase: "ended" as const };
  return { label: `Ends in ${formatDuration(end - now)}`, phase: "live" as const };
};

// --- Mock Data --- (REMOVED)

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, tab: "all" as const },
  { label: "Active Bids", icon: Eye, tab: "bidding" as const },
  { label: "Watchlist", icon: Bookmark, tab: "watchlist" as const },
  { label: "My Reviews", icon: Star, tab: "reviews" as const },
  { label: "Smart Agent", icon: Bot, href: "/buyer/smart-auto-bidding" },
  { label: "Settings", icon: Settings, href: "/buyer/settings" },
];

export default function BuyerDashboard() {
  // --- State ---
  const router = useRouter();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "bidding" | "watchlist" | "reviews">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [summary, setSummary] = useState({ activeBidsCount: 0, watchlistCount: 0, wonCount: 0 });
  const [currentUser, setCurrentUser] = useState<{ id: string | null; name: string | null; role: string | null } | null>(null);
  const [buyerReviews, setBuyerReviews] = useState<Review[]>([]);
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // --- Load user ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const id = parsed?.user?._id || parsed?.user?.id || parsed?.user?.uid || null;
      const name = parsed?.user?.username || parsed?.user?.name || null;
      const role = parsed?.user?.role || null;
      setCurrentUser({ id, name, role });
      setDisplayName(name);
    } catch { /* ignore */ }
  }, []);

  // --- Load Data based on Current Context ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { auctionAPI } = await import("../../lib/api");
        let data: any[] = [];

        if (activeTab === "all") {
          data = await auctionAPI.fetchAuctions();
        } else if (activeTab === "bidding") {
          data = await auctionAPI.fetchMyBids();
        } else if (activeTab === "watchlist") {
          data = await auctionAPI.fetchMyWatchlist();
        }

        const stats = await auctionAPI.fetchBuyerSummary();
        setSummary(stats);

        // Fetch watchlist separately if we have a user
        let currentWatchedIds = new Set<string>();
        if (currentUser?.id) {
          const watchlist = await auctionAPI.fetchMyWatchlist();
          currentWatchedIds = new Set(watchlist.map((a: any) => a._id || a.id));
          setWatchedIds(currentWatchedIds);
        }

        const formatted = data.map((a: any) => {
          const myBids = a.bids?.filter((b: any) => b.bidderId === currentUser?.id) || [];
          const myHighestBid = myBids.length > 0 ? Math.max(...myBids.map((b: any) => b.bidAmount)) : undefined;

          const phaseInfo = getPhaseLabel(a.startTime, a.endTime);
          const userIsWinner = Boolean(a.winnerId && currentUser?.id && a.winnerId === currentUser.id);
          const isPaid = Boolean(a.saleStatus === "paid" || a.paidAt);
          const status: Auction["status"] = isPaid
            ? "paid"
            : phaseInfo.phase === "ended"
              ? (userIsWinner ? "won" : "ended")
              : (a.status as "active" | "won" | "ended");

          return {
            id: a._id || a.id,
            title: a.title,
            category: a.category,
            imageUrl: a.imageUrl || FALLBACK_IMAGE,
            currentBid: a.currentBid || a.startPrice || 0,
            myBid: myHighestBid,
            endsIn: phaseInfo.label,
            startTime: a.startTime,
            endTime: a.endTime,
            saleStatus: a.saleStatus,
            paidAt: a.paidAt,
            winnerId: a.winnerId,
            bidsCount: a.bidsCount || 0,
            isWatchlisted: activeTab === "watchlist" || currentWatchedIds.has(a._id || a.id),
            status,
            seller: a.sellerId?.username || "Unknown",
          };
        });

        setAuctions(formatted);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.id || activeTab === "all") {
      loadData();
    }
  }, [activeTab, currentUser?.id]);

  // --- Load buyer reviews (keep for now) ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("buyer-reviews");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Review[];
      const mine = Array.isArray(parsed) && currentUser?.id
        ? parsed.filter((r) => r.userId === currentUser.id)
        : [];
      setBuyerReviews(mine);
    } catch { /* ignore */ }
  }, [currentUser]);

  // --- Handlers ---
  const handleBid = async (id: string) => {
    try {
      const { auctionAPI } = await import("../../lib/api");
      const auction = auctions.find(a => a.id === id);
      if (!auction) return;

      const nextBid = auction.currentBid + 50;
      await auctionAPI.placeBid(id, nextBid);

      // Update local state for immediate feedback
      setAuctions(prev => prev.map(a => a.id === id ? {
        ...a,
        currentBid: nextBid,
        myBid: nextBid,
        bidsCount: a.bidsCount + 1
      } : a));

      // Refresh summary
      const stats = await auctionAPI.fetchBuyerSummary();
      setSummary(stats);

      alert("Bid placed successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to place bid");
    }
  };

  const handleClaim = async (id: string) => {
    try {
      const { auctionAPI } = await import("../../lib/api");
      const res = await auctionAPI.claimAuction(id);
      alert(res.message || "Claim started. Proceed to payment.");
      const nextPath = res.checkoutPath || `/checkout/${id}`;
      router.push(nextPath);
    } catch (err: any) {
      alert(err?.message || "Failed to claim item");
    }
  };

  const toggleWatchlist = async (id: string) => {
    try {
      const { auctionAPI } = await import("../../lib/api");
      const res = await auctionAPI.toggleWatchlist(id);

      setAuctions(prev => prev.map(a => a.id === id ? { ...a, isWatchlisted: res.isWatched } : a));

      // Update watchedIds set locally
      setWatchedIds(prev => {
        const next = new Set(prev);
        if (res.isWatched) next.add(id);
        else next.delete(id);
        return next;
      });

      // Refresh summary
      const stats = await auctionAPI.fetchBuyerSummary();
      setSummary(stats);
    } catch (err: any) {
      alert("Failed to update watchlist");
    }
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
              onClick={() => router.push("/buyer/smart-auto-bidding")}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              Smart Agent
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-400">Active Bids</p>
            <p className="mt-2 text-3xl font-bold text-white">{summary.activeBidsCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-400">Watchlist</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">{summary.watchlistCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-400">Auctions Won</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">{summary.wonCount}</p>
          </div>
        </section>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-6 lg:flex-row">
            <aside
              className={`relative shrink-0 rounded-3xl border border-white/10 bg-linear-to-b from-[#0b1324] to-[#050914] backdrop-blur transition-all duration-300 ${isCollapsed ? "w-28 p-2" : "w-full lg:w-72 p-3"
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
                  <div className="mt-auto rounded-2xl border border-white/10 bg-linear-to-br from-emerald-500/20 via-cyan-500/15 to-indigo-500/20 p-3 text-sm text-emerald-50 shadow-[0_12px_28px_rgba(16,185,129,0.16)]">
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
        )}
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
  const statusTone = auction.status === "paid"
    ? "bg-emerald-500/20 text-emerald-100"
    : auction.status === "won"
      ? "bg-amber-500/20 text-amber-200"
      : auction.status === "active"
        ? "bg-emerald-500/15 text-emerald-200"
        : "bg-white/10 text-white/70";
  const isPaid = auction.status === "paid";
  const shouldShowClaim = !isPaid && auction.status === "won";

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

      <Link href={`/auctions/${auction.id}`} className="block">
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <img
            src={auction.imageUrl}
            alt={auction.title}
            className="absolute inset-0 h-full w-full object-contain object-center transition duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#040918] via-transparent to-transparent opacity-70" />
        </div>
      </Link>

      <div className="space-y-1">
        <Link href={`/auctions/${auction.id}`} className="block">
          <h3 className="text-xl font-semibold leading-tight group-hover:text-emerald-300">
            {auction.title}
          </h3>
        </Link>
        <p className="text-sm text-white/60">
          Sold by <span className="text-white/80">{auction.seller}</span>
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
          {auction.startTime && (
            <p className="text-xs text-white/60">Starts: {new Date(auction.startTime).toLocaleString()}</p>
          )}
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
        {isPaid ? (
          <Link
            href={`/order-confirmation/${auction.id}`}
            className="flex-1 rounded-2xl bg-emerald-500 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-emerald-400"
          >
            View receipt
          </Link>
        ) : shouldShowClaim ? (
          <button
            onClick={() => onClaim(auction.id)}
            className="flex-1 rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-amber-400"
          >
            Checkout
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

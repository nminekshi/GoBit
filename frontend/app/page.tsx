"use client";
import Link from "next/link";
import FAQ from "./components/FAQ";
import { useCallback, useEffect, useMemo, useState, FormEvent } from "react";
import { auctionAPI } from "./lib/api";

type HomeAuction = {
  _id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl?: string;
  startPrice: number;
  currentBid: number;
  startTime?: string;
  endTime: string;
  watchers?: number;
  bids?: { bidAmount: number; bidderId?: string; timestamp?: string }[];
  location?: string;
};

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  userId: string | null;
  role?: string | null;
};

const now = () => new Date().getTime();

const isActive = (auction: HomeAuction) => {
  const start = auction.startTime ? new Date(auction.startTime).getTime() : now();
  const end = auction.endTime ? new Date(auction.endTime).getTime() : 0;
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

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HomeAuction | null>(null);
  const [bid, setBid] = useState("");
  const [error, setError] = useState("");
  const [featuredAuctions, setFeaturedAuctions] = useState<HomeAuction[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string | null; name: string | null; role: string | null; avatar?: string | null } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("buyer-reviews");
    if (saved) {
      try {
        const parsed: Review[] = JSON.parse(saved);
        const filtered = Array.isArray(parsed) ? parsed.filter((r) => !!r.userId) : [];
        setReviews(filtered);
        if (filtered.length !== parsed.length) {
          window.localStorage.setItem("buyer-reviews", JSON.stringify(filtered));
        }
      } catch {
        setReviews([]);
        window.localStorage.setItem("buyer-reviews", JSON.stringify([]));
      }
    } else {
      setReviews([]);
      window.localStorage.setItem("buyer-reviews", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const id = parsed?.user?._id || parsed?.user?.id || parsed?.user?.uid || parsed?.user?.email || parsed?.user?.username || null;
      const name = parsed?.user?.username || parsed?.user?.name || parsed?.user?.email || null;
      const role = parsed?.user?.role || null;
      const avatar = parsed?.user?.avatar || parsed?.user?.photoURL || null;
      setCurrentUser({ id, name, role, avatar });
      if (name) {
        setReviewName(name);
      }
    } catch {
      // ignore malformed auth
    }
  }, []);

  const loadFeaturedAuctions = useCallback(async () => {
    setFeaturedLoading(true);
    setFeaturedError(null);
    try {
      const data = await auctionAPI.fetchAuctions();
      const active = (data || []).filter(isActive);
      const ranked = active.sort(
        (a: any, b: any) =>
          (b.watchers || 0) + (b.bids?.length || 0) - ((a.watchers || 0) + (a.bids?.length || 0)) ||
          (b.currentBid || 0) - (a.currentBid || 0)
      );
      setFeaturedAuctions(ranked.slice(0, 5));
    } catch (err: any) {
      setFeaturedError(err?.message || "Failed to load featured auctions");
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedAuctions();
  }, [loadFeaturedAuctions]);

  const heroStats = useMemo(() => {
    const lots = featuredAuctions.length;
    const totalBids = featuredAuctions.reduce((sum, a) => sum + (a.bids?.length || 0), 0);
    const bidders = new Set(
      featuredAuctions.flatMap((a) => (a.bids || []).map((b: any) => b.bidderId || b.userId || "unknown"))
    ).size;
    return [
      { icon: "👤", label: "Active bidders", value: bidders ? bidders.toLocaleString() : "0", note: "across featured lots" },
      { icon: "📦", label: "Live lots", value: lots.toString(), note: "available right now" },
      { icon: "⚡", label: "Total bids", value: totalBids.toString(), note: "counted in real time" },
    ];
  }, [featuredAuctions]);

  const openModal = (item: HomeAuction) => {
    setSelectedItem(item);
    const minimum = (item.currentBid || item.startPrice || 0) + 1;
    setBid(minimum ? String(minimum) : "");
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setBid("");
    setError("");
  };

  const handleBid = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) return;
    const amount = Number(bid);
    const floor = (selectedItem.currentBid || selectedItem.startPrice || 0) + 1;
    if (!amount || isNaN(amount) || amount < floor) {
      setError(`Please enter a bid of at least ${floor}.`);
      return;
    }
    try {
      await auctionAPI.placeBid(selectedItem._id, amount);
      await loadFeaturedAuctions();
      closeModal();
      alert("Your bid has been placed!");
    } catch (err: any) {
      setError(err?.message || "Failed to place bid");
    }
  };

  const handleReviewSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewError(null);

    const isBuyer = currentUser?.role?.toLowerCase() === "buyer";
    if (!currentUser || !isBuyer) {
      setReviewError("Only logged-in buyers can submit reviews.");
      return;
    }

    if (!reviewName.trim() || !reviewText.trim()) {
      setReviewError("Please add your name and review before submitting.");
      return;
    }

    const nextRating = Math.min(5, Math.max(1, reviewRating));
    const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}`;
    const nextReview: Review = {
      id,
      name: reviewName.trim(),
      rating: nextRating,
      text: reviewText.trim(),
      date: new Date().toISOString(),
      userId: currentUser.id,
      role: currentUser.role,
    };

    setReviews((prev) => {
      const next = [nextReview, ...prev];
      if (typeof window !== "undefined") {
        window.localStorage.setItem("buyer-reviews", JSON.stringify(next));
      }
      return next;
    });

    setReviewText("");
  };

  const handleReviewDelete = (id: string) => {
    if (!currentUser || currentUser.role?.toLowerCase() !== "buyer") return;
    setReviews((prev) => {
      const target = prev.find((r) => r.id === id);
      if (!target || target.userId !== currentUser.id) return prev;
      const next = prev.filter((r) => r.id !== id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("buyer-reviews", JSON.stringify(next));
      }
      return next;
    });
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <span key={idx} className={idx < count ? "text-emerald-300" : "text-gray-500"}>★</span>
    ));
  };

  return (
    <div className="bg-white">
      {/* Hero Section With Stats */}
      <section className="w-screen min-h-[700px] flex flex-col items-center justify-center px-6 md:px-12 py-10 bg-linear-to-b from-[#040918] via-[#050b1a] to-white">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-full gap-10">
          <div className="flex-1 flex flex-col items-start justify-center gap-5 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
              Live auctions · Secure bidding
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                Discover, bid and win
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Explore auctions
                <br />
                across every category
              </h1>
              <p className="text-base md:text-lg text-white/70 max-w-xl">
                Browse verified listings for vehicles, watches, electronics, property and more, then place your bid in just a few clicks.
              </p>
              <p className="text-sm md:text-base text-emerald-300">
                Secure payments, transparent timelines and tracked delivery for every winning bid.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/ongoing-auctions">
                <span className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow hover:bg-white/90 transition">
                  Explore live auctions
                </span>
              </Link>
              <Link href="/how-to-buy">
                <span className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:border-white transition">
                  How buying works
                </span>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <img
              src="remove.png"
              alt="Auction Hero"
              className="max-w-[600px] md:max-w-[700px] lg:max-w-[800px] w-full h-auto object-contain"
              style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.35))", border: "none" }}
            />
          </div>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 px-4 mt-12">
          {heroStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center bg-white/90 rounded-2xl p-6 shadow-lg text-center">
              <span className="text-3xl mb-2">{stat.icon}</span>
              <span className="text-3xl font-extrabold text-gray-900">{featuredLoading ? "..." : stat.value}</span>
              <span className="text-gray-600 font-medium mt-1">{stat.label}</span>
              <span className="text-xs text-gray-500 mt-1">{stat.note}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Most Loved Auctions Section */}
      <section className="bg-[#0b1524] text-white w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-6 sm:px-12 lg:px-20 py-24">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4">Highly Favored Auction Listings</h2>
            <p className="mt-4 text-lg text-gray-200 max-w-3xl mx-auto">Explore top-rated listings from active and popular auctions across multiple categories</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {featuredLoading &&
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl h-full animate-pulse" />
              ))}

            {!featuredLoading && featuredError && (
              <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-gray-900/60 p-8 text-center text-white">
                <p className="text-lg text-rose-200">{featuredError}</p>
                <button
                  onClick={loadFeaturedAuctions}
                  className="rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                >
                  Retry
                </button>
              </div>
            )}

            {!featuredLoading && !featuredError && featuredAuctions.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center gap-2 rounded-3xl border border-white/10 bg-gray-900/60 p-8 text-center text-white">
                <p className="text-lg font-semibold">No live auctions yet</p>
                <p className="text-sm text-gray-300">Check back soon or explore all ongoing auctions.</p>
                <Link
                  href="/ongoing-auctions"
                  className="mt-2 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-2 text-sm font-semibold text-gray-900 hover:bg-white/90"
                >
                  Browse all auctions
                </Link>
              </div>
            )}

            {!featuredLoading && !featuredError &&
              featuredAuctions.map((auction) => {
                const bidCount = auction.bids?.length || 0;
                const watchers = auction.watchers ?? 0;
                const displayImage = auction.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80";
                const label = `${auction.category || "Auction"} | ${formatCountdown(auction.endTime)}`;
                const minNextBid = (auction.currentBid || auction.startPrice || 0) + 1;
                const currentBidDisplay = auction.currentBid ?? auction.startPrice ?? 0;
                return (
                  <div
                    key={auction._id}
                    className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl flex flex-col h-full transition-transform duration-200 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
                  >
                    <div className="relative rounded-2xl bg-gray-800/60 p-6 overflow-hidden">
                      <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white/90">
                        {label}
                      </span>
                      <img src={displayImage} alt={auction.title} className="w-full h-56 object-contain" />
                      <button aria-label="favorite" className="absolute bottom-3 right-3 text-white/80 hover:text-white">♡</button>
                    </div>
                    <div className="mt-6 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-white text-lg font-semibold line-clamp-2">{auction.title}</h3>
                        <p className="text-gray-300 text-sm line-clamp-2">{auction.description || "Featured live lot"}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        {bidCount} bids
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
                      <span>Current bid: LKR {currentBidDisplay.toLocaleString()}</span>
                      <span>{watchers} watchers</span>
                    </div>
                    <div className="mt-auto flex flex-col gap-3 pt-4">
                      <button
                        className="w-full py-3 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
                        onClick={() => openModal(auction)}
                      >
                        Bid Now
                      </button>
                      <Link href={`/auctions/${auction._id}`} className="w-full">
                        <span className="inline-flex w-full items-center justify-center py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition">Go to Auction</span>
                      </Link>
                      <p className="text-[11px] text-gray-400 text-center">Minimum next bid LKR {minNextBid.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-gradient-to-b from-[#070d17] via-[#0b1220] to-[#0b1524] text-white px-4 py-20">
        <div className="w-full max-w-none mx-auto">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-emerald-300">Share your experience</p>
              <h2 className="text-3xl md:text-4xl font-bold">Latest Customer Stories</h2>
            </div>
            <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
              {reviews.length} total
            </span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl bg-[#0e1625] border border-emerald-400/20 p-6 shadow-xl shadow-emerald-500/10">
              <form className="space-y-5" onSubmit={handleReviewSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200">Your name *</label>
                  <input
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-emerald-400/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200">Rating</label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const star = idx + 1;
                      const active = star <= reviewRating;
                      return (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`h-10 w-10 rounded-xl border transition ${active ? "border-emerald-400 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/5 text-gray-500"}`}
                          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                          <span className="text-xl">★</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200">Your review *</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us about your visit..."
                    className="w-full rounded-2xl border border-emerald-400/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 min-h-[140px] focus:border-emerald-400 focus:outline-none resize-none"
                  />
                </div>

                {reviewError && <p className="text-sm text-red-400">{reviewError}</p>}
                {!currentUser && <p className="text-xs text-gray-400">Log in as a buyer to submit a review.</p>}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
                >
                  Submit Review
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {reviews.map((review) => {
                const isOwner = currentUser?.id && review.userId === currentUser.id;
                const formattedDate = review.date ? new Date(review.date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "";
                const initials = review.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("") || "?";

                return (
                  <div key={review.id} className="rounded-3xl bg-[#0f1729] border border-emerald-400/15 p-5 shadow-lg shadow-emerald-500/10">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/80 text-base font-bold text-[#0a1510]">
                        {initials}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-base font-semibold text-white">{review.name}</p>
                        <p className="text-xs uppercase tracking-[0.12em] text-gray-400">{review.role === "buyer" ? "Buyer" : "Guest"}{formattedDate ? ` • ${formattedDate}` : ""}</p>
                        <div className="flex items-center gap-1 text-lg">{renderStars(review.rating)}</div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-100">{review.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {modalOpen && selectedItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0a111d] p-8 shadow-2xl text-white">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-2xl text-white/40 hover:text-white"
              aria-label="Close bid modal"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold">Bid for {selectedItem.title}</h2>
            <p className="text-sm text-white/60 mt-1">{selectedItem.location || "Online listing"}</p>
            <div className="mt-4 rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Current bid</span>
                <span>Starting bid</span>
              </div>
              <div className="flex items-center justify-between text-2xl font-semibold mt-1">
                <span>LKR {(selectedItem.currentBid ?? selectedItem.startPrice ?? 0).toLocaleString()}</span>
                <span>LKR {(selectedItem.startPrice ?? selectedItem.currentBid ?? 0).toLocaleString()}</span>
              </div>
            </div>
            <form onSubmit={handleBid} className="mt-6 space-y-4">
              <label className="text-sm text-white/70" htmlFor="home-bid-input">
                Your bid
              </label>
              <input
                id="home-bid-input"
                type="number"
                min={(selectedItem.currentBid || selectedItem.startPrice || 0) + 1}
                value={bid}
                onChange={(e) => setBid(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-white focus:outline-none"
                placeholder={`Enter amount above LKR ${(selectedItem.currentBid || selectedItem.startPrice || 0).toLocaleString()}`}
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

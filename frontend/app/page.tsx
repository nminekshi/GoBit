"use client";
import Link from "next/link";
import FAQ from "./components/FAQ";
import { useEffect, useState, FormEvent } from "react";

type HomeAuctionBid = {
  name: string;
  currentBid: number;
  reserve: number;
  location: string;
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

const SEED_REVIEWS: Review[] = [
  {
    id: "seed-1",
    name: "Min Lee",
    rating: 5,
    text: "Bidding felt smooth and transparent—won my item without surprises.",
    date: "2026-01-22",
    userId: null,
    role: "guest",
  },
  {
    id: "seed-2",
    name: "Nim Jay",
    rating: 5,
    text: "Highly recommended. Listings were clear and support was responsive.",
    date: "2026-01-21",
    userId: null,
    role: "guest",
  },
  {
    id: "seed-3",
    name: "Riya Das",
    rating: 5,
    text: "Great experience—felt safe paying and the delivery updates were solid.",
    date: "2026-01-20",
    userId: null,
    role: "guest",
  },
  {
    id: "seed-4",
    name: "Kushani Perera",
    rating: 4,
    text: "Loved the vibe and the watch I won arrived exactly as described.",
    date: "2026-01-18",
    userId: null,
    role: "guest",
  },
  {
    id: "seed-5",
    name: "Min Silva",
    rating: 4,
    text: "Clear bidding steps and fair closing times—would bid again soon.",
    date: "2026-01-16",
    userId: null,
    role: "guest",
  },
  {
    id: "seed-6",
    name: "Riya Fernando",
    rating: 5,
    text: "Yummy experience all around—great finds and quick confirmations!",
    date: "2026-01-15",
    userId: null,
    role: "guest",
  },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HomeAuctionBid | null>(null);
  const [bid, setBid] = useState("");
  const [error, setError] = useState("");
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
        setReviews(parsed);
      } catch {
        setReviews(SEED_REVIEWS);
        window.localStorage.setItem("buyer-reviews", JSON.stringify(SEED_REVIEWS));
      }
    } else {
      setReviews(SEED_REVIEWS);
      window.localStorage.setItem("buyer-reviews", JSON.stringify(SEED_REVIEWS));
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

  const openModal = (item: HomeAuctionBid) => {
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

  const handleBid = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bid || isNaN(Number(bid)) || Number(bid) <= (selectedItem?.currentBid || 0)) {
      setError("Please enter a valid bid higher than the current bid.");
      return;
    }
    closeModal();
    alert("Your bid has been placed!");
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
          <div className="flex flex-col items-center bg-white/90 rounded-2xl p-6 shadow-lg">
            <span className="text-3xl mb-2">👤</span>
            <span className="text-3xl font-extrabold text-gray-900">50K+</span>
            <span className="text-gray-600 font-medium mt-1">Active bidders this month</span>
          </div>
          <div className="flex flex-col items-center bg-white/90 rounded-2xl p-6 shadow-lg">
            <span className="text-3xl mb-2">📦</span>
            <span className="text-3xl font-extrabold text-gray-900">2K+</span>
            <span className="text-gray-600 font-medium mt-1">Lots across all categories</span>
          </div>
          <div className="flex flex-col items-center bg-white/90 rounded-2xl p-6 shadow-lg">
            <span className="text-3xl mb-2">✅</span>
            <span className="text-3xl font-extrabold text-gray-900">100%</span>
            <span className="text-gray-600 font-medium mt-1">Secure payments & support</span>
          </div>
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
            {/* Card 1 */}
            <div className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl flex flex-col h-full transition-transform duration-200 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]">
              <div className="relative rounded-2xl bg-gray-800/60 p-6 overflow-hidden">
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white/90">
                  Watches  b7 Live now
                </span>
                <img src="/images/Rolex Submariner.png" alt="Rolex Submariner" className="w-full h-56 object-contain" />
                <button aria-label="favorite" className="absolute bottom-3 right-3 text-white/80 hover:text-white">♡</button>
              </div>
              <div className="mt-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white text-lg font-semibold">Rolex Submariner</h3>
                  <p className="text-gray-300 text-sm">Automatic  b7 Stainless steel</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  ★ 8.5 score
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
                <span>Current bid: $9,500</span>
                <span>85 watchers</span>
              </div>
              <div className="mt-auto flex flex-col gap-3 pt-4">
                <button
                  className="w-full py-3 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
                  onClick={() =>
                    openModal({
                      name: "Rolex Submariner",
                      currentBid: 9500,
                      reserve: 12000,
                      location: "London vault",
                    })
                  }
                >
                  Bid Now
                </button>
                <Link href="/ongoing-auctions" className="w-full">
                  <span className="inline-flex w-full items-center justify-center py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition">Go to Auction</span>
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl flex flex-col h-full transition-transform duration-200 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]">
              <div className="relative rounded-2xl bg-gray-800/60 p-6 overflow-hidden">
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white/90">
                  Vehicles  b7 Live now
                </span>
                <img src="/images/Audi Q7.png" alt="Audi Q7" className="w-full h-56 object-contain" />
                <button aria-label="favorite" className="absolute bottom-3 right-3 text-white/80 hover:text-white">♡</button>
              </div>
              <div className="mt-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white text-lg font-semibold">Audi Q7</h3>
                  <p className="text-gray-300 text-sm">SUV  b7 2021 model</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  ★ 8.7 score
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
                <span>Current bid: $32,800</span>
                <span>64 watchers</span>
              </div>
              <div className="mt-auto flex flex-col gap-3 pt-4">
                <button
                  className="w-full py-3 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
                  onClick={() =>
                    openModal({
                      name: "Audi Q7",
                      currentBid: 32800,
                      reserve: 38000,
                      location: "Colombo showroom",
                    })
                  }
                >
                  Bid Now
                </button>
                <Link href="/ongoing-auctions" className="w-full">
                  <span className="inline-flex w-full items-center justify-center py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition">Go to Auction</span>
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl flex flex-col h-full transition-transform duration-200 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]">
              <div className="relative rounded-2xl bg-gray-800/60 p-6 overflow-hidden">
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white/90">
                  Electronics  b7 Ending soon
                </span>
                <img src="/images/MacBook Pro 16.png" alt="MacBook Pro 16" className="w-full h-56 object-contain" />
                <button aria-label="favorite" className="absolute bottom-3 right-3 text-white/80 hover:text-white">♡</button>
              </div>
              <div className="mt-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white text-lg font-semibold">MacBook Pro 16"</h3>
                  <p className="text-gray-300 text-sm">M-series  b7 16" display</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  ★ 8.6 score
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
                <span>Current bid: $2,750</span>
                <span>51 watchers</span>
              </div>
              <div className="mt-auto flex flex-col gap-3 pt-4">
                <button
                  className="w-full py-3 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
                  onClick={() =>
                    openModal({
                      name: "MacBook Pro 16\"",
                      currentBid: 2750,
                      reserve: 3200,
                      location: "Tech hub, Colombo",
                    })
                  }
                >
                  Bid Now
                </button>
                <Link href="/ongoing-auctions" className="w-full">
                  <span className="inline-flex w-full items-center justify-center py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition">Go to Auction</span>
                </Link>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl flex flex-col h-full transition-transform duration-200 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]">
              <div className="relative rounded-2xl bg-gray-800/60 p-6 overflow-hidden">
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white/90">
                  Real estate  b7 Premium
                </span>
                <img src="/images/Beach House.png" alt="Beach House" className="w-full h-56 object-contain" />
                <button aria-label="favorite" className="absolute bottom-3 right-3 text-white/80 hover:text-white">♡</button>
              </div>
              <div className="mt-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white text-lg font-semibold">Beach House</h3>
                  <p className="text-gray-300 text-sm">Oceanfront  b7 4 bedrooms</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  ★ 8.8 score
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
                <span>Current bid: $420,000</span>
                <span>23 watchers</span>
              </div>
              <div className="mt-auto flex flex-col gap-3 pt-4">
                <button
                  className="w-full py-3 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
                  onClick={() =>
                    openModal({
                      name: "Beach House",
                      currentBid: 420000,
                      reserve: 500000,
                      location: "Southern coast, Sri Lanka",
                    })
                  }
                >
                  Bid Now
                </button>
                <Link href="/ongoing-auctions" className="w-full">
                  <span className="inline-flex w-full items-center justify-center py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition">Go to Auction</span>
                </Link>
              </div>
            </div>

            {/* Card 5 */}
            <div className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl flex flex-col h-full transition-transform duration-200 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]">
              <div className="relative rounded-2xl bg-gray-800/60 p-6 overflow-hidden">
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white/90">
                  Vehicles  b7 Trending
                </span>
                <img src="/images/Mercedes-Benz C-Class.png" alt="Mercedes-Benz C-Class" className="w-full h-56 object-contain" />
                <button aria-label="favorite" className="absolute bottom-3 right-3 text-white/80 hover:text-white">♡</button>
              </div>
              <div className="mt-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white text-lg font-semibold">Mercedes-Benz</h3>
                  <p className="text-gray-300 text-sm">C-Class  b7 Sport trim</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  ★ 9.0 score
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
                <span>Current bid: $28,400</span>
                <span>72 watchers</span>
              </div>
              <div className="mt-auto flex flex-col gap-3 pt-4">
                <button
                  className="w-full py-3 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
                  onClick={() =>
                    openModal({
                      name: "Mercedes-Benz",
                      currentBid: 28400,
                      reserve: 32000,
                      location: "City center garage",
                    })
                  }
                >
                  Bid Now
                </button>
                <Link href="/ongoing-auctions" className="w-full">
                  <span className="inline-flex w-full items-center justify-center py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition">Go to Auction</span>
                </Link>
              </div>
            </div>
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
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => handleReviewDelete(review.id)}
                        className="mt-3 inline-flex text-sm font-semibold text-red-300 hover:text-red-200"
                      >
                        Delete review
                      </button>
                    )}
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
              <label className="text-sm text-white/70" htmlFor="home-bid-input">
                Your bid
              </label>
              <input
                id="home-bid-input"
                type="number"
                min={(selectedItem.currentBid || 0) + 1}
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

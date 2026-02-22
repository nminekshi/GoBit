"use client";

import { useEffect, useState, FormEvent, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auctionAPI, categoryNameToSlug } from "../../lib/api";
import { getSocket } from "../../lib/socket";
import { categoryFields } from "../../lib/categoryFields";

type Auction = {
    _id: string;
    title: string;
    description: string;
    category: string;
    startPrice: number;
    currentBid: number;
    status: string;
    saleStatus?: "pending" | "claim-initiated" | "paid";
    auctionType?: "normal" | "live";
    startTime?: string;
    liveDurationSeconds?: number;
    liveAutoExtendSeconds?: number;
    liveExtendThresholdSeconds?: number;
    liveStartTime?: string;
    liveEndedAt?: string;
    endTime: string;
    imageUrl: string;
    views: number;
    watchers: number;
    sellerId: {
        _id: string;
        username: string;
        email: string;
    };
    winnerId?: string | { _id: string; username: string };
    winnerClaimedAt?: string;
    winnerPaidAt?: string;
    paidAt?: string;
    details?: Record<string, string>;
    createdAt: string;
    updatedAt?: string;
    bids: {
        bidderId: string | { _id: string; username: string };
        bidAmount: number;
        timestamp: string;
    }[];
};

const RELATED_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&q=80&w=260&h=200";

export default function AuctionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bidAmount, setBidAmount] = useState("");
    const [bidError, setBidError] = useState("");
    const [timeLeft, setTimeLeft] = useState("");
    const [countdownPhase, setCountdownPhase] = useState<"upcoming" | "running" | "ended">("running");
    const [activeTab, setActiveTab] = useState<string>("description"); // description, history, reviews, more
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [claimMessage, setClaimMessage] = useState<string | null>(null);
    const [relatedAuctions, setRelatedAuctions] = useState<Auction[]>([]);
    const [relatedLoading, setRelatedLoading] = useState(false);

    const isLoaded = useRef(false);

    const fetchAuction = async () => {
        try {
            const data = await auctionAPI.fetchAuctionById(id);
            if (data) {
                setAuction(data);
                isLoaded.current = true;
                // Clear error if we successfully fetched
                if (error === "Failed to load auction details" || error === "Auction not found") {
                    setError("");
                }
            } else {
                if (!isLoaded.current) setError("Auction not found");
            }
        } catch (err) {
            console.error("Failed to update auction data", err);
            if (!isLoaded.current) setError("Failed to load auction details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuction();
        const interval = setInterval(fetchAuction, 12000); // Slow fallback polling; realtime comes from sockets
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        const fetchRelated = async () => {
            if (!auction?.category) return;
            setRelatedLoading(true);
            try {
                // Prefer active items in the same category
                const activeResults = await auctionAPI.fetchAuctions(auction.category, "active");
                const activeFiltered = (activeResults || []).filter((item: any) => (item._id || item.id) !== auction._id);

                // If not enough, backfill with completed items from same category
                let combined = activeFiltered;
                if (combined.length < 9) {
                    const allResults = await auctionAPI.fetchAuctions(auction.category, "all");
                    const completed = (allResults || [])
                        .filter((item: any) => (item._id || item.id) !== auction._id)
                        .filter((item: any) => item.status !== "active");
                    combined = [...activeFiltered, ...completed];
                }

                const deduped = combined.reduce((acc: Auction[], item: any) => {
                    const id = item._id || item.id;
                    if (!acc.some((a) => (a as any)._id === id || (a as any).id === id)) acc.push(item);
                    return acc;
                }, []);

                setRelatedAuctions(deduped.slice(0, 9) as Auction[]);
            } catch {
                setRelatedAuctions([]);
            } finally {
                setRelatedLoading(false);
            }
        };

        fetchRelated();
    }, [auction?._id, auction?.category]);

    useEffect(() => {
        if (!auction?._id) return;
        const socket = getSocket();

        socket.emit("join-auction", auction._id);

        const handleUpdate = (payload: any) => {
            if (payload?._id === auction._id) {
                setAuction(payload);
            }
        };

        const handleBidError = (payload: any) => {
            if (payload?.auctionId && payload.auctionId !== auction._id) return;
            setBidError(payload?.message || "Bid failed");
        };

        socket.on("auction:update", handleUpdate);
        socket.on("bid:error", handleBidError);

        return () => {
            socket.emit("leave-auction", auction._id);
            socket.off("auction:update", handleUpdate);
            socket.off("bid:error", handleBidError);
        };
    }, [auction?._id]);

    useEffect(() => {
        if (!auction) return;

        const rawAuth = typeof window !== "undefined" ? window.localStorage.getItem("auth") : null;
        if (rawAuth) {
            try {
                const parsed = JSON.parse(rawAuth);
                const userId = parsed?.user?._id || parsed?.user?.id;
                setCurrentUserId(userId || null);
            } catch {
                setCurrentUserId(null);
            }
        }

        const updateTimeLeft = () => {
            const now = new Date().getTime();
            const start = auction.startTime ? new Date(auction.startTime).getTime() : now;
            if (now < start) {
                const distance = start - now;
                const totalSeconds = Math.floor(distance / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                setCountdownPhase("upcoming");
                setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
                return;
            }

            const end = new Date(auction.endTime).getTime();
            const distance = end - now;

            if (distance <= 0) {
                setCountdownPhase("ended");
                setTimeLeft("Ended");
                return;
            }

            setCountdownPhase("running");

            if (auction.auctionType === "live") {
                const totalSeconds = Math.floor(distance / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        updateTimeLeft();
        const timer = setInterval(updateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [auction]);

    const handleBid = async (e: FormEvent) => {
        e.preventDefault();
        if (!auction) return;

        const amount = Number(bidAmount);
        if (!amount || isNaN(amount)) {
            setBidError("Please enter a valid amount");
            return;
        }

        if (countdownPhase === "upcoming") {
            setBidError("Auction has not started yet.");
            return;
        }

        if (countdownPhase === "ended") {
            setBidError("Auction has ended.");
            return;
        }

        if (amount <= auction.currentBid) {
            setBidError(`Bid must be higher than current bid ($${auction.currentBid})`);
            return;
        }

        // Check if user is logged in (basic check)
        const rawAuth = typeof window !== "undefined" ? window.localStorage.getItem("auth") : null;
        if (!rawAuth) {
            setBidError("You must be logged in to place a bid.");
            // Optionally redirect to login
            return;
        }

        try {
            // Place bid via API
            const updatedAuction = await auctionAPI.placeBid(auction._id, amount);

            // Update state with response from backend
            setAuction(updatedAuction);

            // Update local storage for Buyer Dashboard
            const parsed = JSON.parse(rawAuth);
            const userId = parsed?.user?._id || parsed?.user?.id || parsed?.user?.uid;
            if (userId) {
                const storedRaw = window.localStorage.getItem("buyer-bids");
                const existing = storedRaw ? JSON.parse(storedRaw) : [];
                const bidEntry = {
                    id: `cat-${auction.category}-${auction.title}`, // Consistent ID format with previous code
                    title: auction.title,
                    category: auction.category,
                    amount: amount,
                    imageUrl: auction.imageUrl,
                    placedAt: new Date().toISOString(),
                    userId,
                };
                // Dedup logic
                const deduped = Array.isArray(existing)
                    ? [bidEntry, ...existing.filter((b: any) => !(b.id === bidEntry.id && b.userId === userId))]
                    : [bidEntry];
                window.localStorage.setItem("buyer-bids", JSON.stringify(deduped));
            }

            setBidAmount("");
            setBidError("");
            alert("Bid placed successfully!");
        } catch (err: any) {
            const message = err.message || "Failed to place bid";
            setBidError(message);

            // If the error indicates a stale bid, refresh the data immediately
            if (message.includes("higher than current bid")) {
                fetchAuction();
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#040918] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (error || !auction) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#040918] text-white gap-4">
                <p className="text-xl text-rose-400">{error || "Auction not found"}</p>
                <Link href="/categories/vehicles" className="text-emerald-400 hover:underline">
                    Back to Categories
                </Link>
            </div>
        );
    }

    const isLiveAuction = auction.auctionType === "live";
    const isWinner = Boolean(currentUserId && (typeof auction.winnerId === "string" ? auction.winnerId === currentUserId : auction.winnerId?._id === currentUserId));
    const isPaid = Boolean(auction.winnerPaidAt || auction.paidAt || auction.saleStatus === "paid");
    const isClaimInitiated = Boolean(auction.saleStatus === "claim-initiated" || auction.winnerClaimedAt);

    const handleClaimAndCheckout = async () => {
        if (!auction) return;
        try {
            setClaimMessage(null);
            const res = await auctionAPI.claimAuction(auction._id);
            const nextPath = res.checkoutPath || `/checkout/${auction._id}`;
            setClaimMessage(res.message || "Claim initiated. Redirecting to checkout...");
            setTimeout(() => router.push(nextPath), 200);
        } catch (err: any) {
            setClaimMessage(err?.message || "Failed to claim item.");
        }
    };

    return (
        <div className="min-h-screen bg-[#040918] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb / Back Navigation */}
                <div className="mb-8">
                    <Link
                        href={`/categories/${auction.category}`}
                        className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to {auction.category}
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Image */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                            <Image
                                src={auction.imageUrl}
                                alt={auction.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{auction.title}</h1>
                            <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                <span className="flex items-center">
                                    {/* Star icons placeholder */}
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </span>
                                <span className="text-white/40">(2 customer reviews)</span>
                            </div>
                        </div>

                        <p className="text-white/70 leading-relaxed">
                            {auction.description.length > 200
                                ? `${auction.description.substring(0, 200)}...`
                                : auction.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-white/10">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-white/40 mb-1">Item Condition</p>
                                <p className="text-white">Active</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-white/40 mb-1">Item Verified</p>
                                <p className="text-white">No</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-white/40 mb-1">Auction Ends</p>
                                <p className="text-white">{new Date(auction.endTime).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-white/40 mb-1">Timezone</p>
                                <p className="text-white">UTC</p>
                            </div>
                        </div>

                        {isWinner && countdownPhase === "ended" && (
                            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-emerald-100 space-y-2">
                                <p className="text-sm font-semibold">You won this auction!</p>
                                {isPaid ? (
                                    <>
                                        <p className="text-xs text-emerald-50/80">Payment confirmed. View your receipt or dashboard.</p>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow"
                                                onClick={() => router.push(`/order-confirmation/${auction._id}`)}
                                            >
                                                View confirmation
                                            </button>
                                            <button
                                                className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white/90"
                                                onClick={() => router.push("/buyer/dashboard")}
                                            >
                                                Go to dashboard
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs text-emerald-50/80">{isClaimInitiated ? "Finish checkout to complete payment." : "Click checkout to confirm and pay."}</p>
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <button
                                                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 disabled:opacity-60"
                                                onClick={handleClaimAndCheckout}
                                            >
                                                Go to checkout
                                            </button>
                                            {claimMessage && (
                                                <span className="text-xs text-white/80">{claimMessage}</span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="bg-[#0b1428] rounded-3xl p-6 border border-white/10 space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-white/60 mb-2">
                                    {countdownPhase === "upcoming" ? "Starts in" : countdownPhase === "running" ? "Time left" : "Status"}
                                </p>
                                {isLiveAuction && countdownPhase === "running" && (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                                        <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" /> Live
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                {countdownPhase === "ended" ? (
                                    <div className="col-span-4 bg-rose-500/20 text-rose-200 p-3 rounded-lg font-bold">
                                        Auction Ended
                                    </div>
                                ) : isLiveAuction && countdownPhase === "running" && timeLeft ? (
                                    <div className="col-span-4 flex items-center justify-center gap-3">
                                        <div className="rounded-2xl bg-white px-6 py-4 text-gray-900 shadow">
                                            <div className="text-3xl font-black tracking-wide">{timeLeft}</div>
                                            <div className="text-[10px] uppercase font-semibold text-gray-500">MM:SS</div>
                                        </div>
                                        <div className="text-left text-xs text-white/60">
                                            <p>Auto-extends by {auction.liveAutoExtendSeconds || 15}s when bids arrive with {auction.liveExtendThresholdSeconds || 10}s remaining.</p>
                                        </div>
                                    </div>
                                ) : countdownPhase === "upcoming" && timeLeft ? (
                                    <div className="col-span-4 flex items-center justify-between gap-3 bg-white/5 rounded-xl px-4 py-3">
                                        <div className="text-left text-sm">
                                            <p className="text-white/60">Starts at</p>
                                            <p className="font-semibold text-white">{auction.startTime ? new Date(auction.startTime).toLocaleString() : "Scheduled"}</p>
                                        </div>
                                        <div className="rounded-2xl bg-white px-4 py-3 text-gray-900 shadow">
                                            <div className="text-2xl font-black tracking-wide">{timeLeft}</div>
                                            <div className="text-[10px] uppercase font-semibold text-gray-500">MM:SS</div>
                                        </div>
                                    </div>
                                ) : timeLeft ? (
                                    timeLeft.split(" ").map((part, index) => {
                                        const value = parseInt(part);
                                        if (isNaN(value)) return null;

                                        const label = part.replace(/[0-9]/g, "");
                                        const labelFull = label === "d" ? "Days" : label === "h" ? "Hours" : label === "m" ? "Minutes" : "Seconds";
                                        return (
                                            <div key={index} className="bg-white p-3 rounded-lg text-gray-900">
                                                <div className="text-xl font-bold">{value}</div>
                                                <div className="text-[10px] uppercase font-medium text-gray-500">{labelFull}</div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-4 text-white/40 animate-pulse">Calculating...</div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-white/60">Current bid:</p>
                            <p className="text-3xl font-bold text-white">${auction.currentBid.toLocaleString()}</p>
                            <p className="text-xs text-white/40">Start Price: ${auction.startPrice.toLocaleString()}</p>
                        </div>

                        <form onSubmit={handleBid} className="flex gap-2">
                            <input
                                type="number"
                                min={auction.currentBid + 1}
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder={`${auction.currentBid + 1}`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                            <button
                                type="submit"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={auction.status !== "active" || countdownPhase !== "running"}
                            >
                                Submit
                            </button>
                            {/* Add + button logic if needed, simplied to basic input for now */}
                        </form>
                        {bidError && <p className="text-rose-400 text-sm">{bidError}</p>}
                    </div>
                </div>
            </div>

            {/* Bottom Tabs Section */}
            <div className="mt-16">
                <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto">
                    {['description', 'auction history', 'reviews', 'more products'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-sm font-semibold uppercase tracking-wide whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                                ? "border-emerald-500 text-white"
                                : "border-transparent text-white/40 hover:text-white/70"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="min-h-[200px]">
                    {activeTab === 'description' && (
                        <div className="prose prose-invert max-w-none">
                            <p className="text-white/80 leading-relaxed">{auction.description}</p>

                            {/* Product Overview Section */}
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-white mb-6">Product Overview</h3>
                                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                    <table className="w-full">
                                        <tbody>
                                            {/* Standard Fields */}
                                            <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 text-white/60 font-medium">Category</td>
                                                <td className="py-4 px-6 text-white text-right capitalize">{auction.category}</td>
                                            </tr>
                                            <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 text-white/60 font-medium">Price</td>
                                                <td className="py-4 px-6 text-emerald-400 text-right font-medium">${auction.startPrice.toLocaleString()}</td>
                                            </tr>
                                            <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 text-white/60 font-medium">Status</td>
                                                <td className="py-4 px-6 text-white text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${auction.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                        {auction.status === 'active' ? 'Active' : 'Sold Out'}
                                                    </span>
                                                </td>
                                            </tr>

                                            {/* Dynamic Category Fields */}
                                            {(categoryFields[categoryNameToSlug(auction.category)] || []).map((field) => (
                                                <tr key={field.key} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-6 text-white/60 font-medium">{field.label}</td>
                                                    <td className="py-4 px-6 text-white text-right">
                                                        {auction.details && auction.details[field.key] ? (
                                                            <>
                                                                {auction.details[field.key]} {field.suffix || ""}
                                                            </>
                                                        ) : (
                                                            <span className="text-white/20 italic">Not specified</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}

                                            <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 text-white/60 font-medium">Verified</td>
                                                <td className="py-4 px-6 text-white text-right">
                                                    <span className="inline-flex items-center gap-1 text-emerald-400">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                                        Yes
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 text-white/60 font-medium">Created At</td>
                                                <td className="py-4 px-6 text-white text-right">
                                                    {new Date(auction.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 text-white/60 font-medium">Updated At</td>
                                                <td className="py-4 px-6 text-white text-right">
                                                    {new Date(auction.updatedAt || auction.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'auction history' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white mb-4">Bid History</h3>
                            {auction.bids && auction.bids.length > 0 ? (
                                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                    {auction.bids.map((bid, i) => {
                                        const bidderName = typeof bid.bidderId === 'object' ? bid.bidderId.username : (bid.bidderId === "me" ? "You" : `Bidder ${bid.bidderId.substring(0, 6)}...`);
                                        const bidderInitial = bidderName.substring(0, 2).toUpperCase();

                                        return (
                                            <div key={i} className="flex justify-between items-center p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                                                        {bidderInitial}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{bidderName}</p>
                                                        <p className="text-xs text-white/40">{new Date(bid.timestamp).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-emerald-400 font-bold">${bid.bidAmount.toLocaleString()}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-white/40">No bids yet. Be the first to bid!</p>
                            )}
                        </div>
                    )}
                    {/* Placeholders for other tabs */}
                    {activeTab === 'reviews' && <p className="text-white/40">No reviews yet.</p>}
                    {activeTab === 'more products' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">More products</h3>
                            {relatedLoading ? (
                                <p className="text-white/40">Loading related auctions...</p>
                            ) : relatedAuctions.length === 0 ? (
                                <p className="text-white/40">No related auctions found.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {relatedAuctions.map((item) => {
                                        const id = (item as any)._id || (item as any).id;
                                        return (
                                            <Link key={id} href={`/auctions/${id}`} className="group block rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-emerald-400/60 transition">
                                                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/5">
                                                    <Image
                                                        src={(item as any).imageUrl || RELATED_FALLBACK_IMAGE}
                                                        alt={(item as any).title}
                                                        width={400}
                                                        height={300}
                                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                                <div className="mt-3 space-y-1">
                                                    <p className="text-sm uppercase tracking-wide text-white/50">{(item as any).category}</p>
                                                    <h4 className="text-lg font-semibold text-white line-clamp-1">{(item as any).title}</h4>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-emerald-400 font-semibold">${((item as any).currentBid || (item as any).startPrice || 0).toLocaleString()}</span>
                                                        <span className="text-white/50">Bids {(item as any).bidsCount || 0}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

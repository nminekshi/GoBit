"use client";

import { useEffect, useState, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auctionAPI } from "../../lib/api";

type Auction = {
    _id: string;
    title: string;
    description: string;
    category: string;
    startPrice: number;
    currentBid: number;
    status: string;
    endTime: string;
    imageUrl: string;
    views: number;
    watchers: number;
    sellerId: {
        _id: string;
        username: string;
        email: string;
    };
    bids: {
        bidderId: string;
        bidAmount: number;
        timestamp: string;
    }[];
};

export default function AuctionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bidAmount, setBidAmount] = useState("");
    const [bidError, setBidError] = useState("");
    const [timeLeft, setTimeLeft] = useState("");
    const [activeTab, setActiveTab] = useState("description"); // description, history, reviews, more

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const data = await auctionAPI.fetchAuctionById(id);
                if (data) {
                    setAuction(data);
                } else {
                    setError("Auction not found");
                }
            } catch (err) {
                setError("Failed to load auction details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuction();
    }, [id]);

    useEffect(() => {
        if (!auction) return;

        const updateTimeLeft = () => {
            const now = new Date().getTime();
            const end = new Date(auction.endTime).getTime();
            const distance = end - now;

            if (distance < 0) {
                setTimeLeft("Ended");
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
            // Optimistically update UI or re-fetch
            // For now, let's just simulate success and update local state for Buyer Dashboard consistency
            // In a real app, we'd call api.placeBid(id, amount)

            // Simulating the API call structure (replace with actual call if API supports it fully)
            // await auctionAPI.placeBid(auction._id, amount); 

            // Manually update local state to reflect bid for demo purposes
            const newBid = {
                bidderId: "me", // placeholder
                bidAmount: amount,
                timestamp: new Date().toISOString()
            };

            setAuction(prev => prev ? ({
                ...prev,
                currentBid: amount,
                bidsCount: (prev.bids?.length || 0) + 1,
                bids: [newBid, ...(prev.bids || [])]
            }) : null);

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
            setBidError(err.message || "Failed to place bid");
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

                        <div className="bg-[#0b1428] rounded-3xl p-6 border border-white/10 space-y-6">
                            <div>
                                <p className="text-sm text-white/60 mb-2">Time left:</p>
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    {/* Simple countdown blocks */}
                                    {timeLeft.split(' ').map((part, index) => {
                                        const value = parseInt(part);
                                        const label = part.replace(/[0-9]/g, '');
                                        const labelFull = label === 'd' ? 'Days' : label === 'h' ? 'Hours' : label === 'm' ? 'Minutes' : 'Seconds';
                                        return (
                                            <div key={index} className="bg-white p-3 rounded-lg text-gray-900">
                                                <div className="text-xl font-bold">{value}</div>
                                                <div className="text-[10px] uppercase font-medium text-gray-500">{labelFull}</div>
                                            </div>
                                        );
                                    })}
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
                                    disabled={auction.status !== "active"}
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
                            </div>
                        )}
                        {activeTab === 'auction history' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-white mb-4">Bid History</h3>
                                {auction.bids && auction.bids.length > 0 ? (
                                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                        {auction.bids.map((bid, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                                                        {bid.bidderId.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">Bidder {bid.bidderId.substring(0, 6)}...</p>
                                                        <p className="text-xs text-white/40">{new Date(bid.timestamp).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-emerald-400 font-bold">${bid.bidAmount.toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white/40">No bids yet. Be the first to bid!</p>
                                )}
                            </div>
                        )}
                        {/* Placeholders for other tabs */}
                        {activeTab === 'reviews' && <p className="text-white/40">No reviews yet.</p>}
                        {activeTab === 'more products' && <p className="text-white/40">Related auctions will appear here.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

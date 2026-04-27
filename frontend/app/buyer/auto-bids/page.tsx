"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    Zap, 
    Bot, 
    ArrowLeft, 
    LayoutDashboard, 
    Trash2, 
    Pause, 
    Play, 
    AlertCircle, 
    ExternalLink,
    TrendingUp,
    ShieldCheck
} from "lucide-react";

interface SmartAgent {
    _id: string;
    category: string;
    maxBudget: number;
    bidIncrement: number;
    strategy: string;
    isEnabled: boolean;
    currentWinCount: number;
    targetWinCount: number;
}

interface ItemBot {
    _id: string;
    auctionId: {
        _id: string;
        title: string;
        imageUrl: string;
        currentBid: number;
        endTime: string;
        status: string;
        category: string;
    };
    maxBid: number;
    increment: number;
    isActive: boolean;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1550259114-ad7188f0a967?auto=format&fit=crop&q=80&w=260&h=200";

export default function MyAutoBidsPage() {
    const router = useRouter();
    const [smartAgents, setSmartAgents] = useState<SmartAgent[]>([]);
    const [itemBots, setItemBots] = useState<ItemBot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const { auctionAPI } = await import("../../lib/api");
            const data = await auctionAPI.fetchBiddingSummary();
            setSmartAgents(data.smartAgents || []);
            setItemBots(data.itemBots || []);
        } catch (err: any) {
            console.error("Failed to load bidding summary:", err);
            setError(err.message || "Failed to load your auto-bids.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDeleteItemBot = async (id: string) => {
        if (!confirm("Are you sure you want to disable this auto-bid?")) return;
        try {
            const { auctionAPI } = await import("../../lib/api");
            const bot = itemBots.find(b => b._id === id);
            if (!bot) return;
            await auctionAPI.disableAutoBid(bot.auctionId._id);
            setItemBots(prev => prev.filter(b => b._id !== id));
        } catch (err: any) {
            alert(err.message || "Failed to disable auto-bid");
        }
    };

    const handleToggleSmartAgent = async (id: string, category: string, currentStatus: boolean) => {
        try {
            const { auctionAPI } = await import("../../lib/api");
            if (currentStatus) {
                // Disable
                await auctionAPI.disableSmartAutoAgent(category);
            } else {
                // Re-enable
                const agent = smartAgents.find(a => a._id === id);
                if (!agent) return;
                await auctionAPI.saveSmartAutoAgent({
                    category: agent.category,
                    maxBudget: agent.maxBudget,
                    bidIncrement: agent.bidIncrement,
                    maxConcurrentAuctions: 3, // Default
                    strategy: agent.strategy,
                    targetWinCount: agent.targetWinCount,
                    isEnabled: true
                });
            }
            loadData(); // Refresh everything
        } catch (err: any) {
            alert(err.message || "Failed to update agent status");
        }
    };


    return (
        <div className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-10">
            <div className="w-full">
                {/* Header */}
                <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:border-emerald-500/50 hover:bg-emerald-500/10"
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-emerald-400" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl flex items-center gap-3">
                                My <span className="text-emerald-400">Automated Bids</span>
                                <Zap className="h-8 w-8 text-emerald-400 fill-emerald-400/20" />
                            </h1>
                            <p className="mt-1 text-slate-400">Manage your active bots and smart category agents.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/buyer/dashboard">
                            <button className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold transition hover:bg-white/20">
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </button>
                        </Link>
                        <Link href="/buyer/smart-auto-bidding">
                            <button className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600">
                                <Bot className="h-4 w-4" />
                                New Smart Agent
                            </button>
                        </Link>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
                        <h2 className="text-xl font-bold">Error Loading Data</h2>
                        <p className="mt-2 text-red-300/70">{error}</p>
                        <button onClick={loadData} className="mt-6 rounded-xl bg-red-500 px-6 py-2 font-semibold">Retry</button>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-2">
                        
                        {/* Smart Category Agents */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <Bot className="h-6 w-6 text-emerald-400" />
                                    Smart Agents
                                    <span className="ml-2 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                                        {smartAgents.length} Active
                                    </span>
                                </h2>
                            </div>

                            {smartAgents.length === 0 ? (
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm">
                                    <Bot className="mx-auto mb-4 h-12 w-12 text-slate-500" />
                                    <p className="text-slate-400 font-medium">No category agents active.</p>
                                    <p className="mt-1 text-sm text-slate-500">Enable smart bidding to win items automatically in specific categories.</p>
                                    <Link href="/buyer/smart-auto-bidding">
                                        <button className="mt-6 rounded-xl border border-emerald-500/50 px-6 py-2 text-emerald-400 transition hover:bg-emerald-500/10">Setup Agent</button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {smartAgents.map((agent) => (
                                        <div key={agent._id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-emerald-500/30">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Category Agent</span>
                                                    <h3 className="mt-1 text-2xl font-bold capitalize">{agent.category}</h3>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleToggleSmartAgent(agent._id, agent.category, agent.isEnabled)}
                                                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                                                            agent.isEnabled 
                                                            ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" 
                                                            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                                        }`}
                                                    >
                                                        {agent.isEnabled ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-6 grid grid-cols-2 gap-4">
                                                <div className="rounded-2xl bg-black/40 p-4 border border-white/5">
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Max Budget</p>
                                                    <p className="text-xl font-bold text-emerald-400">${agent.maxBudget.toLocaleString()}</p>
                                                </div>
                                                <div className="rounded-2xl bg-black/40 p-4 border border-white/5">
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Increment</p>
                                                    <p className="text-xl font-bold text-slate-200">${agent.bidIncrement.toLocaleString()}</p>
                                                </div>
                                                <div className="rounded-2xl bg-black/40 p-4 border border-white/5">
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Win Target</p>
                                                    <p className="text-xl font-bold text-slate-200">{agent.currentWinCount} / {agent.targetWinCount}</p>
                                                </div>
                                                <div className="rounded-2xl bg-black/40 p-4 border border-white/5">
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Strategy</p>
                                                    <p className="text-xl font-bold capitalize text-slate-200">{agent.strategy}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${agent.isEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`}></div>
                                                    <span className="text-sm text-slate-400">{agent.isEnabled ? "Active & Monitoring" : "Paused"}</span>
                                                </div>
                                                <Link href={`/buyer/smart-auto-bidding?category=${agent.category}`}>
                                                    <button className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">Edit Settings</button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Item-Specific Bots */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <Zap className="h-6 w-6 text-amber-400" />
                                    Item Auto-Bids
                                    <span className="ml-2 rounded-full bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                                        {itemBots.length} Active
                                    </span>
                                </h2>
                            </div>

                            {itemBots.length === 0 ? (
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm">
                                    <Zap className="mx-auto mb-4 h-12 w-12 text-slate-500" />
                                    <p className="text-slate-400 font-medium">No item-specific auto-bids.</p>
                                    <p className="mt-1 text-sm text-slate-500">Set a max bid on any auction page to enable automatic bidding for that item.</p>
                                    <Link href="/explore-auctions">
                                        <button className="mt-6 rounded-xl border border-amber-500/50 px-6 py-2 text-amber-400 transition hover:bg-amber-500/10">Browse Auctions</button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {itemBots.map((bot) => (
                                        <div key={bot._id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1224] p-5 backdrop-blur-sm transition hover:border-amber-500/30">
                                            <div className="flex gap-5">
                                                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                                                    <img 
                                                        src={bot.auctionId.imageUrl || FALLBACK_IMAGE} 
                                                        alt={bot.auctionId.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-between">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{bot.auctionId.category}</span>
                                                            <h3 className="text-lg font-bold line-clamp-1 group-hover:text-amber-300">{bot.auctionId.title}</h3>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleDeleteItemBot(bot._id)}
                                                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-red-500/50 hover:text-red-400"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-wider text-slate-500">Limit</p>
                                                            <p className="font-bold text-white">${bot.maxBid.toLocaleString()}</p>
                                                        </div>
                                                        <div className="h-8 w-px bg-white/10"></div>
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-wider text-slate-500">Current</p>
                                                            <p className="font-bold text-amber-400">${bot.auctionId.currentBid.toLocaleString()}</p>
                                                        </div>
                                                        <div className="ml-auto flex items-center gap-1.5">
                                                            <ShieldCheck className="h-3 w-3 text-emerald-400" />
                                                            <span className="text-[11px] font-medium text-emerald-400">Protected</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp className="h-3.5 w-3.5" />
                                                        <span>Step: ${bot.increment}</span>
                                                    </div>
                                                </div>
                                                <Link href={`/auctions/${bot.auctionId._id}`}>
                                                    <button className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white">
                                                        View Auction
                                                        <ExternalLink className="h-3 w-3" />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {/* Footer Tip */}
                <footer className="mt-16 rounded-3xl border border-white/10 bg-linear-to-r from-emerald-500/10 via-cyan-500/5 to-transparent p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                            <Bot className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Pro Bidding Strategy</h3>
                            <p className="mt-1 text-slate-400">Smart Agents monitor entire categories and switch targets automatically to ensure you get the best price. Use them for common items, and use Item Auto-Bids for unique collectibles.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

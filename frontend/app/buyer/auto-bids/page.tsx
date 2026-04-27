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
    ShieldCheck,
    Target,
    Activity,
    Clock,
    History,
    ChevronRight,
    Search
} from "lucide-react";
import { API_BASE_URL } from "../../lib/api";

interface SmartAgent {
    _id: string;
    category: string;
    maxBudget: number;
    bidIncrement: number;
    strategy: string;
    isEnabled: boolean;
    committedBudget: number;
    remainingBudget: number;
    targets: Array<{
        auctionId: string;
        title: string;
        imageUrl?: string;
        currentBid: number;
        nextBid: number;
        endTime: string;
        isLeading?: boolean;
    }>;
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

interface ActivityLog {
    _id: string;
    category?: string;
    action: string;
    message: string;
    createdAt: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1550259114-ad7188f0a967?auto=format&fit=crop&q=80&w=260&h=200";

const CATEGORY_FALLBACKS: Record<string, string> = {
    vehicles: "/images/Tesla%20Model%20S.png",
    watches: "/images/Rolex%20Submariner.png",
    electronics: "/images/iPad%20Pro%2012.9.png",
    realestate: "/images/Luxury%20Penthouse.png",
    art: "/images/Classic%20Oil%20Painting.png",
    computers: "/images/MacBook%20Pro%2016.png",
};

const getRelevantImage = (imageUrl: string | undefined, category: string) => {
    if (imageUrl && imageUrl.trim()) {
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
            return imageUrl;
        }
        if (imageUrl.startsWith("/images/")) {
            return imageUrl;
        }
        if (imageUrl.startsWith("/")) {
            return `${API_BASE_URL}${imageUrl}`;
        }
        return `${API_BASE_URL}/${imageUrl}`;
    }
    return CATEGORY_FALLBACKS[category] || FALLBACK_IMAGE;
};

export default function MyAutoBidsPage() {
    const router = useRouter();
    const [smartAgents, setSmartAgents] = useState<SmartAgent[]>([]);
    const [itemBots, setItemBots] = useState<ItemBot[]>([]);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            const { auctionAPI } = await import("../../lib/api");
            const data = await auctionAPI.fetchBiddingSummary();
            setSmartAgents(data.smartAgents || []);
            setItemBots(data.itemBots || []);
            setLogs(data.logs || []);
        } catch (err: any) {
            console.error("Failed to load bidding summary:", err);
            setError(err.message || "Failed to load your auto-bids.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 10000); // Polling every 10s for live activity
        return () => clearInterval(interval);
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
                await auctionAPI.disableSmartAutoAgent(category);
            } else {
                const agent = smartAgents.find(a => a._id === id);
                if (!agent) return;
                await auctionAPI.saveSmartAutoAgent({
                    category: agent.category,
                    maxBudget: agent.maxBudget,
                    bidIncrement: agent.bidIncrement,
                    maxConcurrentAuctions: 3,
                    strategy: agent.strategy,
                    isEnabled: true
                });
            }
            loadData();
        } catch (err: any) {
            alert(err.message || "Failed to update agent status");
        }
    };

    // Derived: All active targets across all agents
    const allTargets = smartAgents.flatMap(agent => agent.targets.map(t => ({ ...t, category: agent.category })));

    return (
        <div className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-10 font-sans">
            <div className="w-full">
                {/* Header Section */}
                <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-8">
                    <div className="flex items-center gap-5">
                        <button 
                            onClick={() => router.back()}
                            className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:border-emerald-500/50 hover:bg-emerald-500/10"
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-emerald-400" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight md:text-4xl flex items-center gap-3">
                                <span className="bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">Bot Command</span>
                                <span className="text-emerald-400">Center</span>
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-2 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            </h1>
                            <p className="mt-1 text-slate-400 font-medium">Real-time telemetry and management for your bidding fleet.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="hidden lg:flex items-center gap-8 px-6 border-x border-white/10 mx-4">
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest text-slate-500">Total Targets</p>
                                <p className="text-xl font-bold text-white">{allTargets.length}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest text-slate-500">Active Bots</p>
                                <p className="text-xl font-bold text-emerald-400">{smartAgents.filter(a => a.isEnabled).length + itemBots.length}</p>
                            </div>
                        </div>
                        <Link href="/buyer/smart-auto-bidding">
                            <button className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-400 hover:scale-[1.02] active:scale-95">
                                <Bot className="h-5 w-5" />
                                Deploy New Agent
                            </button>
                        </Link>
                    </div>
                </header>

                {isLoading && smartAgents.length === 0 ? (
                    <div className="flex h-[60vh] items-center justify-center">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent shadow-[0_0_20px_rgba(16,185,129,0.2)]"></div>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-12">
                        
                        {/* Main Column: Radar & Bids */}
                        <div className="lg:col-span-9 space-y-10">
                            
                            {/* Section 1: Target Radar (Recommended/Active Items) */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                                            <Target className="h-5 w-5" />
                                        </div>
                                        Active Target Radar
                                        <span className="text-xs font-normal text-slate-500 bg-white/5 px-2 py-1 rounded-lg">Real-time Monitoring</span>
                                    </h2>
                                    {allTargets.length > 0 && (
                                        <span className="text-sm font-medium text-emerald-400/80 animate-pulse">Scanning live auctions...</span>
                                    )}
                                </div>

                                {allTargets.length === 0 ? (
                                    <div className="rounded-[2.5rem] border-2 border-dashed border-white/5 bg-white/[0.02] p-20 text-center backdrop-blur-sm">
                                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-slate-600">
                                            <Search className="h-10 w-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white/80">No Targets Acquired</h3>
                                        <p className="mt-2 text-slate-500 max-w-sm mx-auto">Your smart agents are scanning categories for items matching your filters. Recommended items will appear here once found.</p>
                                        <Link href="/buyer/smart-auto-bidding">
                                            <button className="mt-8 rounded-2xl bg-white/10 px-8 py-3 font-bold transition hover:bg-white/20">Configure Agent Filters</button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                        {allTargets.map((target) => (
                                            <div key={target.auctionId} className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1224] p-4 transition hover:border-emerald-500/40 hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)]">
                                                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/40">
                                                    <img 
                                                        src={getRelevantImage(target.imageUrl, target.category)} 
                                                        alt={target.title}
                                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                                    
                                                    <div className="absolute top-3 left-3 flex gap-2">
                                                        <div className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20">
                                                            {target.category}
                                                        </div>
                                                    </div>

                                                    {target.isLeading && (
                                                        <div className="absolute top-3 right-3 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-lg animate-pulse">
                                                            High Bidder
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-5 space-y-4">
                                                    <h3 className="text-lg font-bold line-clamp-1 group-hover:text-emerald-400 transition-colors">{target.title}</h3>
                                                    
                                                    <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/5">
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Current Price</p>
                                                            <p className="text-xl font-black text-white">${target.currentBid.toLocaleString()}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Next Auto-Bid</p>
                                                            <p className="text-xl font-black text-emerald-400">${target.nextBid.toLocaleString()}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between px-1">
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>Ends {new Date(target.endTime).toLocaleDateString()}</span>
                                                        </div>
                                                        <Link href={`/auctions/${target.auctionId}`}>
                                                            <button className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300">
                                                                Live View
                                                                <ChevronRight className="h-4 w-4" />
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Section 2: Individual Item Bots */}
                            {itemBots.length > 0 && (
                                <section className="space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        Single Item Auto-Bids
                                    </h2>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {itemBots.map((bot) => (
                                            <div key={bot._id} className="flex gap-4 rounded-3xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
                                                <img 
                                                    src={bot.auctionId.imageUrl || FALLBACK_IMAGE} 
                                                    className="h-20 w-20 rounded-2xl object-cover" 
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-white line-clamp-1">{bot.auctionId.title}</h3>
                                                    <div className="mt-2 flex items-center gap-4">
                                                        <div className="text-xs">
                                                            <span className="text-slate-500 uppercase tracking-tighter">Current: </span>
                                                            <span className="font-bold text-amber-400">${bot.auctionId.currentBid}</span>
                                                        </div>
                                                        <div className="text-xs">
                                                            <span className="text-slate-500 uppercase tracking-tighter">Limit: </span>
                                                            <span className="font-bold text-white">${bot.maxBid}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteItemBot(bot._id)}
                                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column: Fleet Management & Logs */}
                        <div className="lg:col-span-3 space-y-8">
                            
                            {/* Bot Fleet Status */}
                            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                                <h3 className="text-lg font-bold flex items-center gap-3 mb-6">
                                    <History className="h-5 w-5 text-emerald-400" />
                                    Fleet Status
                                </h3>
                                <div className="space-y-4">
                                    {smartAgents.map(agent => (
                                        <div key={agent._id} className="rounded-2xl border border-white/5 bg-black/40 p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-bold capitalize text-white">{agent.category}</span>
                                                <button 
                                                    onClick={() => handleToggleSmartAgent(agent._id, agent.category, agent.isEnabled)}
                                                    className={`p-1.5 rounded-lg transition ${agent.isEnabled ? 'text-amber-400 hover:bg-amber-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'}`}
                                                >
                                                    {agent.isEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500">
                                                    <span>Budget Health</span>
                                                    <span>{Math.round((agent.remainingBudget / agent.maxBudget) * 100)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-500" 
                                                        style={{ width: `${(agent.remainingBudget / agent.maxBudget) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Real-time Activity Logs */}
                            <section className="rounded-[2rem] border border-white/10 bg-[#060a13] p-6 shadow-2xl overflow-hidden font-mono text-sm leading-relaxed">
                                <h3 className="text-lg font-bold flex items-center gap-3 mb-6 font-sans">
                                    <Activity className="h-5 w-5 text-emerald-400" />
                                    Activity Log
                                </h3>
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {logs.length === 0 ? (
                                        <p className="text-xs text-slate-500 italic text-center py-8">Waiting for telemetry data...</p>
                                    ) : (
                                        logs.map(log => (
                                            <div key={log._id} className="border-l-2 border-emerald-500/30 pl-3 py-1">
                                                <p className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                                <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-tighter mt-0.5">[{log.action}]</p>
                                                <p className="text-xs text-white/80 line-clamp-2 mt-1">{log.message}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                            {/* Trust Badge */}
                            <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-6 text-center">
                                <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
                                <p className="text-sm font-bold text-emerald-200">Shield Protection Active</p>
                                <p className="mt-1 text-[11px] text-slate-500">Your bots use anti-sniping protection and stealth increments to minimize bid wars.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.4);
                }
            `}</style>
        </div>
    );
}

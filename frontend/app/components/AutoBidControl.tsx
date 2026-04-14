"use client";

import React, { useState, useEffect } from "react";
import { auctionAPI } from "../lib/api";
import { Loader2, ShieldCheck, Zap, XCircle } from "lucide-react";

interface AutoBidControlProps {
    auctionId: string;
    currentBid: number;
}

export default function AutoBidControl({ auctionId, currentBid }: AutoBidControlProps) {
    const [maxBid, setMaxBid] = useState<number>(currentBid + 100);
    const [increment, setIncrement] = useState<number>(10);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [notice, setNotice] = useState<string>("");
    const [noticeType, setNoticeType] = useState<"success" | "error" | "info">("info");

    useEffect(() => {
        fetchStatus();
    }, [auctionId]);

    const fetchStatus = async () => {
        setIsLoading(true);
        const status = await auctionAPI.getAutoBidStatus(auctionId);
        if (status) {
            setMaxBid(status.maxBid);
            setIncrement(status.increment);
            setIsActive(status.isActive);
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (maxBid <= currentBid) {
            setNoticeType("error");
            setNotice("Max bid must be higher than current bid.");
            return;
        }
        setIsSaving(true);
        const success = await auctionAPI.setAutoBid(auctionId, maxBid, increment);
        if (success) {
            setIsActive(true);
            setNoticeType("success");
            setNotice("Auto-bid is active.");
            await fetchStatus();
        } else {
            setNoticeType("error");
            setNotice("Failed to save auto-bid settings.");
        }
        setIsSaving(false);
    };

    const handleDisable = async () => {
        setIsSaving(true);
        const success = await auctionAPI.disableAutoBid(auctionId);
        if (success) {
            setIsActive(false);
            setNoticeType("info");
            setNotice("Auto-bid disabled.");
        } else {
            setNoticeType("error");
            setNotice("Failed to disable auto-bid.");
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-4 text-white/50">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking bot status...
            </div>
        );
    }

    return (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-white/40"}`} />
                    <h3 className="text-sm font-bold text-white">Smart Auto-Bid Bot</h3>
                </div>
                {isActive && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        <ShieldCheck className="h-3 w-3" /> Active
                    </span>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/40">
                        My Maximum Limit ($)
                    </label>
                    <input
                        type="number"
                        value={maxBid}
                        onChange={(e) => setMaxBid(Number(e.target.value))}
                        disabled={isSaving}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-emerald-500/50 focus:outline-none"
                        placeholder="Set your max limit..."
                    />
                </div>

                <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/40">
                        Bid Increment ($)
                    </label>
                    <input
                        type="number"
                        value={increment}
                        onChange={(e) => setIncrement(Number(e.target.value))}
                        disabled={isSaving}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-emerald-500/50 focus:outline-none"
                        placeholder="e.g. 10"
                    />
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                        ) : isActive ? (
                            "Update Rules"
                        ) : (
                            "Enable Auto-Bid"
                        )}
                    </button>
                    {isActive && (
                        <button
                            onClick={handleDisable}
                            disabled={isSaving}
                            className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-white transition-all hover:bg-rose-500/20 hover:text-rose-400"
                        >
                            <XCircle className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <p className="mt-3 text-center text-[10px] text-white/30 italic">
                The bot will automatically place bids for you if you're outbid, up to your limit.
            </p>

            {notice && (
                <p
                    className={`mt-2 text-center text-xs ${
                        noticeType === "success"
                            ? "text-emerald-300"
                            : noticeType === "error"
                            ? "text-rose-300"
                            : "text-white/70"
                    }`}
                >
                    {notice}
                </p>
            )}
        </div>
    );
}

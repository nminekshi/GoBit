"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE_URL, auctionAPI, categorySlugToName } from "../lib/api";
import { getSocket } from "../lib/socket";

type AgentOverview = {
  _id: string;
  category: string;
  maxBudget: number;
  bidIncrement: number;
  maxConcurrentAuctions: number;
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
    auctionType: "live" | "normal";
  }>;
};

const CATEGORIES = ["vehicles", "watches", "electronics", "realestate", "art", "computers"];
const FALLBACK_IMAGE = "/images/Modern%20Art%20Canvas.png";

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
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    if (imageUrl.startsWith("/")) {
      return `${API_BASE_URL}${imageUrl}`;
    }
    return `${API_BASE_URL}/${imageUrl}`;
  }
  return CATEGORY_FALLBACKS[category] || FALLBACK_IMAGE;
};

export default function SmartAutoBidAgentPanel() {
  const [category, setCategory] = useState<string>("vehicles");
  const [maxBudget, setMaxBudget] = useState<number>(30000);
  const [bidIncrement, setBidIncrement] = useState<number>(10);
  const [maxConcurrentAuctions, setMaxConcurrentAuctions] = useState<number>(3);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [overview, setOverview] = useState<AgentOverview[]>([]);
  const [message, setMessage] = useState<string>("");
  const [notifications, setNotifications] = useState<string[]>([]);

  const selected = useMemo(
    () => overview.find((item) => item.category === category),
    [overview, category]
  );

  const pushNotification = (text: string) => {
    setNotifications((prev) => [text, ...prev].slice(0, 5));
  };

  const loadOverview = async () => {
    const data = await auctionAPI.fetchSmartAutoAgents();
    setOverview(Array.isArray(data) ? data : []);

    if (Array.isArray(data) && data.length > 0) {
      const chosen = data.find((item) => item.category === category) || data[0];
      if (chosen) {
        setCategory(chosen.category);
        setMaxBudget(Number(chosen.maxBudget));
        setBidIncrement(Number(chosen.bidIncrement));
        setMaxConcurrentAuctions(Number(chosen.maxConcurrentAuctions));
        setIsEnabled(Boolean(chosen.isEnabled));
      }
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    let userId: string | null = null;

    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("auth");
        if (raw) {
          const parsed = JSON.parse(raw);
          userId = parsed?.user?._id || parsed?.user?.id || null;
        }
      } catch {
        userId = null;
      }
    }

    if (userId) {
      socket.emit("join-user", userId);
    }

    const onPlaced = (payload: any) => {
      pushNotification(payload?.message || "Smart agent placed a bid.");
      loadOverview();
    };

    const onOutbid = (payload: any) => {
      pushNotification(payload?.message || "You were outbid.");
      loadOverview();
    };

    const onBudget = (payload: any) => {
      pushNotification(payload?.message || "Budget reached. Agent stopped.");
      loadOverview();
    };

    const onWon = (payload: any) => {
      pushNotification(payload?.message || "You won an auction. Agent stopped.");
      loadOverview();
    };

    socket.on("smart-agent:bid-placed", onPlaced);
    socket.on("smart-agent:outbid", onOutbid);
    socket.on("smart-agent:budget-reached", onBudget);
    socket.on("smart-agent:won", onWon);

    return () => {
      if (userId) {
        socket.emit("leave-user", userId);
      }
      socket.off("smart-agent:bid-placed", onPlaced);
      socket.off("smart-agent:outbid", onOutbid);
      socket.off("smart-agent:budget-reached", onBudget);
      socket.off("smart-agent:won", onWon);
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    setMaxBudget(Number(selected.maxBudget));
    setBidIncrement(Number(selected.bidIncrement));
    setMaxConcurrentAuctions(Number(selected.maxConcurrentAuctions));
    setIsEnabled(Boolean(selected.isEnabled));
  }, [selected?._id]);

  const handleSave = async () => {
    if (!maxBudget || maxBudget <= 0) {
      setMessage("Please enter a valid budget.");
      return;
    }

    if (!bidIncrement || bidIncrement <= 0) {
      setMessage("Please enter a valid increment.");
      return;
    }

    if (!maxConcurrentAuctions || maxConcurrentAuctions <= 0) {
      setMessage("Please enter a valid concurrent auction limit.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    const result = await auctionAPI.saveSmartAutoAgent({
      category,
      maxBudget,
      bidIncrement,
      maxConcurrentAuctions,
      isEnabled,
    });

    if (result) {
      setMessage("Smart auto-bid agent saved.");
      await loadOverview();
    } else {
      setMessage("Failed to save smart auto-bid agent.");
    }

    setIsSaving(false);
  };

  const handleDisable = async () => {
    setIsSaving(true);
    const ok = await auctionAPI.disableSmartAutoAgent(category);
    setMessage(ok ? "Smart auto-bid disabled." : "Failed to disable smart auto-bid.");
    await loadOverview();
    setIsSaving(false);
  };

  return (
    <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Smart Auto-Bidding Agent</h2>
          <p className="text-sm text-white/70">Set one budget for a category and let the agent compete across multiple auctions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <label className="text-sm text-white/80">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{categorySlugToName(cat)}</option>
            ))}
          </select>
        </label>

        <label className="text-sm text-white/80">
          Max Budget
          <input
            type="number"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-white"
          />
        </label>

        <label className="text-sm text-white/80">
          Bid Increment
          <input
            type="number"
            value={bidIncrement}
            onChange={(e) => setBidIncrement(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-white"
          />
        </label>

        <label className="text-sm text-white/80">
          Max Concurrent
          <input
            type="number"
            value={maxConcurrentAuctions}
            onChange={(e) => setMaxConcurrentAuctions(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-white"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-white/90">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
          />
          Enable smart auto-bidding
        </label>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-50"
        >
          Save Agent
        </button>

        <button
          type="button"
          onClick={handleDisable}
          disabled={isSaving}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50"
        >
          Disable Category Agent
        </button>
      </div>

      {message && <p className="mt-2 text-sm text-emerald-200">{message}</p>}

      {selected && (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-[#0b1220] p-3">
            <p className="text-xs text-white/60">Committed Budget</p>
            <p className="text-lg font-semibold text-white">${selected.committedBudget.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0b1220] p-3">
            <p className="text-xs text-white/60">Remaining Budget</p>
            <p className="text-lg font-semibold text-emerald-300">${selected.remainingBudget.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0b1220] p-3">
            <p className="text-xs text-white/60">Status</p>
            <p className="text-lg font-semibold text-white">{selected.isEnabled ? "Enabled" : "Disabled"}</p>
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-white">Targeted Auctions</p>
        {!selected || selected.targets.length === 0 ? (
          <p className="text-sm text-white/60">No active targets right now.</p>
        ) : (
          <div className="space-y-2">
            {selected.targets.map((target) => (
              <Link
                key={target.auctionId}
                href={`/auctions/${target.auctionId}`}
                className="block rounded-lg border border-white/10 bg-[#0b1220] p-3 transition hover:border-emerald-400/40"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                    {categorySlugToName(selected.category)}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                    Active
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src={getRelevantImage(target.imageUrl, selected.category)}
                    alt={target.title}
                    className="h-20 w-28 shrink-0 rounded-md border border-white/10 bg-black/30 object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = CATEGORY_FALLBACKS[selected.category] || FALLBACK_IMAGE;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-white">{target.title}</p>
                    <p className="mt-1 text-xs text-white/70">
                      Current: ${target.currentBid.toLocaleString()} | Next: ${target.nextBid.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-white/55">
                      Ends: {new Date(target.endTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-sm font-semibold text-white">Agent Notifications</p>
          {notifications.map((item, index) => (
            <div key={`${item}-${index}`} className="rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white/90">
              {item}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

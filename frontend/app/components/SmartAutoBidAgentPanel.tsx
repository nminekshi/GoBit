"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE_URL, auctionAPI, categorySlugToName } from "../lib/api";
import { categoryFields } from "../lib/categoryFields";
import { getSocket } from "../lib/socket";
import { Bot, Settings, Zap, TrendingUp, DollarSign, Activity, Target, Power, Plus, Trash2, CheckCircle2, ShieldAlert } from "lucide-react";

type AgentOverview = {
  _id: string;
  category: string;
  maxBudget: number;
  bidIncrement: number;
  maxConcurrentAuctions: number;
  isEnabled: boolean;
  strategy?: string;
  targetWinCount?: number;
  committedBudget: number;
  remainingBudget: number;
  filters?: {
    priceMin?: number;
    priceMax?: number;
    dynamicFields?: Record<string, string>;
  };
  targets: Array<{
    auctionId: string;
    title: string;
    imageUrl?: string;
    currentBid: number;
    nextBid: number;
    endTime: string;
    auctionType: "live" | "normal";
    isLeading?: boolean;
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

export default function SmartAutoBidAgentPanel() {
  const [category, setCategory] = useState<string>("watches");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [maxBudget, setMaxBudget] = useState<number>(30000);
  const [bidIncrement, setBidIncrement] = useState<number>(10);
  const [maxConcurrentAuctions, setMaxConcurrentAuctions] = useState<number>(3);
  const [strategy, setStrategy] = useState<string>("standard");
  const [targetWinCount, setTargetWinCount] = useState<number>(10);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({});
  const [overview, setOverview] = useState<AgentOverview[]>([]);
  const [botLogs, setBotLogs] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCategory = localStorage.getItem("smartAutoBidCategory");
      const initialCat = (savedCategory && CATEGORIES.includes(savedCategory)) ? savedCategory : "watches";
      setCategory(initialCat);

      const raw = localStorage.getItem(`smartAutoBidDraft_${initialCat}`);
      if (raw) {
        try {
          const draft = JSON.parse(raw);
          if (draft.maxBudget) setMaxBudget(draft.maxBudget);
          if (draft.bidIncrement) setBidIncrement(draft.bidIncrement);
          if (draft.maxConcurrentAuctions) setMaxConcurrentAuctions(draft.maxConcurrentAuctions);
          if (draft.strategy) setStrategy(draft.strategy);
          if (draft.targetWinCount) setTargetWinCount(draft.targetWinCount);
          if (draft.priceMin !== undefined) setPriceMin(draft.priceMin);
          if (draft.priceMax !== undefined) setPriceMax(draft.priceMax);
          if (draft.dynamicFields !== undefined) setDynamicFields(draft.dynamicFields);
        } catch (e) { }
      }
    }
    setIsMounted(true);
  }, []);

  const saveDraft = (field: string, value: any) => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(`smartAutoBidDraft_${category}`);
      let draft: any = {};
      if (raw) {
        try { draft = JSON.parse(raw); } catch (e) { }
      }
      draft[field] = value;
      localStorage.setItem(`smartAutoBidDraft_${category}`, JSON.stringify(draft));
    }
  };

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

    if (Array.isArray(data)) {
      const chosen = data.find((item) => item.category === category);
      if (chosen) {
        setMaxBudget(Number(chosen.maxBudget));
        setBidIncrement(Number(chosen.bidIncrement));
        setMaxConcurrentAuctions(Number(chosen.maxConcurrentAuctions));
        setStrategy(chosen.strategy || "standard");
        setTargetWinCount(Number(chosen.targetWinCount) || 10);
        setIsEnabled(Boolean(chosen.isEnabled));
        setPriceMin(chosen.filters?.priceMin?.toString() || "");
        setPriceMax(chosen.filters?.priceMax?.toString() || "");
        setDynamicFields(chosen.filters?.dynamicFields || {});
      } else {
        setIsEnabled(false);
      }
    }
  };

  const loadLogs = async () => {
    const logs = await auctionAPI.fetchBotLogs(category);
    setBotLogs(logs);
  };

  useEffect(() => {
    if (!isMounted) return;
    loadOverview();
    loadLogs();
  }, [category, isMounted]);

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
    setStrategy(selected.strategy || "standard");
    setTargetWinCount(Number(selected.targetWinCount) || 1);
    setIsEnabled(Boolean(selected.isEnabled));
    setPriceMin(selected.filters?.priceMin?.toString() || "");
    setPriceMax(selected.filters?.priceMax?.toString() || "");
    setDynamicFields(selected.filters?.dynamicFields || {});
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
      strategy,
      targetWinCount,
      filters: {
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        dynamicFields: Object.keys(dynamicFields).length > 0 ? dynamicFields : undefined,
      }
    });

    if (result) {
      setMessage("Smart auto-bid agent saved and activated.");
      await loadOverview();
    } else {
      setMessage("Failed to save smart auto-bid agent.");
    }

    setIsSaving(false);
  };

  const handleDisable = async () => {
    setIsSaving(true);
    const ok = await auctionAPI.disableSmartAutoAgent(category);
    setMessage(ok ? "Smart auto-bid disabled successfully." : "Failed to disable smart auto-bid.");
    await loadOverview();
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/20">
          <Bot className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Smart Auto-Bidding Agent
          </h2>
          <p className="mt-1 text-sm text-emerald-200/70">
            Configure automated tactical bidding tailored to your budget constraints.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Configuration Form */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-white/10 bg-[#0b1220]/80 p-6 shadow-2xl backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Settings className="h-5 w-5 text-emerald-400" />
                Agent Configuration
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Box 1: Core Financials */}
              <div className="space-y-4 rounded-xl border border-white/5 bg-white/5 p-4">
                <h4 className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                  <DollarSign className="h-4 w-4" /> Core Financials
                </h4>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/50">Target Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setCategory(newCat);
                      if (typeof window !== "undefined") {
                        localStorage.setItem("smartAutoBidCategory", newCat);

                        const raw = localStorage.getItem(`smartAutoBidDraft_${newCat}`);
                        if (raw) {
                          try {
                            const draft = JSON.parse(raw);
                            setMaxBudget(draft.maxBudget || 30000);
                            setBidIncrement(draft.bidIncrement || 10);
                            setMaxConcurrentAuctions(draft.maxConcurrentAuctions || 3);
                            setStrategy(draft.strategy || "standard");
                            setTargetWinCount(draft.targetWinCount || 1);
                            setPriceMin(draft.priceMin || "");
                            setPriceMax(draft.priceMax || "");
                            setDynamicFields(draft.dynamicFields || {});
                          } catch (e) { }
                        } else {
                          setMaxBudget(30000);
                          setBidIncrement(10);
                          setMaxConcurrentAuctions(3);
                          setStrategy("standard");
                          setTargetWinCount(10);
                          setPriceMin("");
                          setPriceMax("");
                          setDynamicFields({});
                        }
                      }
                    }}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{categorySlugToName(cat)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/50">Maximum Overall Budget</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">LKR</span>
                    <input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => {
                        setMaxBudget(Number(e.target.value));
                        saveDraft("maxBudget", Number(e.target.value));
                      }}
                      className="w-full rounded-lg border border-white/10 bg-black/40 pl-14 pr-3 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/50">Base Bid Increment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">LKR</span>
                    <input
                      type="number"
                      value={bidIncrement}
                      onChange={(e) => {
                        setBidIncrement(Number(e.target.value));
                        saveDraft("bidIncrement", Number(e.target.value));
                      }}
                      className="w-full rounded-lg border border-white/10 bg-black/40 pl-14 pr-3 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Box 2: Tactical Strategy */}
              <div className="space-y-4 rounded-xl border border-white/5 bg-white/5 p-4">
                <h4 className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                  <Zap className="h-4 w-4" /> Tactical Strategy
                </h4>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/50">Bidding Behaviour</label>
                  <select
                    value={strategy}
                    onChange={(e) => {
                      setStrategy(e.target.value);
                      saveDraft("strategy", e.target.value);
                    }}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  >
                    <option value="standard">Standard (Instant increments)</option>
                    <option value="sniper">Sniper (Strike in final 3 mins)</option>
                    <option value="aggressive">Aggressive (Jump bid dominance)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/50">Max Concurrent Operations</label>
                  <input
                    type="number"
                    value={maxConcurrentAuctions}
                    onChange={(e) => {
                      setMaxConcurrentAuctions(Number(e.target.value));
                      saveDraft("maxConcurrentAuctions", Number(e.target.value));
                    }}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/50">Target Win Count Limit</label>
                  <input
                    type="number"
                    value={targetWinCount}
                    min={1}
                    // disabled={!isEnabled}
                    onChange={(e) => {
                      setTargetWinCount(Number(e.target.value));
                      saveDraft("targetWinCount", Number(e.target.value));
                    }}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white disabled:opacity-40 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Box 3: Targeting Filters */}
            <div className="mt-6 space-y-4 rounded-xl border border-white/5 bg-white/5 p-4">
              <h4 className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                <Target className="h-4 w-4" /> Targeting Filters (Optional)
              </h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/50">Minimum Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">LKR</span>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={priceMin}
                      onChange={(e) => {
                        setPriceMin(e.target.value);
                        saveDraft("priceMin", e.target.value);
                      }}
                      className="w-full rounded-lg border border-white/10 bg-black/40 pl-14 pr-3 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/50">Maximum Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">LKR</span>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={priceMax}
                      onChange={(e) => {
                        setPriceMax(e.target.value);
                        saveDraft("priceMax", e.target.value);
                      }}
                      className="w-full rounded-lg border border-white/10 bg-black/40 pl-14 pr-3 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
                {categoryFields[category]?.map((field) => {
                  let options = field.options;
                  let disabled = false;
                  if (field.dependsOn) {
                    const parentValue = dynamicFields[field.dependsOn];
                    if (parentValue && field.dependentOptions?.[parentValue]) {
                      options = field.dependentOptions[parentValue];
                    } else {
                      options = [];
                      disabled = true;
                    }
                  }

                  return (
                  <div key={field.key}>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/50">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        disabled={disabled}
                        value={dynamicFields[field.key] || ""}
                        onChange={(e) => {
                          const newFields = { ...dynamicFields, [field.key]: e.target.value };
                          if (!e.target.value) delete newFields[field.key];
                          
                          // Clear children if parent changes
                          categoryFields[category]?.forEach(child => {
                            if (child.dependsOn === field.key) {
                              delete newFields[child.key];
                            }
                          });

                          setDynamicFields(newFields);
                          saveDraft("dynamicFields", newFields);
                        }}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
                      >
                        <option value="">{disabled ? `Select ${categoryFields[category]?.find(f => f.key === field.dependsOn)?.label} first` : `Select ${field.label}`}</option>
                        {options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="relative">
                        <input
                          type={field.type === "number" ? "number" : "text"}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          value={dynamicFields[field.key] || ""}
                          onChange={(e) => {
                            const newFields = { ...dynamicFields, [field.key]: e.target.value };
                            if (!e.target.value) delete newFields[field.key];
                            setDynamicFields(newFields);
                            saveDraft("dynamicFields", newFields);
                          }}
                          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                        />
                        {field.suffix && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">
                            {field.suffix}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )})}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                  />
                  <div className="h-6 w-11 rounded-full bg-white/10 transition peer-checked:bg-emerald-500"></div>
                  <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-full"></div>
                </div>
                <span className="text-sm font-medium text-white/90">Enable Smart Engine</span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDisable}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <Power className="h-4 w-4" /> Desactivate
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" /> Save Configuration
                </button>
              </div>
            </div>

            {message && (
              <div className="mt-4 rounded-lg bg-emerald-500/20 p-3 text-center text-sm font-medium text-emerald-200">
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Telemetry & Log */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-[#0b1220]/80 p-6 shadow-2xl backdrop-blur-md">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <Activity className="h-5 w-5 text-emerald-400" /> Live Telemetry
            </h3>

            {!selected ? (
              <div className="text-sm text-white/50">No agent configured for this category yet. Save your settings to activate telemetry.</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{selected.isEnabled ? 'Engine Active' : 'Engine Standing By'}</p>
                    <p className="mt-1 text-xs text-white/50">{selected.isEnabled ? 'Monitoring live auctions' : 'Awaiting activation'}</p>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${selected.isEnabled ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-white/20'}`}></div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 transition hover:bg-white/10">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Committed Portfolio</p>
                    <p className="mt-1 text-2xl font-bold text-white">LKR {selected.committedBudget.toLocaleString()}</p>
                  </div>

                  <div className={`rounded-xl border p-4 transition ${selected.remainingBudget === 0 ? 'border-red-500/30 bg-red-500/10' : 'border-emerald-500/20 bg-emerald-500/10'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${selected.remainingBudget === 0 ? 'text-red-300' : 'text-emerald-200/70'}`}>
                      Available Firepower
                    </p>
                    <p className={`mt-1 text-2xl font-bold ${selected.remainingBudget === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      LKR {selected.remainingBudget.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1220]/80 p-6 shadow-2xl backdrop-blur-md">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <TrendingUp className="h-5 w-5 text-emerald-400" /> Event Feed
            </h3>

            {notifications.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-4 italic">No recent events logged.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((item, index) => (
                  <div key={index} className="flex gap-3 rounded-lg border border-white/5 bg-white/5 p-3 text-sm text-white/80">
                    <ShieldAlert className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Target Radar */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1220]/80 p-6 shadow-2xl backdrop-blur-md">
        <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
          <Target className="h-5 w-5 text-emerald-400" /> Target Radar
        </h3>

        {!selected || selected.targets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 py-12">
            <Target className="mb-3 h-10 w-10 text-white/20" />
            <p className="text-white/60">No targets currently acquired.</p>
            {selected && selected.remainingBudget === 0 && (
              <p className="mt-2 text-sm text-red-400 text-center max-w-sm">
                Warning: You have no remaining budget for further acquisitions. Increase your max budget to capture more targets.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {selected.targets.map((target) => (
              <Link
                key={target.auctionId}
                href={`/auctions/${target.auctionId}`}
                className="group relative flex flex-row items-stretch rounded-xl border border-white/10 bg-black/40 overflow-hidden transition hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className={`relative w-32 shrink-0 overflow-hidden sm:w-40 md:w-36 lg:w-44 ${!isEnabled ? 'grayscale opacity-60' : ''}`}>
                  <img
                    src={getRelevantImage(target.imageUrl, selected.category)}
                    alt={target.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = CATEGORY_FALLBACKS[selected.category] || FALLBACK_IMAGE;
                    }}
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <div className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      {target.auctionType}
                    </div>
                    {target.isLeading && (
                      <div className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur-md animate-pulse">
                        WINNING
                      </div>
                    )}
                  </div>
                  {!isEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <span className="bg-black/60 px-2 py-1 text-[10px] font-bold text-white/70 uppercase">Agent Paused</span>
                    </div>
                  )}
                </div>

                <div className={`flex flex-1 flex-col justify-between p-4 px-5 ${!isEnabled ? 'opacity-50' : ''}`}>
                  <div>
                    <h4 className={`font-bold line-clamp-1 tracking-tight transition-colors uppercase text-sm ${target.isLeading ? 'text-emerald-400' : 'text-white group-hover:text-emerald-300'}`}>
                      {target.title}
                    </h4>
                    <div className="mt-3 space-y-2">
                      <p className="flex items-center justify-between text-xs">
                        <span className="text-white/50">Highest Bid</span>
                        <span className={`font-semibold ${target.isLeading ? 'text-emerald-400' : 'text-white/90'}`}>
                          LKR {target.currentBid.toLocaleString()}
                          {target.isLeading && <span className="ml-1 text-[10px] font-normal opacity-70">(You)</span>}
                        </span>
                      </p>
                      <p className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400/60 font-medium italic">
                          {target.isLeading ? "Target Max" : "Projected Bid"}
                        </span>
                        <span className="font-bold text-emerald-400/90 tracking-tighter">
                          {target.isLeading ? `LKR ${selected.maxBudget.toLocaleString()}` : `LKR ${target.nextBid.toLocaleString()}`}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-white/30 flex items-center justify-between">
                    <span>ENDS_IN:</span>
                    <span className="text-white/40">{new Date(target.endTime).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {botLogs.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#060a13] p-0 shadow-2xl overflow-hidden font-mono text-sm leading-relaxed">
          <div className="bg-[#0b1220] border-b border-white/10 px-4 py-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
            <span className="ml-2 text-white/50 text-xs tracking-wider">AGENT_SYS_LOG</span>
          </div>
          <div className="max-h-80 overflow-y-auto p-4 space-y-2">
            {botLogs.map((log) => (
              <div key={log._id} className="flex flex-col md:flex-row md:gap-4 md:items-start text-white/70 hover:bg-white/5 rounded px-2 py-1 transition">
                <span className="text-emerald-400/80 shrink-0">
                  {new Date(log.createdAt).toISOString().split('T')[1].slice(0, 8)}
                </span>
                <span className={`shrink-0 w-24 uppercase font-bold tracking-wider text-xs flex items-center ${log.action === 'error' ? 'text-red-400' :
                    log.action === 'skipped' ? 'text-amber-400' :
                      log.action === 'bid_placed' ? 'text-emerald-400' : 'text-blue-400'
                  }`}>
                  [{log.action}]
                </span>
                <span className="text-white/80 mt-1 md:mt-0">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

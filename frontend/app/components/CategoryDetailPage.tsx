"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CategorySidebar from "./CategorySidebar";

export type ActionVariant = "primary" | "secondary" | "ghost";

export type CategoryHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  highlight: string;
  statLabel: string;
  statValue: string;
  statDetail: string;
  badge?: string;
  actions?: {
    label: string;
    href?: string;
    variant?: ActionVariant;
  }[];
};

type CategoryMetric = {
  label: string;
  value: string;
  detail: string;
};

type CategoryInsight = {
  label: string;
  detail: string;
  trend: string;
};

type CategoryTimeline = {
  label: string;
  detail: string;
  eta: string;
};

type AuctionItem = {
  name: string;
  img: string;
  currentBid: number;
  endsIn: string;
  watchers: number;
  condition?: string;
  location?: string;
};

type CategoryDetailPageProps = {
  categoryKey: string;
  hero: CategoryHero;
  metrics: CategoryMetric[];
  insights: CategoryInsight[];
  timeline: CategoryTimeline[];
  items: AuctionItem[];
};

const actionVariants: Record<ActionVariant, string> = {
  primary:
    "rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-white/90",
  secondary:
    "rounded-2xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white",
  ghost:
    "rounded-2xl border border-transparent px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:text-white",
};

export default function CategoryDetailPage({
  categoryKey,
  hero,
  metrics,
  insights,
  timeline,
  items,
}: CategoryDetailPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [bid, setBid] = useState("");
  const [error, setError] = useState("");
  const [mergedItems, setMergedItems] = useState<AuctionItem[]>(items);

  // Load created auctions from LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedAuctionsRaw = window.localStorage.getItem("global_auctions");
      if (savedAuctionsRaw) {
        const savedAuctions = JSON.parse(savedAuctionsRaw);
        // Filter by category (case-insensitive)
        const relevantAuctions = savedAuctions.filter((a: any) =>
          a.category.toLowerCase() === categoryKey.toLowerCase()
        );

        const formattedAuctions = relevantAuctions.map((a: any) => ({
          name: a.title,
          img: a.imageUrl,
          currentBid: a.currentBid,
          endsIn: "3d 5h", // mock
          watchers: 0,
          condition: "New Listing",
          location: "Local"
        }));

        setMergedItems(prev => {
          const existingNames = new Set(prev.map(p => p.name));
          const uniqueNew = formattedAuctions.filter((a: any) => !existingNames.has(a.name));
          return [...uniqueNew, ...prev];
        });
      }
    } catch (e) {
      console.error("Failed to load local auctions", e);
    }
  }, [categoryKey]);

  const openModal = (item: AuctionItem) => {
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

  const handleBid = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedItem) return;

    if (!bid || isNaN(Number(bid)) || Number(bid) <= selectedItem.currentBid) {
      setError("Enter a bid higher than the current bid.");
      return;
    }

    closeModal();
    alert("Your bid has been placed!");
  };

  return (
    <div className="min-h-screen bg-[#040918] px-6 py-12 text-white lg:px-12">
      <div className="mx-auto flex w-full flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-72">
          <CategorySidebar category={categoryKey} />
        </div>
        <div className="flex-1 space-y-8">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                  {hero.badge || hero.eyebrow}
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-wide text-white/50">
                    {hero.eyebrow}
                  </p>
                  <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                    {hero.title}
                  </h1>
                  <p className="text-base text-white/70">{hero.subtitle}</p>
                </div>
                <p className="text-sm text-emerald-300">{hero.highlight}</p>
                {hero.actions && hero.actions.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {hero.actions.map((action) => {
                      const variant = action.variant || "primary";
                      const className = actionVariants[variant];
                      if (action.href) {
                        return (
                          <Link key={action.label} href={action.href} className={className}>
                            {action.label}
                          </Link>
                        );
                      }
                      return (
                        <button key={action.label} className={className}>
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-right">
                <p className="text-xs uppercase tracking-wide text-white/50">
                  {hero.statLabel}
                </p>
                <p className="text-4xl font-semibold">{hero.statValue}</p>
                <p className="text-sm text-white/60">{hero.statDetail}</p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-white/10 bg-linear-to-b from-white/10 to-white/0 px-5 py-4"
              >
                <p className="text-xs uppercase tracking-wide text-white/60">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-semibold">{metric.value}</p>
                <p className="text-sm text-emerald-300">{metric.detail}</p>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">
                  Live lots
                </p>
                <h2 className="text-2xl font-semibold">Active consignments</h2>
              </div>
              <span className="text-sm text-white/60">{mergedItems.length} curated lots</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {mergedItems.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                >
                  <button
                    type="button"
                    onClick={() => openModal(item)}
                    className="relative flex h-56 w-full items-center justify-center overflow-hidden border-b border-white/10 bg-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#040918]"
                    aria-label={`View details for ${item.name}`}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm text-white/60">
                      {item.condition || "Verified asset"}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                        <p className="text-xs uppercase tracking-wide text-white/50">
                          Current bid
                        </p>
                        <p className="text-lg font-semibold">${item.currentBid.toLocaleString()}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                        <p className="text-xs uppercase tracking-wide text-white/50">
                          Ends in
                        </p>
                        <p className="text-lg font-semibold">{item.endsIn}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-white/60">{item.watchers} watchers</span>
                      <span className="text-emerald-300">Bid ready</span>
                    </div>
                    <button
                      onClick={() => openModal(item)}
                      className="mt-5 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white/90"
                    >
                      Place bid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {modalOpen && selectedItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1428] p-6 text-white">
            <button
              onClick={closeModal}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xl text-white/60"
            >
              ×
            </button>
            <div className="mt-2 text-center">
              <p className="text-xs uppercase tracking-wide text-white/50">
                Lot details & bid
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{selectedItem.name}</h3>
              <p className="mt-1 text-sm text-white/60">
                Current bid ${selectedItem.currentBid.toLocaleString()} · {selectedItem.endsIn} remaining
              </p>
              <p className="mt-1 text-sm text-white/60">
                {(selectedItem.condition || "Verified asset") + " · " + selectedItem.watchers + " watchers"}
              </p>
            </div>
            <form onSubmit={handleBid} className="mt-6 space-y-4">
              <input
                type="number"
                min={selectedItem.currentBid + 1}
                value={bid}
                onChange={(event) => setBid(event.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-lg text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                placeholder={`Enter a bid greater than $${selectedItem.currentBid.toLocaleString()}`}
                autoFocus
              />
              {error && <p className="text-sm text-rose-400">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white/90"
                >
                  Submit bid
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/70 transition hover:text-white"
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

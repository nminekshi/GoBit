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
  id: string; // Added id
  name: string;
  img: string;
  currentBid: number;
  endsIn: string;
  watchers: number;
  condition?: string;
  location?: string;
  description?: string;
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
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Load auctions from API
  useEffect(() => {
    const loadAuctions = async () => {
      setLoading(true);
      setApiError("");
      try {
        const { auctionAPI } = await import("../lib/api");
        const apiAuctions = await auctionAPI.fetchAuctionsByCategory(categoryKey);

        // Format API auctions to match AuctionItem structure
        const formattedApiAuctions = apiAuctions.map((a: any) => {
          const endTime = new Date(a.endTime);
          const now = new Date();
          const diffMs = endTime.getTime() - now.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const endsIn = diffMs > 0 ? `${diffDays}d ${diffHours}h` : "Ended";

          return {
            id: a._id, // Map _id to id
            name: a.title,
            img: a.imageUrl,
            currentBid: a.currentBid,
            endsIn,
            watchers: a.watchers || 0,
            condition: a.status === "active" ? "Active" : "Completed",
            location: "Online",
            description: a.description || "No description available",
          };
        });

        // Merge with initial items (if any)
        const existingNames = new Set(items.map(i => i.name));
        const uniqueApiAuctions = formattedApiAuctions.filter(
          (a: any) => !existingNames.has(a.name)
        );

        setMergedItems([...uniqueApiAuctions, ...items]);
      } catch (e) {
        console.error("Failed to load auctions from API:", e);
        setApiError("Failed to load auctions. Please try again later.");
        // Fallback to initial items
        setMergedItems(items);
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
  }, [categoryKey, items]);



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

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
                  <p className="text-sm text-white/60">Loading auctions...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loading && apiError && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center">
                <p className="text-rose-300">{apiError}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !apiError && mergedItems.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                <p className="text-lg text-white/60">No active auctions in this category yet.</p>
                <p className="mt-2 text-sm text-white/40">Check back soon for new listings!</p>
              </div>
            )}

            {/* Auction Grid */}
            {!loading && mergedItems.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {mergedItems.map((item) => (
                  <div
                    key={item.id || item.name} // Use ID if available
                    className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                  >
                    <Link
                      href={`/auctions/${item.id}`}
                      className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/10 bg-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#040918]"
                      aria-label={`View details for ${item.name}`}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-contain object-center"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040918] via-transparent to-transparent opacity-70" />
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-xl font-semibold text-white/90">{item.name}</h3>
                      <p className="mt-1 text-sm text-white/60 font-medium">
                        {item.description || "New Listing"}
                      </p>
                      {/* Optional: We can hide condition if description is present, or show both. 
                        The prompt asks to 'add description section' 'like this'. 
                        I'll keep condition below but maybe smaller or just let it stack. */}
                      {item.condition && (
                        <p className="mt-1 text-xs text-white/40">
                          {item.condition}
                        </p>
                      )}
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                          <p className="text-xs uppercase tracking-wide text-white/50">
                            Current bid
                          </p>
                          <p className="text-lg font-semibold">LKR {item.currentBid.toLocaleString()}</p>
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
                      <Link
                        href={`/auctions/${item.id}`}
                        className="mt-5 text-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white/90"
                      >
                        Place bid
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>


    </div>
  );
}

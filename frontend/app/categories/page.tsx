"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { auctionAPI, categorySlugToName } from "../lib/api";

type CategoryAggregate = {
  name: string;
  slug: string;
  description: string;
  heroStat: string;
  lots: number;
  avgUplift: string;
  avgDuration: string;
  tags: string[];
  status: "hot" | "steady" | "new";
  trend: string;
};

const tagFilters = [
  "All",
  "Luxury",
  "Tech",
  "Investment",
  "Fleet",
  "Collectibles",
];

const categoryTags: Record<string, string[]> = {
  watches: ["Luxury", "Collectibles"],
  vehicles: ["Fleet", "Investment"],
  electronics: ["Tech"],
  realestate: ["Investment"],
  art: ["Collectibles", "Luxury"],
  computers: ["Tech", "Investment"],
};

const describeCategory = (slug: string) => {
  switch (slug) {
    case "watches":
      return "Certified timepieces and collector releases.";
    case "vehicles":
      return "Retail and fleet vehicles with transparent history.";
    case "electronics":
      return "Pro audio, video, and consumer tech.";
    case "realestate":
      return "Residential and commercial properties.";
    case "art":
      return "Original works and editions from verified sellers.";
    case "computers":
      return "Laptops, workstations, and compute gear.";
    default:
      return "Active lots in this category.";
  }
};

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortOption, setSortOption] = useState("activity");
  const [categories, setCategories] = useState<CategoryAggregate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quickCategories = useMemo(
    () => categories.map((category) => ({
      name: category.name,
      slug: category.slug,
      href: `/categories/${category.slug}`,
    })),
    [categories]
  );

  const filteredCategories = useMemo(() => {
    return categories
      .filter((category) => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag === "All" || category.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        if (sortOption === "inventory") {
          return b.lots - a.lots;
        }
        if (sortOption === "savings") {
          return parseInt(b.avgUplift) - parseInt(a.avgUplift);
        }
        return b.trend.localeCompare(a.trend);
      });
  }, [categories, searchTerm, selectedTag, sortOption]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auctionAPI.fetchAuctions();
      const now = Date.now();
      const active = (data || []).filter((a) => {
        const start = a.startTime ? new Date(a.startTime).getTime() : now;
        const end = a.endTime ? new Date(a.endTime).getTime() : 0;
        return start <= now && end > now;
      });

      const grouped: Record<string, any[]> = {};
      active.forEach((a: any) => {
        const slug = a.category;
        if (!grouped[slug]) grouped[slug] = [];
        grouped[slug].push(a);
      });

      const aggregates: CategoryAggregate[] = Object.entries(grouped).map(([slug, items]) => {
        const name = categorySlugToName(slug) || slug;
        const lots = items.length;
        const avgUpliftNum = Math.round(
          items.reduce((sum: number, a: any) => {
            const start = a.startPrice || 1;
            const current = a.currentBid || start;
            const uplift = ((current - start) / start) * 100;
            return sum + uplift;
          }, 0) / Math.max(1, lots)
        );
        const avgDurationMs = items.reduce((sum: number, a: any) => {
          const start = a.startTime ? new Date(a.startTime).getTime() : now;
          const end = a.endTime ? new Date(a.endTime).getTime() : now;
          return sum + Math.max(0, end - start);
        }, 0) / Math.max(1, lots);
        const avgHours = Math.max(1, Math.round(avgDurationMs / 3600000));
        const status: CategoryAggregate["status"] = lots > 10 ? "hot" : lots > 3 ? "steady" : "new";
        const tags = categoryTags[slug] || ["Collectibles"];
        return {
          name,
          slug,
          description: describeCategory(slug),
          heroStat: `${lots} active lots`,
          lots,
          avgUplift: `${avgUpliftNum}%`,
          avgDuration: `${avgHours}h avg`,
          tags,
          status,
          trend: `${items[0]?.auctionType === "live" ? "Live" : "Normal"} · ${avgUpliftNum}% uplift`,
        };
      });

      setCategories(aggregates);
    } catch (err: any) {
      setError(err?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040918] text-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#040918] text-white flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg text-rose-300">{error}</p>
        <button
          onClick={() => fetchCategories()}
          className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#040918] text-white">
      <section className="mx-auto flex max-w-full flex-col gap-8 px-6 py-14 lg:flex-row lg:px-12">
        <div className="flex-1 space-y-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
           
            <div className="mt-4 space-y-3">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Browse the full marketplace without the hero fluff
              </h1>
              <p className="text-base text-white/70">
                Search, slice, and shortlist any vertical. Filters, liquidity data,
                and partner-ready exports live in one surface, so you can stay
                focused on categories that convert.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-white/90">
                Build watchlist
              </button>
              <Link
                href="/trending-auctions"
                className="rounded-2xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white"
              >
                Go to trending auctions
              </Link>
              <Link
                href="/ongoing-auctions"
                className="rounded-2xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white"
              >
                Compare ongoing lots
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1">
                <label className="text-xs uppercase tracking-wide text-white/60">
                  Search categories
                </label>
                <input
                  type="text"
                  placeholder="Search by keyword"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/60">
                  Sort
                </label>
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="mt-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-white/40 focus:outline-none"
                >
                  <option value="activity" className="text-gray-900">
                    Activity momentum
                  </option>
                  <option value="inventory" className="text-gray-900">
                    Inventory volume
                  </option>
                  <option value="savings" className="text-gray-900">
                    Avg. savings
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {tagFilters.map((tag) => {
                const isActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`rounded-2xl border px-4 py-2 text-sm transition ${
                      isActive
                        ? "border-white bg-white text-gray-900"
                        : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {quickCategories.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-white/60">Browse by vertical</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {quickCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={category.href}
                    className="rounded-[999px] border border-emerald-400/60 bg-emerald-500/15 px-8 py-5 text-lg font-semibold text-emerald-50 shadow-[0_18px_40px_rgba(16,185,129,0.25)] transition hover:border-emerald-300 hover:bg-emerald-500/30 hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-full px-6 pb-16 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => (
            <div
              key={category.slug}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">
                    {category.heroStat}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold">
                    {category.name}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    category.status === "hot"
                      ? "bg-rose-500/20 text-rose-200"
                      : category.status === "new"
                      ? "bg-cyan-500/20 text-cyan-200"
                      : "bg-white/10 text-white/80"
                  }`}
                >
                  {category.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-white/70">{category.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-white/50">
                    Active lots
                  </p>
                  <p className="text-xl font-semibold">{category.lots}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-white/50">
                    Avg uplift
                  </p>
                  <p className="text-xl font-semibold">{category.avgUplift}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-white/50">
                    Avg duration
                  </p>
                  <p className="text-xl font-semibold">{category.avgDuration}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {category.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/10 px-3 py-1 text-white/80"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-emerald-300">{category.trend}</span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Link
                  href={`/categories/${category.slug}`}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white/90"
                >
                  Open board
                </Link>
                <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white/50 hover:text-white">
                  Pin category
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

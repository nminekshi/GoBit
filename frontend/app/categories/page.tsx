"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Category = {
  name: string;
  slug: string;
  description: string;
  heroStat: string;
  lots: number;
  avgSavings: string;
  turnTime: string;
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

const categoryShowcase: Category[] = [
  {
    name: "Watches",
    slug: "watches",
    description: "Swiss complications, indie makers, and auction-only releases with concierge certification included.",
    heroStat: "Top hammer $420K",
    lots: 184,
    avgSavings: "18%",
    turnTime: "4.5h",
    tags: ["Luxury", "Collectibles"],
    status: "hot",
    trend: "+12% demand",
  },
  {
    name: "Vehicles",
    slug: "vehicles",
    description: "Restomod builds, track-ready exotics, and enterprise fleet liquidations updated twice daily.",
    heroStat: "Cap rate 9.4%",
    lots: 96,
    avgSavings: "27%",
    turnTime: "6.1h",
    tags: ["Fleet", "Investment"],
    status: "steady",
    trend: "+4% bidders",
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Cinema cameras, mastering decks, and audiophile runs sourced from verified production houses.",
    heroStat: "Bundles under $9K",
    lots: 142,
    avgSavings: "33%",
    turnTime: "2.9h",
    tags: ["Tech"],
    status: "hot",
    trend: "+19% watchlists",
  },
  {
    name: "Real Estate",
    slug: "realestate",
    description: "Prime hospitality, logistics hubs, and coastal residential pads with instant underwriting packs.",
    heroStat: "Yield up to 12%",
    lots: 41,
    avgSavings: "11%",
    turnTime: "18h",
    tags: ["Investment"],
    status: "steady",
    trend: "Stable demand",
  },
  {
    name: "Art & Editions",
    slug: "art",
    description: "Museum-provenanced works, signed editions, and primary drops verified on-chain.",
    heroStat: "200+ curators",
    lots: 122,
    avgSavings: "25%",
    turnTime: "5.2h",
    tags: ["Collectibles", "Luxury"],
    status: "new",
    trend: "+6% consignors",
  },
  {
    name: "Computers",
    slug: "computers",
    description: "GPU clusters, edge-ready servers, and XR dev kits available for instant redeployment.",
    heroStat: "Overclocked lots",
    lots: 88,
    avgSavings: "37%",
    turnTime: "3.1h",
    tags: ["Tech", "Investment"],
    status: "hot",
    trend: "+15% funding",
  },
];

const quickCategories = categoryShowcase.map((category) => ({
  name: category.name,
  slug: category.slug,
  href: `/categories/${category.slug}`,
}));

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortOption, setSortOption] = useState("activity");

  const filteredCategories = useMemo(() => {
    return categoryShowcase
      .filter((category) => {
        const matchesSearch = category.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesTag =
          selectedTag === "All" || category.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        if (sortOption === "inventory") {
          return b.lots - a.lots;
        }
        if (sortOption === "savings") {
          return parseInt(b.avgSavings) - parseInt(a.avgSavings);
        }
        return b.trend.localeCompare(a.trend);
      });
  }, [searchTerm, selectedTag, sortOption]);

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
                    Avg savings
                  </p>
                  <p className="text-xl font-semibold">{category.avgSavings}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-white/50">
                    Turn time
                  </p>
                  <p className="text-xl font-semibold">{category.turnTime}</p>
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

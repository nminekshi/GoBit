"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeAuctions: 0,
    usersOnline: 0,
    revenue: 0,
    aiAlerts: 9
  });

  useEffect(() => {
    // Load real auction count from local storage
    const savedAuctionsRaw = window.localStorage.getItem("global_auctions");
    const deletedAuctionsRaw = window.localStorage.getItem("deleted_auctions");

    let activeCount = 0;

    if (savedAuctionsRaw) {
      const savedAuctions = JSON.parse(savedAuctionsRaw);
      const deletedIds = new Set(deletedAuctionsRaw ? JSON.parse(deletedAuctionsRaw) : []);
      const validAuctions = savedAuctions.filter((a: any) => !deletedIds.has(a.id));
      activeCount = validAuctions.length;
    }

    setStats({
      activeAuctions: activeCount,
      // Simulate dynamic users/revenue based on auctions for "aliveness"
      usersOnline: 600 + Math.floor(Math.random() * 100),
      revenue: 80000 + (activeCount * 120),
      aiAlerts: 9
    });
  }, []);

  const handleDownloadReport = () => {
    alert("Downloading platform report... (Simulation)");
  };

  return (
    <main className="min-h-screen bg-[#040918] px-6 py-12 text-white text-xl lg:px-12 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />

      <div className="mx-auto flex max-w-full flex-col gap-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
              Admin dashboard
            </p>
            <h1 className="mt-1 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Platform Overview
            </h1>
            <p className="mt-2 max-w-3xl text-lg text-white/60">
              Real-time monitoring of auctions, users, AI fraud checks, and system health.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadReport}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-white/10 transition"
            >
              Download report
            </button>
            <Link
              href="/admin/settings"
              className="rounded-xl border border-transparent bg-emerald-500 px-5 py-2.5 text-base font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
            >
              Go to settings
            </Link>
          </div>
        </header>

        {/* System overview */}
        <section aria-label="System overview" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">System Overview</h2>
            <p className="text-sm text-slate-400">Today’s snapshot</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-400">
                Active auctions
              </p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.activeAuctions}</p>
              <p className="text-sm text-emerald-400/80">Live Now</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-400">
                Users online
              </p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.usersOnline}</p>
              <p className="text-sm text-slate-400">Currently browsing</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-purple-400">
                Est. Revenue
              </p>
              <p className="mt-2 text-3xl font-bold text-white">${stats.revenue.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Daily Volume</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-400">
                AI alerts (24h)
              </p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.aiAlerts}</p>
              <p className="text-sm text-amber-400/80">Requires Attention</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1.4fr)]">
          {/* Left column: Risk & auctions */}
          <section className="space-y-6">
            {/* AI fraud detection */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">AI Fraud Detection</h2>
                  <p className="text-sm text-slate-400">
                    High-risk activity flagged by the model.
                  </p>
                </div>
                <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-sm font-semibold text-rose-400">
                  6 listings, 3 users
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 mb-6">
                <div className="rounded-xl border border-white/5 bg-white/5 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Flagged listings
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    6 under review
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Price jumps, reused photos.
                  </p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Suspicious bidding
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    3 bidder groups
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Coordinated bidding patterns.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="grid grid-cols-[1.5fr_1.2fr_auto] items-center gap-4 border-b border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300">
                  <span>Listing</span>
                  <span>Reason</span>
                  <span className="text-right">Action</span>
                </div>
                <ul className="divide-y divide-white/5">
                  <li className="grid grid-cols-[1.5fr_1.2fr_auto] items-center gap-4 px-4 py-3 bg-white/5 hover:bg-white/10 transition">
                    <span className="truncate text-white font-medium">#A-4821 · Tesla Model S</span>
                    <span className="text-sm text-rose-300">Price spike vs recent</span>
                    <button className="justify-self-end rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition">
                      Review
                    </button>
                  </li>
                  <li className="grid grid-cols-[1.5fr_1.2fr_auto] items-center gap-4 px-4 py-3 bg-white/5 hover:bg-white/10 transition">
                    <span className="truncate text-white font-medium">#E-9930 · iPhone 15 Pro</span>
                    <span className="text-sm text-amber-300">Linked to banned IP</span>
                    <button className="justify-self-end rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition">
                      Check user
                    </button>
                  </li>
                  <li className="grid grid-cols-[1.5fr_1.2fr_auto] items-center gap-4 px-4 py-3 bg-white/5 hover:bg-white/10 transition">
                    <span className="truncate text-white font-medium">#W-7312 · Rolex Sub</span>
                    <span className="text-sm text-rose-300">Reused photos</span>
                    <button className="justify-self-end rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition">
                      Hold
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Auction moderation */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Auction Moderation</h2>
                  <p className="text-sm text-slate-400">
                    Flagged auctions needing review.
                  </p>
                </div>
                <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-sm font-semibold text-slate-300">
                  4 waiting
                </span>
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10 text-sm">
                <div className="grid grid-cols-[1.5fr_1fr_1.2fr_auto] items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-300">
                  <span>Auction</span>
                  <span>Reporter</span>
                  <span>Reason</span>
                  <span className="text-right">Action</span>
                </div>
                <div className="divide-y divide-white/5">
                  <div className="grid grid-cols-[1.5fr_1fr_1.2fr_auto] items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 transition">
                    <span className="truncate text-white font-medium">#VEH-220 · BMW X5</span>
                    <span className="text-slate-400">user_184</span>
                    <span className="text-slate-300">Misleading desc</span>
                    <button className="justify-self-end rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition">
                      Details
                    </button>
                  </div>
                  <div className="grid grid-cols-[1.5fr_1fr_1.2fr_auto] items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 transition">
                    <span className="truncate text-white font-medium">#ELC-441 · QLED TV</span>
                    <span className="text-slate-400">creator_92</span>
                    <span className="text-slate-300">Shipping issue</span>
                    <button className="justify-self-end rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition">
                      Resolve
                    </button>
                  </div>
                  <div className="grid grid-cols-[1.5fr_1fr_1.2fr_auto] items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 transition">
                    <span className="truncate text-white font-medium">#ART-318 · Painting</span>
                    <span className="text-slate-400">gallery_ad</span>
                    <span className="text-rose-300">IP Rights</span>
                    <button className="justify-self-end rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition">
                      Escalate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right column: Users, AI models, logs */}
          <aside className="space-y-6">
            {/* User management */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">User Management</h2>
                  <p className="text-sm text-slate-400">
                    Quick actions for flagged users.
                  </p>
                </div>
                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 uppercase tracking-wide">
                  3 High Risk
                </span>
              </div>
              <ul className="space-y-3">
                <li className="flex flex-col gap-3 rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-base font-bold text-white">user_842</p>
                      <p className="text-xs text-rose-300 mt-1">Multiple chargebacks, 5 flags</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-rose-500 p-2 text-white hover:bg-rose-600 transition" title="Ban User">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                      </button>
                      <button className="rounded-lg bg-amber-500 p-2 text-white hover:bg-amber-600 transition" title="Suspend User">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </button>
                    </div>
                  </div>
                </li>
                <li className="flex flex-col gap-3 rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-base font-bold text-white">dealer_hub_21</p>
                      <p className="text-xs text-amber-300 mt-1">High volume, 2 open disputes</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 text-white hover:bg-white/20 transition">Review</button>
                    </div>
                  </div>
                </li>
              </ul>
            </section>

            {/* AI model monitoring */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white">AI Monitoring</h2>
              <p className="mt-1 text-sm text-slate-400">
                Live status of fraud & pricing models.
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">Fraud Detection</p>
                    <p className="text-xs text-slate-400">92% precision</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">Price Predictor</p>
                    <p className="text-xs text-slate-400">MAPE 6.4%</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Watch
                  </span>
                </div>
              </div>
            </section>

            {/* Logs & alerts */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Live Logs</h2>
                </div>
                <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
                  View full
                </button>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                  <div>
                    <p className="text-sm font-medium text-white">Fraud spike in Vehicles</p>
                    <p className="text-xs text-slate-500">5 min ago · cluster F-204</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                  <div>
                    <p className="text-sm font-medium text-white">Webhook delay warning</p>
                    <p className="text-xs text-slate-500">18 min ago · /payments</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <div>
                    <p className="text-sm font-medium text-white">Model retrain complete</p>
                    <p className="text-xs text-slate-500">42 min ago · v4.3 deployed</p>
                  </div>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

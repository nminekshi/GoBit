import React from "react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
  <main className="min-h-screen bg-[#040918] px-6 py-12 text-white text-xl lg:px-12">
      <div className="mx-auto flex max-w-full flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-3xl font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Admin dashboard
            </p>
            <h1 className="mt-1 text-5xl font-semibold tracking-tight text-white md:text-6xl">
              Platform overview
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-white/70">
              Quick, human-friendly view of what is happening on your marketplace
              right now: auctions, users, AI fraud checks, and system health.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-lg font-medium text-slate-800 shadow-sm hover:border-emerald-500 hover:text-emerald-700">
              Download report
            </button>
            <Link
              href="/admin/settings"
              className="rounded-xl border border-transparent bg-emerald-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Go to settings
            </Link>
          </div>
        </header>

        {/* System overview */}
        <section aria-label="System overview" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-800">System overview</h2>
            <p className="text-lg text-slate-500">Today’s snapshot (sample data)</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
              <p className="text-xl font-medium uppercase tracking-wide text-emerald-700">
                Active auctions
              </p>
              <p className="mt-2 text-4xl font-semibold text-emerald-900">128</p>
              <p className="text-lg text-emerald-700">+18 vs last 24 hours</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <p className="text-xl font-medium uppercase tracking-wide text-slate-500">
                Users online
              </p>
              <p className="mt-2 text-4xl font-semibold text-slate-900">642</p>
              <p className="text-lg text-slate-500">312 currently bidding</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <p className="text-xl font-medium uppercase tracking-wide text-slate-500">
                Revenue today
              </p>
              <p className="mt-2 text-4xl font-semibold text-slate-900">$84,320</p>
              <p className="text-lg text-slate-500">Month to date: $1.3M</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-xl font-medium uppercase tracking-wide text-amber-700">
                AI alerts (24h)
              </p>
              <p className="mt-2 text-4xl font-semibold text-amber-900">9</p>
              <p className="text-lg text-amber-700">3 critical, 6 warnings</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1.4fr)]">
          {/* Left column: Risk & auctions */}
          <section className="space-y-6">
            {/* AI fraud detection */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">AI fraud detection</h2>
                  <p className="text-lg text-slate-500">
                    Quick view of what the fraud model thinks is risky.
                  </p>
                </div>
                <span className="rounded-full bg-rose-50 px-4 py-2 text-base font-medium text-rose-700">
                  6 listings, 3 users
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-base">
                  <p className="text-lg font-medium uppercase tracking-wide text-slate-500">
                    Flagged listings
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">
                    6 under review
                  </p>
                  <p className="mt-1 text-lg text-slate-500">
                    Mostly price jumps, reused photos, and odd bid patterns.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-base">
                  <p className="text-lg font-medium uppercase tracking-wide text-slate-500">
                    Suspicious bidding
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">
                    3 bidder groups
                  </p>
                  <p className="mt-1 text-lg text-slate-500">
                    Same accounts bidding together at the last second.
                  </p>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 text-base">
                <div className="grid grid-cols-[1.4fr_1.2fr_auto] items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-600">
                  <span>Listing</span>
                  <span>Why flagged?</span>
                  <span className="text-right">Next step</span>
                </div>
                <ul className="divide-y divide-slate-200">
                  <li className="grid grid-cols-[1.4fr_1.2fr_auto] items-center gap-3 px-4 py-2">
                    <span className="truncate text-slate-800">#A-4821 · Tesla Model S</span>
                    <span className="text-lg text-slate-600">Price spike vs recent sales</span>
                    <button className="justify-self-end rounded-full bg-emerald-50 px-4 py-2 text-base font-medium text-emerald-700 hover:bg-emerald-100">
                      Review
                    </button>
                  </li>
                  <li className="grid grid-cols-[1.4fr_1.2fr_auto] items-center gap-3 px-4 py-2">
                    <span className="truncate text-slate-800">#E-9930 · iPhone 15 Pro</span>
                    <span className="text-lg text-slate-600">IP address linked to banned user</span>
                    <button className="justify-self-end rounded-full bg-amber-50 px-4 py-2 text-base font-medium text-amber-700 hover:bg-amber-100">
                      Check user
                    </button>
                  </li>
                  <li className="grid grid-cols-[1.4fr_1.2fr_auto] items-center gap-3 px-4 py-2">
                    <span className="truncate text-slate-800">#W-7312 · Rolex Submariner</span>
                    <span className="text-lg text-slate-600">Photos reused from another site</span>
                    <button className="justify-self-end rounded-full bg-rose-50 px-4 py-2 text-base font-medium text-rose-700 hover:bg-rose-100">
                      Hold payout
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Auction moderation */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">Auction moderation</h2>
                  <p className="text-lg text-slate-500">
                    Reported or flagged auctions that need a human decision.
                  </p>
                </div>
                <span className="rounded-full bg-slate-50 px-4 py-2 text-base font-medium text-slate-700">
                  4 waiting review
                </span>
              </div>
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 text-base">
                <div className="grid grid-cols-[1.6fr_1fr_1.2fr_auto] items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-600">
                  <span>Auction</span>
                  <span>Reporter</span>
                  <span>Reason</span>
                  <span className="text-right">Action</span>
                </div>
                <div className="divide-y divide-slate-200">
                  <div className="grid grid-cols-[1.6fr_1fr_1.2fr_auto] items-center gap-3 px-4 py-3">
                    <span className="truncate text-slate-800">#VEH-220 · BMW X5 Executive Fleet</span>
                    <span className="text-lg text-slate-600">user_184</span>
                    <span className="text-lg text-slate-600">Misleading description</span>
                    <button className="justify-self-end rounded-full bg-emerald-50 px-4 py-2 text-base font-medium text-emerald-700 hover:bg-emerald-100">
                      Open details
                    </button>
                  </div>
                  <div className="grid grid-cols-[1.6fr_1fr_1.2fr_auto] items-center gap-3 px-4 py-3">
                    <span className="truncate text-slate-800">#ELC-441 · Samsung QLED TV</span>
                    <span className="text-lg text-slate-600">creator_92</span>
                    <span className="text-lg text-slate-600">Shipping / delivery issue</span>
                    <button className="justify-self-end rounded-full bg-slate-50 px-4 py-2 text-base font-medium text-slate-700 hover:bg-slate-100">
                      Mark resolved
                    </button>
                  </div>
                  <div className="grid grid-cols-[1.6fr_1fr_1.2fr_auto] items-center gap-3 px-4 py-3">
                    <span className="truncate text-slate-800">#ART-318 · Abstract Painting</span>
                    <span className="text-lg text-slate-600">gallery_admin</span>
                    <span className="text-lg text-slate-600">Potential IP / rights issue</span>
                    <button className="justify-self-end rounded-full bg-rose-50 px-4 py-2 text-base font-medium text-rose-700 hover:bg-rose-100">
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
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">User management</h2>
                  <p className="text-lg text-slate-500">
                    Ban, suspend, or warn users directly from the dashboard.
                  </p>
                </div>
                <span className="rounded-full bg-slate-50 px-4 py-2 text-base font-medium text-slate-700">
                  3 high‑risk users
                </span>
              </div>
              <ul className="mt-3 space-y-3 text-base">
                <li className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">user_842</p>
                    <p className="text-lg text-slate-600">Multiple chargebacks, 5 fraud flags</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-full bg-rose-50 px-4 py-2 text-base font-medium text-rose-700 hover:bg-rose-100">
                      Ban
                    </button>
                    <button className="rounded-full bg-amber-50 px-4 py-2 text-base font-medium text-amber-700 hover:bg-amber-100">
                      Suspend
                    </button>
                    <button className="rounded-full bg-slate-200 px-4 py-2 text-base font-medium text-slate-800 hover:bg-slate-300">
                      Warn
                    </button>
                  </div>
                </li>
                <li className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">dealer_hub_21</p>
                    <p className="text-lg text-slate-600">High‑volume seller, 2 open disputes</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-full bg-amber-50 px-4 py-2 text-base font-medium text-amber-700 hover:bg-amber-100">
                      Review
                    </button>
                    <button className="rounded-full bg-slate-200 px-4 py-2 text-base font-medium text-slate-800 hover:bg-slate-300">
                      Add note
                    </button>
                  </div>
                </li>
                <li className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">creator_92</p>
                    <p className="text-lg text-slate-600">One AI alert, otherwise clean history</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-full bg-slate-200 px-4 py-2 text-base font-medium text-slate-800 hover:bg-slate-300">
                      Dismiss alert
                    </button>
                  </div>
                </li>
              </ul>
            </section>

            {/* AI model monitoring */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-semibold text-slate-800">AI model monitoring</h2>
              <p className="mt-2 text-lg text-slate-500">
                Quick status of the fraud model and price predictor.
              </p>
              <div className="mt-4 space-y-3 text-base">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">Fraud detection model</p>
                    <p className="text-lg text-slate-600">Precision 92%, recall 88%</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-base font-medium text-emerald-700">
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">Price predictor</p>
                    <p className="text-lg text-slate-600">MAPE 6.4% on last 7 days</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-4 py-2 text-base font-medium text-amber-700">
                    Watch
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">Bid recommendation</p>
                    <p className="text-lg text-slate-600">34% of users opted in, +3.1% uplift</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-base font-medium text-emerald-700">
                    Improving
                  </span>
                </div>
              </div>
            </section>

            {/* Logs & alerts */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">Logs & alerts</h2>
                  <p className="text-lg text-slate-500">Most recent important events.</p>
                </div>
                <button className="rounded-full bg-slate-50 px-4 py-2 text-base font-medium text-slate-700 hover:bg-slate-100">
                  View full log
                </button>
              </div>
              <ul className="mt-3 space-y-3 text-base">
                <li className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-500" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">AI alert: fraud spike in Vehicles</p>
                    <p className="text-sm text-slate-600">5 min ago · cluster ID F-204</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">System warning: delayed webhook</p>
                    <p className="text-sm text-slate-600">18 min ago · /payments/settled</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Info: nightly model retrain complete</p>
                    <p className="text-sm text-slate-600">42 min ago · fraud_v4.3 deployed</p>
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

"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function BuyerDashboard() {
  const [autoBidEnabled, setAutoBidEnabled] = useState(true);

  return (
  <main className="min-h-screen bg-[#040918] px-4 py-10 text-white text-lg sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-full flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-3xl font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Buyer dashboard
            </p>
            <h1 className="mt-1 text-5xl font-semibold tracking-tight md:text-6xl">
              Welcome back, bidder
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/70 md:text-lg">
              Track the auctions you care about, tune your auto-bid bot,
              and see simple AI insights on pricing and trust before you place bids.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/categories"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-white/90 md:text-base"
            >
              Explore categories
            </Link>
            <Link
              href="/trending-auctions"
              className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white md:text-base"
            >
              View trending auctions
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
          {/* Left column */}
          <section className="space-y-6">
            {/* Personalized Feed */}
            <div className="rounded-2xl border border-white/10 bg-white p-6 text-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold md:text-3xl">Personalized feed</h2>
                  <p className="mt-1 text-base text-slate-600 md:text-lg">
                    AI-recommended auctions based on what you watch, bid on, and win.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  AI powered
                </span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Sneakers</p>
                  <p className="mt-1 text-base font-semibold text-slate-900 md:text-lg">Jordan 1 Retro High</p>
                  <p className="mt-1 text-xs text-slate-600">Ends in 2h 18m · 14 bids</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Phones</p>
                  <p className="mt-1 text-base font-semibold text-slate-900 md:text-lg">iPhone 15 Pro Max</p>
                  <p className="mt-1 text-xs text-slate-600">Ends in 5h 02m · 21 bids</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Tech</p>
                  <p className="mt-1 text-base font-semibold text-slate-900 md:text-lg">RTX 4090 Gaming PC</p>
                  <p className="mt-1 text-xs text-slate-600">Ends in 1d 03h · 9 bids</p>
                </div>
              </div>
            </div>

            {/* Live Auctions */}
            <div className="rounded-2xl border border-white/10 bg-white p-6 text-slate-900">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold md:text-3xl">Live auctions</h2>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
                  Live now
                </span>
              </div>
      				<p className="mt-1 text-base text-slate-600 md:text-lg">
                Auctions you're currently bidding on, with real-time updates.
              </p>
              <div className="mt-4 space-y-3 text-sm md:text-base">
                <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">Gaming laptop · RTX 4080</p>
                    <p className="text-xs text-slate-600">Your bid: $2,120 · 2m ago</p>
                  </div>
                  <div className="text-right text-xs md:text-sm">
                    <p className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                      Winning
                    </p>
                    <p className="text-slate-600">Ends in 32m</p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">Vintage Rolex Datejust</p>
                    <p className="text-xs text-slate-600">Highest bid: $5,430</p>
                  </div>
                  <div className="text-right text-xs md:text-sm">
                    <p className="inline-flex items-center justify-center rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700">
                      Outbid
                    </p>
                    <p className="text-slate-600">Ends in 1h 12m</p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">PS5 Digital Edition</p>
                    <p className="text-xs text-slate-600">Your bid: $520</p>
                  </div>
                  <div className="text-right text-xs md:text-sm">
                    <p className="inline-flex items-center justify-center rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                      Close
                    </p>
                    <p className="text-slate-600">Ends in 8m</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Watchlist & History */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white p-6 text-slate-900">
                <h2 className="text-xl font-semibold md:text-2xl">Watchlist</h2>
                <p className="mt-1 text-base text-slate-600">Items you're tracking but not bidding on yet.</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span>MacBook Pro 16" · M3</span>
                    <span className="text-xs text-slate-600">Ends in 3d</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Tesla Model 3 · 2021</span>
                    <span className="text-xs text-slate-600">Ends in 5d</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Canon R5 + RF 24-70</span>
                    <span className="text-xs text-slate-600">Ends in 18h</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white p-6 text-slate-900">
                <h2 className="text-xl font-semibold md:text-2xl">Bid history & won auctions</h2>
                <p className="mt-1 text-base text-slate-600">Quick look at your recent bidding activity.</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span>iPad Pro 12.9" (Won)</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Paid
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Yeezy 350 V2 (Bid)</span>
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                      Outbid
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>LG OLED 65" (Won)</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Awaiting pickup
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Right column */}
          <aside className="space-y-6">
            {/* AI Insights Panel */}
            <section className="rounded-2xl border border-white/10 bg-white p-6 text-slate-900">
              <h2 className="text-2xl font-semibold md:text-3xl">AI insights</h2>
              <p className="mt-1 text-base text-slate-600 md:text-lg">
                Predictions and trust signals for the auctions you care about.
              </p>
              <div className="mt-4 space-y-3 text-sm md:text-base">
                <div className="rounded-xl bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Predicted price range</p>
                  <p className="mt-1 text-lg font-semibold">$1,850 – $2,150</p>
                  <p className="text-xs text-slate-600">Based on similar items, seasonality, and demand.</p>
                </div>
                <div className="rounded-xl bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Seller trust score</p>
                  <p className="mt-1 text-lg font-semibold">4.8 / 5.0</p>
                  <p className="text-xs text-slate-600">Fast shipping, responsive, and low dispute rate.</p>
                </div>
                <div className="rounded-xl bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Sentiment summary</p>
                  <p className="mt-1 text-sm text-slate-700">
                    "Reviews highlight accurate descriptions and strong packaging. Occasional delays on
                    international shipping, but issues are usually resolved quickly."
                  </p>
                </div>
              </div>
            </section>

            {/* Auto-Bid Bot Settings */}
            <section className="rounded-2xl border border-white/10 bg-white p-6 text-slate-900">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold md:text-3xl">Auto-bid bot</h2>
                <button
                  type="button"
                  onClick={() => setAutoBidEnabled((prev) => !prev)}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition md:text-sm ${
                    autoBidEnabled
                      ? "bg-emerald-500/90 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <span
                    className={`mr-2 h-2 w-2 rounded-full ${
                      autoBidEnabled ? "bg-emerald-200" : "bg-slate-500"
                    }`}
                  />
                  {autoBidEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
      			  <p className="mt-1 text-base text-slate-600 md:text-lg">
                Set your guardrails and let the bot place bids for you.
              </p>
              <div className="mt-4 space-y-3 text-sm md:text-base">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-slate-600">
                    Max budget (per auction)
                  </label>
                  <input
                    type="number"
                    placeholder="$2,000"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none md:text-base"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-slate-600">
                    Aggressiveness level
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none md:text-base"
                    defaultValue="balanced"
                  >
                    <option value="calm" className="text-gray-900">
                      Calm (only key jumps)
                    </option>
                    <option value="balanced" className="text-gray-900">
                      Balanced (smart increments)
                    </option>
                    <option value="aggressive" className="text-gray-900">
                      Aggressive (stay on top)
                    </option>
                  </select>
                </div>
              </div>
            </section>

            {/* Payments & Invoices */}
            <section className="rounded-2xl border border-white/10 bg-white p-6 text-slate-900">
              <h2 className="text-2xl font-semibold md:text-3xl">Payments & invoices</h2>
              <p className="mt-1 text-base text-slate-600 md:text-lg">
                Keep track of what you've paid and what's due.
              </p>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 md:text-base">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Due now</p>
                  <p className="mt-1 text-lg font-semibold">$1,240</p>
                  <p className="text-xs text-slate-600">2 invoices awaiting payment</p>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Paid this month</p>
                  <p className="mt-1 text-lg font-semibold">$3,980</p>
                  <p className="text-xs text-slate-600">Across 5 completed auctions</p>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="rounded-2xl border border-white/10 bg-white p-6 text-slate-900">
              <h2 className="text-2xl font-semibold md:text-3xl">Notifications</h2>
              <p className="mt-1 text-base text-slate-600 md:text-lg">
                Stay ahead of outbids and auctions that are about to close.
              </p>
              <ul className="mt-3 space-y-3 text-sm md:text-base">
                <li className="flex items-start gap-3 rounded-xl bg-white px-4 py-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-400" />
                  <div>
                    <p className="font-semibold">Outbid on "Vintage Rolex Datejust"</p>
                    <p className="text-xs text-slate-600">Raise your max or let auto-bid handle it.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-white px-4 py-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                  <div>
                    <p className="font-semibold">Auction ending soon: "PS5 Digital Edition"</p>
                    <p className="text-xs text-slate-600">8 minutes left · current bid $520.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-white px-4 py-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                  <div>
                    <p className="font-semibold">Invoice ready for "LG OLED 65"</p>
                    <p className="text-xs text-slate-600">Pay within 48 hours to avoid relist.</p>
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

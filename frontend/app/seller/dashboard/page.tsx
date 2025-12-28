"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SellerDashboard() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <main className="min-h-screen bg-linear-to-br from-sky-50 via-slate-50 to-indigo-100 px-4 py-10 text-slate-900 text-xl sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-full flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-emerald-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-3xl font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Seller dashboard
            </p>
            <h1 className="mt-1 text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Welcome back, Seller
            </h1>
            <p className="mt-4 max-w-3xl text-xl text-slate-600">
              Create new auctions, track performance, and see simple AI insights
              about your prices, timing, and buyer trust.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-xl font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              + Create new auction
            </button>
            <Link
              href="/categories"
              className="rounded-xl border border-emerald-200 bg-white px-6 py-3 text-xl font-semibold text-emerald-800 shadow-sm hover:border-emerald-400"
            >
              Switch to buyer view
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
          {/* Left column */}
          <section className="space-y-6">
            {/* My Auctions */}
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-semibold text-slate-900">My auctions</h2>
                  <p className="mt-2 text-lg text-slate-600">
                    See what is live, scheduled, and already completed.
                  </p>
                </div>
                <div className="inline-flex gap-1 rounded-full bg-slate-100 p-1 text-base font-medium text-slate-700">
                  <span className="rounded-full bg-white px-4 py-1.5">Live</span>
                  <span className="rounded-full px-4 py-1.5">Scheduled</span>
                  <span className="rounded-full px-4 py-1.5">Completed</span>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                    Live
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">3 active auctions</p>
                  <p className="text-sm text-slate-600">Avg. 12 bidders each</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Scheduled
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">2 upcoming</p>
                  <p className="text-sm text-slate-600">Starting in next 24 hours</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Completed
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">18 closed</p>
                  <p className="text-sm text-slate-600">Last 30 days</p>
                </div>
              </div>
            </div>

            {/* Bids Overview */}
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-3xl font-semibold text-slate-900">Bids overview</h2>
              <p className="mt-2 text-lg text-slate-600">
                Simple view of your current bidding activity.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Current highest bid
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">$2,120</p>
                  <p className="text-sm text-slate-600">On "Gaming laptop · RTX 4080"</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Bid activity (today)
                  </p>
                  <div className="mt-2 space-y-2 text-sm text-slate-700">
                    <div className="flex items-center justify-between gap-2">
                      <span>Morning</span>
                      <div className="h-1.5 flex-1 rounded-full bg-slate-200">
                        <div className="h-1.5 w-1/3 rounded-full bg-emerald-500" />
                      </div>
                      <span>7 bids</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Afternoon</span>
                      <div className="h-1.5 flex-1 rounded-full bg-slate-200">
                        <div className="h-1.5 w-2/3 rounded-full bg-emerald-500" />
                      </div>
                      <span>18 bids</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Evening</span>
                      <div className="h-1.5 flex-1 rounded-full bg-slate-200">
                        <div className="h-1.5 w-1/2 rounded-full bg-emerald-500" />
                      </div>
                      <span>11 bids</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews & Trust Score (moved from right column) */}
            <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-3xl font-semibold text-slate-900">Reviews & trust score</h2>
              <p className="mt-2 text-lg text-slate-600">
                How buyers see you, with a simple AI summary.
              </p>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
                <div>
                  <p className="text-base font-semibold text-slate-900">Trust score</p>
                  <p className="text-2xl font-semibold text-emerald-700">4.7 / 5.0</p>
                  <p className="text-sm text-slate-600">Based on 96 reviews</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Mostly positive
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 px-4 py-4 text-base text-slate-700">
                <p className="text-lg font-semibold text-slate-900">AI sentiment summary</p>
                <p className="mt-1 text-base text-slate-700">
                  Buyers like your clear photos and honest descriptions. A few
                  reviews mention slower shipping on large items.
                </p>
              </div>
            </section>
          </section>

          {/* Right column */}
          <aside className="space-y-6">
            {/* AI Performance Insights */}
            <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-3xl font-semibold text-slate-900">AI performance insights</h2>
              <p className="mt-2 text-lg text-slate-600">
                How your final prices compare to AI predictions.
              </p>
              <div className="mt-4 space-y-3 text-base">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">Predicted vs final price</p>
                    <p className="text-sm text-slate-600">Last 10 auctions</p>
                  </div>
                  <p className="text-lg font-semibold text-emerald-700">+6.3% above</p>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">Best auction timing</p>
                    <p className="text-sm text-slate-600">Based on bid activity</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-800">Evenings · 6–9 PM</p>
                </div>
              </div>
            </section>

            {/* Payments & Earnings */}
            <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-3xl font-semibold text-slate-900">Payments & earnings</h2>
              <p className="mt-2 text-lg text-slate-600">
                Simple snapshot of your payouts.
              </p>
              <div className="mt-4 grid gap-3 text-base md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    This month
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">$8,420</p>
                  <p className="text-sm text-slate-600">Completed and cleared</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Pending
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">$1,130</p>
                  <p className="text-sm text-slate-600">Awaiting buyer payment</p>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-3xl font-semibold text-slate-900">Notifications</h2>
              <p className="mt-2 text-lg text-slate-600">
                Quick updates about new bids and completed auctions.
              </p>
              <ul className="mt-3 space-y-3 text-base">
                <li className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">New bid on "Gaming laptop"</p>
                    <p className="text-sm text-slate-600">$40 higher · 2 min ago</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">New bid on "Vintage watch"</p>
                    <p className="text-sm text-slate-600">You are still winning · 12 min ago</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-500" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Auction completed: "Art print"</p>
                    <p className="text-sm text-slate-600">Buyer has 48 hours to pay</p>
                  </div>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 text-base shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Close
            </button>
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  New auction
                </p>
                <h2 className="mt-1 text-3xl font-semibold text-slate-900">Create auction</h2>
                <p className="mt-2 text-base text-slate-600">
                  Fill in the basic details. This is a demo form only – nothing will
                  be saved.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-lg font-semibold text-slate-700" htmlFor="modalItemTitle">
                    Item title
                  </label>
                  <input
                    id="modalItemTitle"
                    type="text"
                    placeholder={'e.g. 2020 MacBook Pro 16"'}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-lg font-semibold text-slate-700" htmlFor="modalCategory">
                    Category
                  </label>
                  <select
                    id="modalCategory"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl text-slate-900 outline-none focus:border-emerald-500"
                  >
                    <option>Electronics</option>
                    <option>Vehicles</option>
                    <option>Real estate</option>
                    <option>Watches</option>
                    <option>Art</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-lg font-semibold text-slate-700" htmlFor="modalStartPrice">
                    Starting price
                  </label>
                  <input
                    id="modalStartPrice"
                    type="number"
                    placeholder="$0.00"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-lg font-semibold text-slate-700">
                    Upload images
                  </label>
                  <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
                    <p className="text-lg font-semibold text-slate-800">Drag & drop files</p>
                    <p className="text-sm text-slate-500">or click to browse (demo only)</p>
                  </div>
                </div>
                <div className="grid gap-3 rounded-xl bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                      AI price suggestion
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                      $1,850 - $2,050
                    </p>
                    <p className="text-sm text-slate-600">
                      Based on similar recent auctions and condition.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                      AI authenticity check
                    </p>
                    <p className="mt-1 text-base text-slate-800">
                      Likely authentic
                      <span className="ml-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        92% confidence
                      </span>
                    </p>
                    <p className="text-sm text-slate-600">
                      Final review still required before publishing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-base font-medium text-slate-800 hover:border-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl bg-slate-900 px-6 py-3 text-xl font-semibold text-white opacity-80"
              >
                Publish (demo only)
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

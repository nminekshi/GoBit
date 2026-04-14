"use client";

import Link from "next/link";
import SmartAutoBidAgentPanel from "../../components/SmartAutoBidAgentPanel";

export default function SmartAutoBiddingPage() {
  return (
    <main className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="w-full space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Smart Auto-Bidding Agent</h1>
            <p className="mt-2 text-sm text-white/70 sm:text-base">
              Configure category-wide automated bidding with budget protection, targeting, and real-time alerts.
            </p>
          </div>
          <Link
            href="/buyer/dashboard"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75 sm:p-5">
          <p>
            Tips: Enable the agent, choose category, set your max budget, and keep an eye on remaining budget and
            targeted auctions. Bids are auto-placed only when auction rules and your budget allow it.
          </p>
        </div>

        <SmartAutoBidAgentPanel />
      </div>
    </main>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import { Banknote, Download, Filter, Package, RefreshCw, Wallet, ChevronRight, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const STATUS_BADGES: Record<string, string> = {
  Paid: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  Pending: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  Failed: "text-rose-300 bg-rose-500/10 border-rose-500/30",
};

type Order = {
  id: string;
  item: string;
  buyer: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  date: string;
  method: string;
};

const MOCK_ORDERS: Order[] = [
  { id: "INV-2048", item: "Vintage Rolex Datejust", buyer: "kevin@lux.com", amount: 52000, status: "Paid", date: "2026-02-04", method: "Stripe" },
  { id: "INV-2047", item: "MacBook Pro M3", buyer: "sara@dev.io", amount: 2900, status: "Pending", date: "2026-02-03", method: "PayPal" },
  { id: "INV-2046", item: "PS5 Digital", buyer: "gio@play.gg", amount: 320, status: "Paid", date: "2026-02-02", method: "Stripe" },
  { id: "INV-2045", item: "Aeron Chair", buyer: "office@ergon.com", amount: 650, status: "Paid", date: "2026-02-01", method: "Bank" },
  { id: "INV-2044", item: "Z6 II Body", buyer: "cam@studio.com", amount: 1400, status: "Failed", date: "2026-01-30", method: "Stripe" },
];

const TABS = ["All", "Paid", "Pending", "Failed"] as const;

type Tab = (typeof TABS)[number];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filtered = useMemo(() => {
    if (activeTab === "All") return MOCK_ORDERS;
    return MOCK_ORDERS.filter((o) => o.status === activeTab);
  }, [activeTab]);

  const paidTotal = MOCK_ORDERS.filter(o => o.status === "Paid").reduce((s, o) => s + o.amount, 0);
  const pendingTotal = MOCK_ORDERS.filter(o => o.status === "Pending").reduce((s, o) => s + o.amount, 0);

  return (
    <main className="min-h-screen w-full bg-[#050914] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-wrap items-center gap-3 justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Seller</p>
            <h1 className="text-3xl font-bold text-white">Orders & Payouts</h1>
            <p className="text-sm text-white/60">Track settlements, download invoices, and manage disbursements.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/60">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/60">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Wallet} label="Paid to you" value={`$${paidTotal.toLocaleString()}`} accent="emerald" />
          <StatCard icon={Clock} label="Pending releases" value={`$${pendingTotal.toLocaleString()}`} accent="amber" />
          <StatCard icon={Banknote} label="Next payout" value="$4,850" accent="cyan" sub="Arrives Feb 09" />
          <StatCard icon={Package} label="Orders this week" value="18" accent="indigo" sub="3 awaiting dispatch" />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1 rounded-xl bg-white/5 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    activeTab === tab ? "bg-emerald-500 text-black" : "text-white/70 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
              <Filter className="h-4 w-4" />
              Quick filter
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-white/5">
            <table className="w-full text-sm text-white/80">
              <thead className="bg-white/5 text-white/60">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Invoice</th>
                  <th className="px-4 py-3 text-left font-semibold">Item</th>
                  <th className="px-4 py-3 text-left font-semibold">Buyer</th>
                  <th className="px-4 py-3 text-left font-semibold">Method</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-white/3">
                    <td className="px-4 py-3 font-semibold text-white">{o.id}</td>
                    <td className="px-4 py-3">{o.item}</td>
                    <td className="px-4 py-3 text-white/70">{o.buyer}</td>
                    <td className="px-4 py-3 text-white/70">{o.method}</td>
                    <td className="px-4 py-3 text-white/60">{o.date}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-200">${o.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_BADGES[o.status]}`}>
                        {o.status === "Paid" && <CheckCircle className="h-3.5 w-3.5" />}
                        {o.status === "Pending" && <Clock className="h-3.5 w-3.5" />}
                        {o.status === "Failed" && <XCircle className="h-3.5 w-3.5" />}
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-emerald-400/60 hover:text-white">
                        View <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: "emerald" | "amber" | "cyan" | "indigo";
  sub?: string;
};

function StatCard({ icon: Icon, label, value, sub, accent }: StatCardProps) {
  const accentMap: Record<StatCardProps["accent"], { bg: string; text: string; ring: string }> = {
    emerald: { bg: "from-emerald-600/20", text: "text-emerald-300", ring: "ring-emerald-500/30" },
    amber: { bg: "from-amber-500/25", text: "text-amber-200", ring: "ring-amber-400/30" },
    cyan: { bg: "from-cyan-500/25", text: "text-cyan-200", ring: "ring-cyan-400/30" },
    indigo: { bg: "from-indigo-500/25", text: "text-indigo-200", ring: "ring-indigo-400/30" },
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 ring-1 ring-white/5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accentMap[accent].bg} ${accentMap[accent].ring}`}>
        <Icon className={`h-5 w-5 ${accentMap[accent].text}`} />
      </div>
      <p className="mt-3 text-sm uppercase tracking-wide text-white/60">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-white/50">{sub}</p>}
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Banknote, Download, Filter, Package, RefreshCw, Wallet, ChevronRight, Clock, CheckCircle, XCircle } from "lucide-react";

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

const TABS = ["All", "Paid", "Pending", "Failed"] as const;
type Tab = (typeof TABS)[number];

const STORAGE_KEY = "seller-orders";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string | null; name: string | null } | null>(null);

  const [form, setForm] = useState<{ id: string; item: string; buyer: string; amount: string; status: Order["status"]; date: string; method: string }>(
    { id: "", item: "", buyer: "", amount: "", status: "Paid", date: "", method: "" }
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const id = parsed?.user?._id || parsed?.user?.id || parsed?.user?.uid || parsed?.user?.email || parsed?.user?.username || null;
      const name = parsed?.user?.username || parsed?.user?.name || parsed?.user?.email || null;
      if (!id) return;
      setCurrentUser({ id, name });

      const stored = window.localStorage.getItem(STORAGE_KEY);
      const map = stored ? JSON.parse(stored) : {};
      const mine = Array.isArray(map?.[id]) ? map[id] : [];
      setOrders(mine);
    } catch {
      // ignore
    }
  }, []);

  const persistOrders = (next: Order[]) => {
    if (typeof window === "undefined" || !currentUser?.id) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const map = stored ? JSON.parse(stored) : {};
      map[currentUser.id] = next;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      setOrders(next);
    } catch {
      // ignore
    }
  };

  const handleAdd = () => {
    if (!currentUser?.id) {
      alert("Please log in as a seller to add orders.");
      return;
    }
    if (!form.id.trim() || !form.item.trim() || !form.buyer.trim() || !form.amount.trim() || !form.date.trim() || !form.method.trim()) {
      alert("Fill in invoice, item, buyer, amount, date, and method.");
      return;
    }
    const amount = Number(form.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }
    const next: Order = {
      id: form.id.trim(),
      item: form.item.trim(),
      buyer: form.buyer.trim(),
      amount,
      status: form.status,
      date: form.date,
      method: form.method.trim(),
    };
    const merged = [next, ...orders.filter((o) => o.id !== next.id)].slice(0, 100);
    persistOrders(merged);
    setForm({ id: "", item: "", buyer: "", amount: "", status: "Paid", date: "", method: "" });
  };

  const handleRefresh = () => {
    if (typeof window === "undefined" || !currentUser?.id) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const map = stored ? JSON.parse(stored) : {};
      const mine = Array.isArray(map?.[currentUser.id]) ? map[currentUser.id] : [];
      setOrders(mine);
    } catch {
      // ignore
    }
  };

  const handleExport = (rows: Order[]) => {
    if (!rows.length) {
      alert("No orders to export for this view.");
      return;
    }
    const header = ["Invoice","Item","Buyer","Method","Date","Amount","Status"];
    const csvRows = rows.map((o) => [o.id, o.item, o.buyer, o.method, o.date, o.amount.toString(), o.status]);
    const csv = [header, ...csvRows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [activeTab, orders]);

  const paidTotal = filtered.filter(o => o.status === "Paid").reduce((s, o) => s + o.amount, 0);
  const pendingTotal = filtered.filter(o => o.status === "Pending").reduce((s, o) => s + o.amount, 0);

  const ordersThisWeek = useMemo(() => {
    const now = new Date();
    return filtered.filter((o) => {
      const d = new Date(o.date);
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    }).length;
  }, [filtered]);

  return (
    <main className="min-h-screen w-full bg-[#050914] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="flex w-full flex-col gap-6 min-h-[90vh]">
        <header className="flex flex-wrap items-center gap-3 justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Seller</p>
            <h1 className="text-3xl font-bold text-white">Orders & Payouts</h1>
            <p className="text-sm text-white/60">Track settlements, download invoices, and manage disbursements.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/60"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
              onClick={() => handleExport(filtered)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/60"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Wallet} label={`Paid (${activeTab})`} value={`$${paidTotal.toLocaleString()}`} accent="emerald" />
          <StatCard icon={Clock} label={`Pending (${activeTab})`} value={`$${pendingTotal.toLocaleString()}`} accent="amber" />
          <StatCard icon={Banknote} label="Next payout" value={`$${pendingTotal.toLocaleString()}`} accent="cyan" sub={`${activeTab === "All" ? "Based on pending" : `Filtered: ${activeTab}`}`} />
          <StatCard icon={Package} label="Orders this week" value={ordersThisWeek.toString()} accent="indigo" sub={`${ordersThisWeek} in last 7 days (${activeTab})`} />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur min-h-[60vh]">
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

          <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <p className="text-white/70">Add a settled/pending order to track it here.</p>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              <input
                value={form.id}
                onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                placeholder="Invoice ID (e.g., INV-2049)"
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
              />
              <input
                value={form.item}
                onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))}
                placeholder="Item"
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
              />
              <input
                value={form.buyer}
                onChange={(e) => setForm((f) => ({ ...f, buyer: e.target.value }))}
                placeholder="Buyer email"
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
              />
              <input
                value={form.method}
                onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
                placeholder="Method (Stripe/PayPal/Bank)"
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
              />
              <input
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                type="date"
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
              />
              <input
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                type="number"
                min="0"
                step="0.01"
                placeholder="Amount"
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
              />
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Order["status"] }))}
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                Save order
              </button>
              <button
                onClick={() => setForm({ id: "", item: "", buyer: "", amount: "", status: "Paid", date: "", method: "" })}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-white/5">
            {filtered.length === 0 ? (
              <div className="p-10 text-center text-white/60">No orders in this view. Add one above, or switch tabs.</div>
            ) : (
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
            )}
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

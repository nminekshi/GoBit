"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Box,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Database,
  FileText,
  Gauge,
  Grid,
  Lock,
  Menu,
  MessageSquare,
  PieChart,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  Wifi,
  XCircle,
} from "lucide-react";

// --- Mock data for demo ---
const MOCK_AUCTIONS = [
  { id: "A-4821", title: "Tesla Model S", status: "Live", bids: 38, watchers: 120, risk: "medium", category: "Vehicles" },
  { id: "E-9930", title: "iPhone 15 Pro", status: "Review", bids: 12, watchers: 80, risk: "high", category: "Electronics" },
  { id: "W-7312", title: "Rolex Submariner", status: "Live", bids: 22, watchers: 94, risk: "high", category: "Watches" },
  { id: "R-5502", title: "Rare Art Print", status: "Ended", bids: 9, watchers: 41, risk: "low", category: "Art" },
];

const MOCK_USERS = [
  { id: "user_842", role: "seller", kyc: true, disputes: 5, risk: "high" },
  { id: "dealer_hub_21", role: "seller", kyc: true, disputes: 2, risk: "medium" },
  { id: "bidder_302", role: "buyer", kyc: false, disputes: 0, risk: "low" },
];

const MOCK_LOGS = [
  { ts: "10:12", type: "error", message: "Fraud spike in Vehicles" },
  { ts: "09:55", type: "warn", message: "Webhook delay on /payments" },
  { ts: "09:40", type: "info", message: "Model retrain completed v4.3" },
];

const NAV_ITEMS = [
  { label: "Overview", icon: Grid, href: "/admin/dashboard" },
  { label: "Auctions", icon: Box, href: "/admin/auctions" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Orders & Payouts", icon: Wallet, href: "/admin/orders" },
  { label: "Real-time Bids", icon: Activity, href: "/admin/realtime" },
  { label: "Messages & Disputes", icon: MessageSquare, href: "/admin/messages" },
  { label: "Content Moderation", icon: FileText, href: "/admin/moderation" },
  { label: "Reports", icon: BarChart3, href: "/admin/reports" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
  { label: "Security", icon: ShieldCheck, href: "/admin/security" },
];

export default function AdminDashboard() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stats, setStats] = useState({
    activeAuctions: 0,
    usersOnline: 0,
    revenue: 0,
    aiAlerts: 9,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedAuctionsRaw = window.localStorage.getItem("global_auctions");
    const deletedAuctionsRaw = window.localStorage.getItem("deleted_auctions");
    let activeCount = 0;
    if (savedAuctionsRaw) {
      const saved = JSON.parse(savedAuctionsRaw);
      const deleted = new Set(deletedAuctionsRaw ? JSON.parse(deletedAuctionsRaw) : []);
      activeCount = saved.filter((a: any) => !deleted.has(a.id)).length;
    }
    setStats({
      activeAuctions: activeCount,
      usersOnline: 600 + Math.floor(Math.random() * 100),
      revenue: 80000 + activeCount * 120,
      aiAlerts: 9,
    });
  }, []);

  const riskCounts = useMemo(() => {
    return {
      high: MOCK_AUCTIONS.filter((a) => a.risk === "high").length,
      medium: MOCK_AUCTIONS.filter((a) => a.risk === "medium").length,
      low: MOCK_AUCTIONS.filter((a) => a.risk === "low").length,
    };
  }, []);

  return (
    <main className="relative flex min-h-screen w-full bg-[#050914] text-white">
      <div className={`sticky top-0 z-20 flex h-screen shrink-0 flex-col border-r border-white/10 bg-gradient-to-b from-[#0b1324] to-[#050914] p-3 transition-all duration-300 ${isCollapsed ? "w-20" : "w-72"}`}>
        <div className="flex items-center gap-2 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold">AD</div>
          <div className={`transition-all duration-200 ${isCollapsed ? "hidden" : "block"}`}>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Auction Admin</p>
            <p className="text-sm font-semibold">Control Center</p>
          </div>
          <button
            aria-label="Toggle sidebar"
            onClick={() => setIsCollapsed((p) => !p)}
            className="ml-auto rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:border-emerald-400/60"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto pb-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname?.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`group flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "border-emerald-400/60 bg-emerald-500/10 text-white shadow-[0_10px_30px_rgba(16,185,129,0.15)]"
                      : "border-white/10 text-white/70 hover:border-emerald-400/50 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {!isCollapsed && active && <ChevronRight className="ml-auto h-4 w-4 text-emerald-300" />}
                </div>
              </Link>
            );
          })}
        </div>

        <div className={`mt-auto space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3 ${isCollapsed ? "hidden" : "block"}`}>
          <p className="text-xs uppercase tracking-wide text-white/60">Role Access</p>
          <div className="mt-1 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
            <span>Super Admin</span>
            <CheckCircle className="h-4 w-4 text-emerald-300" />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
            <span>Ops Admin</span>
            <ShieldCheck className="h-4 w-4 text-blue-300" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
          {/* Header */}
          <header className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">Admin Dashboard</p>
              <h1 className="mt-1 text-4xl font-bold tracking-tight text-white">Platform Control</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/60">
                Monitor auctions, users, payouts, security, and live bidding from a single control plane.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/60">
                <Bell className="h-4 w-4" /> Alerts
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400">
                <FileText className="h-4 w-4" /> Export Report
              </button>
            </div>
          </header>

          {/* Top stats */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Gauge} label="Active auctions" value={stats.activeAuctions} trend="up" trendValue="12%" accent="emerald" />
            <StatCard icon={Users} label="Users online" value={stats.usersOnline} trend="up" trendValue="4%" accent="blue" />
            <StatCard icon={Wallet} label="Est. revenue" value={`$${stats.revenue.toLocaleString()}`} trend="up" trendValue="$12.4k" accent="purple" />
            <StatCard icon={AlertTriangle} label="AI alerts" value={stats.aiAlerts} trend="down" trendValue="-3" accent="amber" />
          </section>

          {/* Main grid */}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <section className="space-y-6">
              {/* Auction management */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Auction Management</h2>
                    <p className="text-sm text-white/60">Live, review, and ended auctions.</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:border-emerald-400/60">
                      Filter
                    </button>
                    <button className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-black hover:bg-emerald-400">
                      New auction
                    </button>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-[1.2fr_0.9fr_0.7fr_0.7fr_0.6fr_auto] items-center bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
                    <span>Auction</span>
                    <span>Status</span>
                    <span>Bids</span>
                    <span>Watchers</span>
                    <span>Risk</span>
                    <span className="text-right">Action</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {MOCK_AUCTIONS.map((a) => (
                      <div key={a.id} className="grid grid-cols-[1.2fr_0.9fr_0.7fr_0.7fr_0.6fr_auto] items-center px-4 py-3 text-sm hover:bg-white/5">
                        <div className="truncate text-white font-semibold">{a.id} · {a.title}</div>
                        <Badge tone={a.status === "Live" ? "emerald" : a.status === "Review" ? "amber" : "slate"} label={a.status} />
                        <span className="text-white/70">{a.bids}</span>
                        <span className="text-white/70">{a.watchers}</span>
                        <Badge tone={a.risk === "high" ? "rose" : a.risk === "medium" ? "amber" : "emerald"} label={a.risk} />
                        <div className="flex justify-end gap-2">
                          <button className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:border-emerald-400/60">View</button>
                          <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20">Moderate</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-time bids + moderation */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Real-time Bid Monitoring</h3>
                    <span className="text-xs text-white/60">Live feed</span>
                  </div>
                  <div className="mt-4 space-y-3 text-sm">
                    {["Tesla Model S", "Rolex Submariner", "iPhone 15 Pro"].map((item, idx) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5">
                        <span className="text-xs text-white/50">#{idx + 1}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{item}</p>
                          <p className="text-xs text-white/50">Bid just placed · +$50</p>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">Live</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Moderation Queue</h3>
                    <span className="text-xs text-white/60">4 waiting</span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    {[
                      { id: "BMW X5", reason: "Misleading desc", tone: "slate" },
                      { id: "QLED TV", reason: "Shipping issue", tone: "emerald" },
                      { id: "Art Print", reason: "IP Rights", tone: "rose" },
                    ].map((m) => (
                      <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5">
                        <div className="flex-1">
                          <p className="font-semibold text-white">{m.id}</p>
                          <p className="text-xs text-white/50">{m.reason}</p>
                        </div>
                        <Badge tone={m.tone as any} label="Review" />
                        <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20">Open</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Right column */}
            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Risk & Security</h3>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">Role: Super Admin</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                  <MiniStat label="High" value={riskCounts.high} tone="rose" />
                  <MiniStat label="Medium" value={riskCounts.medium} tone="amber" />
                  <MiniStat label="Low" value={riskCounts.low} tone="emerald" />
                </div>
                <div className="mt-4 space-y-2 text-sm text-white/70">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <Lock className="h-4 w-4 text-emerald-300" /> 2FA enforced for all admins
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <ShieldCheck className="h-4 w-4 text-blue-300" /> WAF active · OWASP ruleset
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <Database className="h-4 w-4 text-amber-300" /> Backups healthy · 12h
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">User Management</h3>
                  <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-300">3 High Risk</span>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  {MOCK_USERS.map((u) => (
                    <div key={u.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{u.id}</p>
                          <p className="text-xs text-white/50">Role: {u.role}</p>
                        </div>
                        <Badge tone={u.risk === "high" ? "rose" : u.risk === "medium" ? "amber" : "emerald"} label={u.risk} />
                      </div>
                      <div className="mt-2 flex gap-2 text-xs text-white/60">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1">{u.kyc ? "KYC verified" : "KYC pending"}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1">{u.disputes} disputes</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/80 hover:border-emerald-400/60">Review</button>
                        <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20">Restrict</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Live Logs</h3>
                  <button className="text-xs font-semibold text-emerald-300 hover:text-emerald-200">View full</button>
                </div>
                <div className="mt-3 space-y-3 text-sm">
                  {MOCK_LOGS.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                      <span className={`mt-1 h-2 w-2 rounded-full ${log.type === "error" ? "bg-rose-500" : log.type === "warn" ? "bg-amber-400" : "bg-emerald-400"}`}></span>
                      <div className="flex-1">
                        <p className="text-white">{log.message}</p>
                        <p className="text-xs text-white/50">{log.ts} · {log.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- UI helpers ---
function StatCard({ icon: Icon, label, value, trend, trendValue, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; trend: "up" | "down"; trendValue: string; accent: "emerald" | "blue" | "purple" | "amber" }) {
  const tone: Record<typeof accent, { bg: string; text: string; ring: string }> = {
    emerald: { bg: "from-emerald-500/25", text: "text-emerald-200", ring: "ring-emerald-400/30" },
    blue: { bg: "from-blue-500/25", text: "text-blue-200", ring: "ring-blue-400/30" },
    purple: { bg: "from-purple-500/25", text: "text-purple-200", ring: "ring-purple-400/30" },
    amber: { bg: "from-amber-500/25", text: "text-amber-200", ring: "ring-amber-400/30" },
  }[accent];

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 ring-1 ring-white/5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tone.bg} ${tone.ring}`}>
        <Icon className={`h-5 w-5 ${tone.text}`} />
      </div>
      <p className="mt-3 text-xs uppercase tracking-wide text-white/60">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      <p className={`text-xs font-semibold ${trend === "up" ? "text-emerald-300" : "text-rose-300"}`}>{trendValue}</p>
    </div>
  );
}

function Badge({ tone, label }: { tone: "emerald" | "amber" | "rose" | "slate"; label: string }) {
  const colors: Record<typeof tone, string> = {
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    amber: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    rose: "text-rose-300 bg-rose-500/10 border-rose-500/30",
    slate: "text-white/70 bg-white/5 border-white/10",
  };
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${colors[tone]}`}>{label}</span>;
}

function MiniStat({ label, value, tone }: { label: string; value: number; tone: "rose" | "amber" | "emerald" }) {
  const colors: Record<typeof tone, string> = {
    rose: "text-rose-300 bg-rose-500/10 border-rose-500/30",
    amber: "text-amber-200 bg-amber-500/10 border-amber-500/30",
    emerald: "text-emerald-200 bg-emerald-500/10 border-emerald-500/30",
  };
  return (
    <div className={`rounded-2xl border px-3 py-3 text-center ${colors[tone]}`}>
      <p className="text-xs uppercase tracking-wide text-white/70">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  Layers,
  LayoutDashboard,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Auctions", icon: Layers, href: "/admin/auctions" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Payouts", icon: Wallet, href: "/admin/orders" },
  { label: "Reports", icon: BarChart3, href: "/admin/reports" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
  { label: "Security", icon: ShieldCheck, href: "/admin/security" },
];

const KPI_CARDS = [
  { label: "Active auctions", value: 126, delta: "+12%", accent: "emerald", icon: Activity },
  { label: "GMV (24h)", value: "$842k", delta: "+6.1%", accent: "blue", icon: Wallet },
  { label: "New users", value: 384, delta: "+9%", accent: "purple", icon: Users },
  { label: "Disputes", value: 7, delta: "-2", accent: "amber", icon: ShieldCheck },
];

const LIVE_ACTIVITY = [
  { time: "10:12", message: "New bid $1,250 on Tesla Model S", tag: "Live" },
  { time: "10:08", message: "Payout initiated to seller_21 ($4,900)", tag: "Payout" },
  { time: "09:58", message: "2FA challenge passed by admin_lee", tag: "Security" },
  { time: "09:50", message: "New auction submitted: Vintage Omega", tag: "Review" },
];

const PENDING_APPROVALS = [
  { id: "A-9921", title: "Vintage Omega Seamaster", seller: "watch_vault", type: "Auction" },
  { id: "U-2204", title: "KYC verification", seller: "dealer_hub_21", type: "User" },
  { id: "A-4810", title: "Gaming PC Bundle", seller: "pixel_parts", type: "Auction" },
];

const RECENT_TRANSACTIONS = [
  { id: "TX-11820", item: "Rolex Submariner", amount: "$9,800", status: "Paid" },
  { id: "TX-11819", item: "MacBook Pro", amount: "$2,450", status: "Pending" },
  { id: "TX-11818", item: "Land Rover Evoque", amount: "$31,600", status: "Paid" },
  { id: "TX-11817", item: "Art Print #441", amount: "$640", status: "Refund" },
];

const NOTIFICATIONS = [
  { title: "Webhook latency warning", detail: "Payments endpoint 480ms", tone: "amber" },
  { title: "Model retrain completed", detail: "Fraud v4.3 live", tone: "emerald" },
  { title: "Chargeback raised", detail: "TX-11817 opened by bank", tone: "rose" },
];

export default function AdminDashboard() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeAuctions, setActiveAuctions] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedRaw = window.localStorage.getItem("global_auctions");
    const deletedRaw = window.localStorage.getItem("deleted_auctions");
    if (savedRaw) {
      const saved = JSON.parse(savedRaw);
      const deleted = new Set(deletedRaw ? JSON.parse(deletedRaw) : []);
      setActiveAuctions(saved.filter((a: any) => !deleted.has(a.id)).length);
    }
  }, []);

  const kpis = useMemo(() => {
    return KPI_CARDS.map((card) =>
      card.label === "Active auctions" ? { ...card, value: activeAuctions } : card
    );
  }, [activeAuctions]);

  return (
    <main className="relative flex min-h-screen items-start gap-6 bg-[#050915] px-4 py-6 text-white sm:px-6 lg:px-8">
      <aside
        className={`sticky top-0 z-20 flex min-h-[80vh] shrink-0 flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b1326] to-[#050915] p-3 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        <div className="flex items-center gap-2 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">ADM</div>
          {!isCollapsed && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">Admin</p>
              <p className="text-sm font-semibold">Overview</p>
            </div>
          )}
          <button
            aria-label="Toggle sidebar"
            onClick={() => setIsCollapsed((p) => !p)}
            className="ml-auto rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:border-emerald-400/60"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-3 overflow-y-auto pb-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname?.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-emerald-400/70 bg-emerald-500/10 text-white shadow-[0_10px_30px_rgba(16,185,129,0.15)]"
                      : "border-white/10 text-white/70 hover:border-emerald-400/50 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="mt-auto space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-white/60">Quick actions</p>
            <button className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-black hover:bg-emerald-400">
              Create auction
            </button>
            <button className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:border-emerald-400/60">
              Invite admin
            </button>
          </div>
        )}
      </aside>

      <section className="flex-1 w-full overflow-x-hidden">
        <div className="mx-auto flex w-full max-w-none flex-col gap-8 px-2 py-4 sm:px-4 lg:px-6">
          <header className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-400">Overview</p>
              <h1 className="mt-1 text-4xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/60">KPI pulse, analytics, live activity, approvals, and quick controls in one responsive view.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/60">
                <Bell className="h-4 w-4" /> Notifications
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400">
                <Zap className="h-4 w-4" /> Quick Action
              </button>
            </div>
          </header>

          <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((card) => (
              <KpiCard key={card.label} card={card} />
            ))}
          </section>

          <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <div className="space-y-6 w-full">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Revenue & Traffic</h2>
                  <span className="text-xs text-white/60">Last 7 days</span>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <SparkChart title="Revenue" values={[42, 68, 61, 74, 90, 85, 102]} accent="emerald" />
                  <SparkChart title="Sessions" values={[320, 344, 331, 362, 410, 398, 455]} accent="blue" />
                </div>
              </div>

              <div className="grid w-full gap-4 lg:grid-cols-2">
                <CardPanel title="Live Activity" actionLabel="View stream">
                  <ul className="space-y-3 text-sm">
                    {LIVE_ACTIVITY.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5">
                        <span className="text-xs text-white/50 w-12">{item.time}</span>
                        <div className="flex-1 text-white/90">{item.message}</div>
                        <Badge tone="emerald" label={item.tag} />
                      </li>
                    ))}
                  </ul>
                </CardPanel>

                <CardPanel title="Pending Approvals" actionLabel="Open queue">
                  <ul className="space-y-3 text-sm">
                    {PENDING_APPROVALS.map((p) => (
                      <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5">
                        <div className="flex-1">
                          <p className="font-semibold text-white">{p.id} · {p.title}</p>
                          <p className="text-xs text-white/60">Seller: {p.seller}</p>
                        </div>
                        <Badge tone="amber" label={p.type} />
                        <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20">Review</button>
                      </li>
                    ))}
                  </ul>
                </CardPanel>
              </div>

              <CardPanel title="Recent Transactions" actionLabel="View all">
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.7fr] items-center bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
                    <span>Txn</span>
                    <span>Item</span>
                    <span>Amount</span>
                    <span className="text-right">Status</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {RECENT_TRANSACTIONS.map((tx) => (
                      <div key={tx.id} className="grid grid-cols-[1.2fr_1fr_0.8fr_0.7fr] items-center px-4 py-3 text-sm hover:bg-white/5">
                        <span className="font-semibold text-white">{tx.id}</span>
                        <span className="text-white/80">{tx.item}</span>
                        <span className="text-white/80">{tx.amount}</span>
                        <div className="flex justify-end">
                          <Badge tone={tx.status === "Paid" ? "emerald" : tx.status === "Pending" ? "amber" : "rose"} label={tx.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardPanel>
            </div>

            <aside className="space-y-6 w-full">
              <CardPanel title="Notifications" actionLabel="Manage">
                <div className="space-y-3 text-sm">
                  {NOTIFICATIONS.map((n, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5">
                      <Bell className={`mt-0.5 h-4 w-4 ${toneIcon(n.tone)}`} />
                      <div>
                        <p className="font-semibold text-white">{n.title}</p>
                        <p className="text-xs text-white/60">{n.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardPanel>

              <CardPanel title="Quick Actions" actionLabel="All actions">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ActionButton label="Create auction" icon={Layers} />
                  <ActionButton label="Issue payout" icon={Wallet} />
                  <ActionButton label="Send notice" icon={Bell} />
                  <ActionButton label="Export report" icon={BarChart3} />
                </div>
              </CardPanel>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function KpiCard({ card }: { card: typeof KPI_CARDS[number] }) {
  const tones: Record<string, { bg: string; text: string }> = {
    emerald: { bg: "from-emerald-500/25", text: "text-emerald-200" },
    blue: { bg: "from-blue-500/25", text: "text-blue-200" },
    purple: { bg: "from-purple-500/25", text: "text-purple-200" },
    amber: { bg: "from-amber-500/25", text: "text-amber-200" },
  };
  const ToneIcon = card.icon;
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 ring-1 ring-white/5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tones[card.accent].bg}`}>
        <ToneIcon className={`h-5 w-5 ${tones[card.accent].text}`} />
      </div>
      <p className="mt-3 text-xs uppercase tracking-wide text-white/60">{card.label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{card.value}</p>
      <p className="text-xs font-semibold text-emerald-300">{card.delta}</p>
    </div>
  );
}

function SparkChart({ title, values, accent }: { title: string; values: number[]; accent: "emerald" | "blue" }) {
  const max = Math.max(...values);
  const tone = accent === "emerald" ? "bg-emerald-400" : "bg-blue-400";
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between text-sm text-white/80">
        <span>{title}</span>
        <span className="text-xs text-white/50">Sparkline</span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        {values.map((v, idx) => (
          <div
            key={idx}
            className={`w-full rounded-t-lg ${tone}`}
            style={{ height: `${(v / max) * 120 + 10}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function CardPanel({ title, actionLabel, children }: { title: string; actionLabel?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {actionLabel && <button className="text-xs font-semibold text-emerald-300 hover:text-emerald-200">{actionLabel}</button>}
      </div>
      {children}
    </div>
  );
}

function Badge({ tone, label }: { tone: "emerald" | "amber" | "rose" }) {
  const colors: Record<typeof tone, string> = {
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    amber: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    rose: "text-rose-300 bg-rose-500/10 border-rose-500/30",
  };
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${colors[tone]}`}>{label}</span>;
}

function ActionButton({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-semibold text-white hover:border-emerald-400/60">
      <Icon className="h-4 w-4 text-emerald-300" />
      <span>{label}</span>
    </button>
  );
}

function toneIcon(tone: string) {
  if (tone === "emerald") return "text-emerald-300";
  if (tone === "amber") return "text-amber-300";
  if (tone === "rose") return "text-rose-300";
  return "text-white";
}

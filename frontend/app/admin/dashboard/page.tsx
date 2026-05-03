"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { auctionAPI } from "../../lib/api";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Auctions", icon: Layers, href: "/admin/auctions" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Payouts", icon: Wallet, href: "/admin/orders" },
  { label: "Reports", icon: BarChart3, href: "/admin/reports" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
  { label: "Security", icon: ShieldCheck, href: "/admin/security" },
];

export default function AdminDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const goToCreateAuction = () => router.push("/seller/create-auction");
  const goToInviteAdmin = () => router.push("/admin/users");

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      try {
        const data = await auctionAPI.fetchDashboardStats();
        if (mounted) setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadStats();
    return () => { mounted = false; };
  }, []);

  const kpis = [
    { label: "Active auctions", value: stats?.activeAuctions || 0, delta: "Live Market", accent: "emerald", icon: Activity },
    { label: "GMV (Platform)", value: `LKR ${(stats?.gmv || 0).toLocaleString()}`, delta: "Total USD Flow", accent: "blue", icon: Wallet },
    { label: "Total users", value: stats?.totalUsers || 0, delta: "Registered", accent: "purple", icon: Users },
    { label: "ML Intercepts", value: stats?.totalIntercepts || 0, delta: "AI Interdictions", accent: "amber", icon: ShieldCheck },
  ] as const;

  const liveActivity = stats?.liveActivity || [];
  const pendingApprovals = stats?.pendingApprovals || [];
  const recentTransactions = stats?.recentTransactions || [];

  return (
    <main className="relative flex min-h-screen items-start gap-6 bg-[#050915] px-4 py-6 text-white sm:px-6 lg:px-8">
      <aside className={`sticky top-0 z-20 flex min-h-[80vh] shrink-0 flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b1326] to-[#050915] p-3 transition-all duration-300 ${isCollapsed ? "w-20" : "w-72"}`}>
         <div className="flex items-center gap-2 pb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">ADM</div>
          {!isCollapsed && (
            <div className="truncate">
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
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-semibold transition ${active
                    ? "border-emerald-400/70 bg-emerald-500/10 text-white shadow-[0_10px_30px_rgba(16,185,129,0.15)]"
                    : "border-white/10 text-white/70 hover:border-emerald-400/50 hover:text-white"
                    }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="mt-auto space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-white/60">Quick actions</p>
            <button onClick={goToCreateAuction} className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-black hover:bg-emerald-400">
              Create auction
            </button>
            <button onClick={goToInviteAdmin} className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:border-emerald-400/60">
              Invite admin
            </button>
          </div>
        )}
      </aside>

      <section className="flex-1 w-full overflow-x-hidden pt-2">
        <div className="mx-auto flex w-full max-w-none flex-col gap-8 px-2 sm:px-4 lg:px-6">
          <header className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-400">Overview</p>
              <h1 className="mt-1 text-4xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/60">Live MongoDB analytics, ML intercepts, and system pulse mapping.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin/security" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/60">
                <ShieldCheck className="h-4 w-4" /> Security Ops
              </Link>
              <Link href="/admin/reports" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400">
                <Zap className="h-4 w-4" /> Export Report
              </Link>
            </div>
          </header>

          <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((card) => (
              <KpiCard key={card.label} card={card} isLoading={isLoading} />
            ))}
          </section>

          {/* ── Analytics Charts ── */}
          <section className="grid w-full gap-6 lg:grid-cols-2">
            {/* Chart 1: Highest Volume Auctions */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
              <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-base font-bold text-white tracking-wide">Highest Volume Auctions</h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Live · MongoDB</span>
              </div>
              {isLoading ? (
                <div className="py-12 text-center text-white/50 text-sm">Loading chart data...</div>
              ) : (stats?.topAuctions || []).length > 0 ? (
                <div className="space-y-4">
                  {(stats.topAuctions as any[]).map((auction: any, idx: number) => {
                    const max = stats.topAuctions[0]?.value || 1;
                    const pct = Math.max((auction.value / max) * 100, 8);
                    const colors = [
                      "from-emerald-500 to-emerald-400",
                      "from-blue-500 to-blue-400",
                      "from-purple-500 to-purple-400",
                      "from-amber-500 to-amber-400",
                      "from-rose-500 to-rose-400",
                    ];
                    return (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-white/80 truncate max-w-[200px]">{auction.title}</span>
                          <span className="text-xs font-bold font-mono text-white">LKR {auction.value.toLocaleString()}</span>
                        </div>
                        <div className="h-5 w-full rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${colors[idx % colors.length]} transition-all duration-700 ease-out`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-white/50 text-sm italic">No auction volume data available.</div>
              )}
            </div>

            {/* Chart 2: ML Risk Score Distribution */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
              <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-base font-bold text-white tracking-wide">ML Risk Score Distribution</h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Isolation Forest</span>
              </div>
              {isLoading ? (
                <div className="py-12 text-center text-white/50 text-sm">Loading risk analysis...</div>
              ) : (stats?.riskDistribution || []).length > 0 ? (
                <div>
                  <div className="flex items-end gap-3 justify-between" style={{ height: "160px" }}>
                    {(stats.riskDistribution as any[]).map((bucket: any, idx: number) => {
                      const maxCount = Math.max(...stats.riskDistribution.map((b: any) => b.count), 1);
                      const heightPct = Math.max((bucket.count / maxCount) * 100, 6);
                      const barColors = [
                        "bg-emerald-400",
                        "bg-blue-400",
                        "bg-amber-400",
                        "bg-orange-400",
                        "bg-rose-500",
                      ];
                      const labelColors = [
                        "text-emerald-300",
                        "text-blue-300",
                        "text-amber-300",
                        "text-orange-300",
                        "text-rose-300",
                      ];
                      return (
                        <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                          <span className={`text-xs font-bold ${labelColors[idx]}`}>{bucket.count}</span>
                          <div className="w-full flex items-end justify-center" style={{ height: "120px" }}>
                            <div
                              className={`w-full max-w-[40px] rounded-t-lg ${barColors[idx]} transition-all duration-700 ease-out`}
                              style={{ height: `${heightPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 justify-between mt-3 border-t border-white/5 pt-3">
                    {(stats.riskDistribution as any[]).map((bucket: any, idx: number) => {
                      const riskLabels = ["Safe", "Low", "Medium", "High", "Critical"];
                      return (
                        <div key={idx} className="flex-1 text-center">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">{bucket.range}</p>
                          <p className="text-[9px] text-white/25 mt-0.5">{riskLabels[idx]}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-white/50 text-sm italic">No risk data available.</div>
              )}
            </div>
          </section>

          <div className="grid w-full gap-6 lg:grid-cols-3">
              <CardPanel title="Live Activity" actionLabel="View network" showAction={false}>
                {isLoading ? (
                  <div className="py-8 text-center text-white/50 text-sm">Loading activity stream...</div>
                ) : liveActivity.length > 0 ? (
                  <ul className="space-y-3 text-sm">
                    {liveActivity.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5">
                        <span className="text-xs text-white/50 w-12 pt-1">{item.time}</span>
                        <div className="flex-1 text-white/90">{item.message}</div>
                        <Badge tone={item.tag === "Security" ? "amber" : "emerald"} label={item.tag} />
                      </li>
                    ))}
                  </ul>
                ) : (
                   <div className="py-8 text-center text-white/50 text-sm italic border border-dashed border-white/5 rounded-2xl">No recent network activity.</div>
                )}
              </CardPanel>

              <CardPanel title="System Status" actionLabel="" showAction={false}>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm py-2.5 border-b border-white/10">
                    <span className="text-white/60">Node.js Main API</span>
                    <span className="text-emerald-400 font-semibold">Online</span>
                  </div>
                  <div className="flex justify-between text-sm py-2.5 border-b border-white/10">
                    <span className="text-white/60">MongoDB Cluster</span>
                    <span className="text-emerald-400 font-semibold">Connected</span>
                  </div>
                  <div className="flex justify-between text-sm py-2.5 border-b border-white/10">
                    <span className="text-white/60">WebSocket Feed</span>
                    <span className="text-emerald-400 font-semibold">Streaming</span>
                  </div>
                  <div className="flex justify-between text-sm py-2.5">
                    <span className="text-white/60">Python ML Engine</span>
                    <span className="text-emerald-400 font-semibold text-xs border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">Port 8000</span>
                  </div>
                </div>
              </CardPanel>

              <CardPanel title="Quick Actions" actionLabel="All actions" showAction={false}>
                <div className="grid gap-3 grid-cols-2">
                  <ActionButton label="Create auction" icon={Layers} onClick={goToCreateAuction} />
                  <ActionButton label="Manage users" icon={Users} onClick={goToInviteAdmin} />
                  <ActionButton label="Fraud alerts" icon={Bell} onClick={() => router.push('/admin/security/fraud')} />
                  <ActionButton label="View reports" icon={BarChart3} onClick={() => router.push('/admin/reports')} />
                </div>
              </CardPanel>
          </div>
        </div>
      </section>
    </main>
  );
}

function KpiCard({ card, isLoading }: { card: any, isLoading: boolean }) {
  const tones: Record<string, { bg: string; text: string }> = {
    emerald: { bg: "from-emerald-500/25", text: "text-emerald-200" },
    blue: { bg: "from-blue-500/25", text: "text-blue-200" },
    purple: { bg: "from-purple-500/25", text: "text-purple-200" },
    amber: { bg: "from-amber-500/25", text: "text-amber-200" },
  };
  const ToneIcon = card.icon;
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 ring-1 ring-white/5 transition-all hover:bg-white/5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tones[card.accent].bg}`}>
        <ToneIcon className={`h-5 w-5 ${tones[card.accent].text}`} />
      </div>
      <p className="mt-3 text-xs uppercase tracking-wide text-white/60">{card.label}</p>
      <p className="mt-1 text-2xl font-bold text-white tracking-tight">
          {isLoading ? <span className="text-white/20 animate-pulse">...</span> : card.value}
      </p>
      <p className="text-[10px] uppercase font-bold text-white/40 mt-1">{card.delta}</p>
    </div>
  );
}

function CardPanel({ title, actionLabel, showAction = true, children }: { title: string; actionLabel?: string; showAction?: boolean, children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
      <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-base font-bold text-white tracking-wide">{title}</h3>
        {showAction && actionLabel && <button className="text-xs font-semibold text-emerald-300 hover:text-emerald-200">{actionLabel}</button>}
      </div>
      {children}
    </div>
  );
}

function Badge({ tone, label }: { tone: "emerald" | "amber" | "rose"; label: string }) {
  const colors: Record<typeof tone, string> = {
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    amber: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    rose: "text-rose-300 bg-rose-500/10 border-rose-500/30",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors[tone]}`}>{label}</span>;
}

function ActionButton({ label, icon: Icon, onClick }: { label: string; icon: React.ComponentType<{ className?: string }>; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-white hover:border-emerald-400/60 hover:bg-white/5 transition-all text-center"
    >
      <Icon className="h-6 w-6 text-emerald-300" />
      <span className="text-[11px] uppercase tracking-wider opacity-80">{label}</span>
    </button>
  );
}

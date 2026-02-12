"use client";

import React, { useState } from "react";
import { Activity, AlertTriangle, FileDown, KeyRound, Lock, Server, ShieldCheck } from "lucide-react";

const ACCESS_CONTROLS = [
  { label: "Enforce 2FA for admins", detail: "OTP required for every admin login", on: true, updated: "14m ago" },
  { label: "Restrict new IPs until verified", detail: "Block first-time IPs until approved", on: true, updated: "32m ago" },
  { label: "Session timeout (30m)", detail: "Expire idle sessions after 30 minutes", on: false, updated: "2h ago" },
  { label: "API key rotation alerts", detail: "Notify on key creation or rotation", on: true, updated: "58m ago" },
];

const AUDIT_LOGS = [
  { actor: "admin_lee", action: "Enabled", target: "2FA enforcement", time: "2026-02-07 10:42 UTC", status: "Success" },
  { actor: "system", action: "Rotated", target: "API keys (payments)", time: "2026-02-07 09:18 UTC", status: "Success" },
  { actor: "ops_admin", action: "Exported", target: "Payout ledger", time: "2026-02-07 08:54 UTC", status: "Success" },
  { actor: "audit_bot", action: "Flagged", target: "Unusual login velocity", time: "2026-02-07 08:11 UTC", status: "Review" },
];

const POSTURE_POINTS = [
  { label: "WAF active (OWASP ruleset)", tone: "good", meta: "ShieldCloud · live" },
  { label: "Backups healthy", tone: "good", meta: "Multi-region · 2h ago" },
  { label: "Webhooks latency watch", tone: "warn", meta: "p95 620ms" },
  { label: "Incident response ready", tone: "good", meta: "On-call · 24/7" },
];

const SUMMARY = [
  { label: "Posture", value: "Secure", sub: "No critical alerts", icon: ShieldCheck, tone: "good" },
  { label: "24h incidents", value: "0", sub: "All mitigated", icon: AlertTriangle, tone: "good" },
  { label: "Last backup", value: "2h ago", sub: "Multi-region verified", icon: Server, tone: "neutral" },
];

export default function AdminSecurityPage() {
  const [accessControls, setAccessControls] = useState(ACCESS_CONTROLS);

  const handleToggle = (label: string) => {
    setAccessControls((prev) => prev.map((item) => (item.label === label ? { ...item, on: !item.on } : item)));
  };

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-none space-y-6">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Admin</p>
          <h1 className="text-3xl font-bold">Security</h1>
          <p className="text-sm text-white/60">Modern posture overview, access controls, and audit visibility.</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUMMARY.map((item) => (
            <div key={item.label} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-200">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  {item.label}
                  <StatusPill status={item.tone === "good" ? "Healthy" : item.tone === "warn" ? "Attention" : "Info"} />
                </div>
                <p className="text-lg font-semibold text-white">{item.value}</p>
                <p className="text-xs text-white/60">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <Card title="Security Posture" icon={<ShieldCheck className="h-5 w-5 text-emerald-300" />}>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/60">
                <span>Last scan 14 minutes ago</span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-200">Continuous</span>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                {POSTURE_POINTS.map((item) => (
                  <li key={item.label} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 px-3 py-2">
                    <StatusDot tone={item.tone} />
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{item.label}</span>
                      <span className="text-xs text-white/60">{item.meta}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Access Controls" icon={<Lock className="h-5 w-5 text-emerald-300" />}>
              <div className="space-y-3 text-sm text-white/80">
                {accessControls.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{item.label}</span>
                      <span className="text-xs text-white/60">{item.detail}</span>
                      <span className="mt-1 text-[11px] text-white/50">Updated {item.updated}</span>
                    </div>
                    <Toggle on={item.on} onToggle={() => handleToggle(item.label)} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card title="Audit Trail" icon={<KeyRound className="h-5 w-5 text-emerald-300" />}>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-200">Tamper-evident</span>
                <span className="rounded-full bg-white/10 px-3 py-1">UTC timestamps</span>
                <span className="rounded-full bg-white/10 px-3 py-1">IP + device fingerprint</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/80">
                {AUDIT_LOGS.map((item) => (
                  <div key={`${item.actor}-${item.time}`} className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/25 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-emerald-300" />
                      <div className="flex flex-col">
                        <span className="text-white">{item.actor} {item.action}</span>
                        <span className="text-xs text-white/60">{item.target}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <span>{item.time}</span>
                      <StatusPill status={item.status} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-200">
                  <FileDown className="h-4 w-4" /> Export CSV
                </button>
                <button className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-200">
                  <FileDown className="h-4 w-4" /> Download PDF
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center gap-2 text-white">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-4 flex-1">{children}</div>
    </div>
  );
}

function Toggle({ on, onToggle }: { on?: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={`relative h-7 w-12 rounded-full border transition ${
        on ? "border-emerald-400/60 bg-emerald-500/30" : "border-white/20 bg-white/10"
      }`}
    >
      <span
        className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition ${
          on ? "right-[4px]" : "left-[4px]"
        }`}
      />
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone = status === "Success" || status === "Healthy" ? "bg-emerald-500/15 text-emerald-200" : status === "Review" || status === "Attention" ? "bg-amber-500/15 text-amber-200" : "bg-blue-500/15 text-blue-200";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{status}</span>;
}

function StatusDot({ tone }: { tone: "good" | "warn" }) {
  const bg = tone === "good" ? "bg-emerald-400" : "bg-amber-400";
  return <span className={`mt-1 h-2.5 w-2.5 rounded-full ${bg}`} />;
}

"use client";

import React from "react";
import { User, Bell, Lock, Palette, CheckCircle2, Smartphone, Globe2, Shield } from "lucide-react";

const NOTIFICATIONS = [
  { title: "Bid status", desc: "Alerts when you are outbid or win", enabled: true },
  { title: "Payment receipts", desc: "Email receipts for deposits and holds", enabled: true },
  { title: "Recommendations", desc: "Weekly picks based on watchlist", enabled: false },
];

export default function BuyerSettingsPage() {
  return (
    <main className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Buyer</p>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-sm text-white/60">Profile, preferences, and security controls aligned with the buyer dashboard style.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card title="Profile" icon={<User className="h-5 w-5 text-emerald-300" />}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full name" value="Alex Morgan" />
              <Field label="Email" value="alex.morgan@example.com" />
              <Field label="Phone" value="+1 (555) 210-8899" />
              <Field label="Location" value="New York, USA" />
            </div>
            <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border hover:border-emerald-300/60">
              Save profile
            </button>
          </Card>

          <Card title="Appearance" icon={<Palette className="h-5 w-5 text-emerald-300" />}>
            <div className="flex flex-wrap gap-3">
              {["System", "Light", "Dark"]
                .map((mode) => (
                  <button key={mode} className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${mode === "Dark" ? "border-emerald-400/60 bg-white/5 text-white" : "border-white/10 bg-black/20 text-white/80 hover:border-emerald-300/60 hover:text-white"}`}>
                    {mode}
                  </button>
                ))}
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-white/70">
              <Palette className="h-4 w-4 text-emerald-300" />
              <span>Matches the modern buyer dashboard visuals.</span>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card title="Security" icon={<Lock className="h-5 w-5 text-emerald-300" />}>
            <div className="space-y-3 text-sm text-white/80">
              <Toggle label="Two-factor authentication" enabled />
              <Toggle label="Biometric unlock (mobile)" enabled />
              <Toggle label="Trusted devices" enabled />
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Last login</p>
                <p className="text-sm font-semibold text-white">Feb 7, 2026 — 11:42 UTC</p>
                <p className="text-xs text-white/60">Mac • Safari • NYC</p>
              </div>
            </div>
          </Card>

          <Card title="Notifications" icon={<Bell className="h-5 w-5 text-emerald-300" />}>
            <div className="space-y-3">
              {NOTIFICATIONS.map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-white/60">{item.desc}</p>
                  </div>
                  <ToggleSwitch enabled={item.enabled} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card title="Devices" icon={<Smartphone className="h-5 w-5 text-emerald-300" />}>
            <div className="space-y-3 text-sm text-white/80">
              {[{ name: "iPhone 15 Pro", last: "Today • 09:12", status: "Active" }, { name: "MacBook Pro", last: "Yesterday • 22:05", status: "Trusted" }].map((d) => (
                <div key={d.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">{d.name}</p>
                    <p className="text-xs text-white/60">{d.last}</p>
                  </div>
                  <StatusPill label={d.status} />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Localization" icon={<Globe2 className="h-5 w-5 text-emerald-300" />}>
            <div className="space-y-3 text-sm text-white/80">
              <Field label="Language" value="English (US)" />
              <Field label="Time zone" value="UTC -05:00" />
              <Field label="Currency" value="USD ($)" />
              <button className="w-full rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border hover:border-emerald-300/60">
                Save localization
              </button>
            </div>
          </Card>
        </div>

        <Card title="Privacy" icon={<Shield className="h-5 w-5 text-emerald-300" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Hide username on bids", "Mask phone from sellers", "Anonymize analytics", "Share watchlist with team"].map((pref) => (
              <div key={pref} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>{pref}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border hover:border-emerald-300/60">
            Review privacy controls
          </button>
        </Card>
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
      <div className="mt-4 flex-1 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-xs uppercase tracking-[0.18em] text-white/50">{label}</span>
      <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 font-semibold text-white">{value}</div>
    </label>
  );
}

function Toggle({ label, enabled }: { label: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-sm text-white">{label}</span>
      <ToggleSwitch enabled={enabled} />
    </div>
  );
}

function ToggleSwitch({ enabled }: { enabled?: boolean }) {
  return (
    <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${enabled ? "bg-emerald-500" : "bg-white/20"}`}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${enabled ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );
}

function StatusPill({ label }: { label: string }) {
  return <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">{label}</span>;
}

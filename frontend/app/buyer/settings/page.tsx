"use client";

import React, { useEffect, useState } from "react";
import { User, Bell, Lock, Palette, CheckCircle2, Smartphone, Globe2, Shield } from "lucide-react";

const NOTIFICATIONS = [
  { title: "Bid status", desc: "Alerts when you are outbid or win", enabled: true },
  { title: "Payment receipts", desc: "Email receipts for deposits and holds", enabled: true },
  { title: "Recommendations", desc: "Weekly picks based on watchlist", enabled: false },
];

type ThemeChoice = "system" | "light" | "dark";

const APPEARANCE_MODES: { label: string; value: ThemeChoice }[] = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export default function BuyerSettingsPage() {
  const [theme, setTheme] = useState<ThemeChoice>("system");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("buyer-theme");
    if (saved === "light" || saved === "dark" || saved === "system") {
      setTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme("system");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    applyTheme(theme);
    window.localStorage.setItem("buyer-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  return (
    <main className="theme-page min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-none space-y-8">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Buyer</p>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-sm text-theme-muted">Profile, preferences, and security controls aligned with the buyer dashboard style.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card title="Profile" icon={<User className="h-5 w-5 text-emerald-300" />}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full name" value="Alex Morgan" />
              <Field label="Email" value="alex.morgan@example.com" />
              <Field label="Phone" value="+1 (555) 210-8899" />
              <Field label="Location" value="New York, USA" />
            </div>
            <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">
              Save profile
            </button>
          </Card>

          <Card title="Appearance" icon={<Palette className="h-5 w-5 text-emerald-300" />}>
            <div className="flex flex-wrap gap-3">
              {APPEARANCE_MODES.map((mode) => {
                const isActive = theme === mode.value;
                return (
                  <button
                    key={mode.value}
                    onClick={() => setTheme(mode.value)}
                    className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-emerald-400/60 bg-[var(--card-bg)] text-theme-strong shadow-[0_10px_30px_rgba(16,185,129,0.15)]"
                        : "border-[color:var(--card-border)] bg-[var(--card-bg)] text-theme-muted hover:border-emerald-300/60 hover:text-theme-strong"
                    }`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-theme-muted">
              <Palette className="h-4 w-4 text-emerald-300" />
              <span>Matches the modern buyer dashboard visuals; uses System, Light, or Dark.</span>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card title="Security" icon={<Lock className="h-5 w-5 text-emerald-300" />}>
            <div className="space-y-3 text-sm text-theme-muted">
              <Toggle label="Two-factor authentication" enabled />
              <Toggle label="Biometric unlock (mobile)" enabled />
              <Toggle label="Trusted devices" enabled />
              <div className="rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-theme-muted">Last login</p>
                <p className="text-sm font-semibold text-theme-strong">Feb 7, 2026 — 11:42 UTC</p>
                <p className="text-xs text-theme-muted">Mac • Safari • NYC</p>
              </div>
            </div>
          </Card>

          <Card title="Notifications" icon={<Bell className="h-5 w-5 text-emerald-300" />}>
            <div className="space-y-3">
              {NOTIFICATIONS.map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] px-4 py-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-theme-strong">{item.title}</p>
                    <p className="text-xs text-theme-muted">{item.desc}</p>
                  </div>
                  <ToggleSwitch enabled={item.enabled} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-1">
          <Card title="Localization" icon={<Globe2 className="h-5 w-5 text-emerald-300" />}>
            <div className="space-y-3 text-sm text-theme-muted">
              <Field label="Language" value="English (US)" />
              <Field label="Time zone" value="UTC -05:00" />
              <Field label="Currency" value="USD ($)" />
              <button className="w-full rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">Save localization</button>
            </div>
          </Card>
        </div>

        <Card title="Privacy" icon={<Shield className="h-5 w-5 text-emerald-300" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Hide username on bids", "Mask phone from sellers", "Anonymize analytics", "Share watchlist with team"].map((pref) => (
              <div key={pref} className="flex items-center gap-2 rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm text-theme-muted">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>{pref}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">
            Review privacy controls
          </button>
        </Card>
      </div>
    </main>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="theme-card rounded-3xl p-5 shadow-lg shadow-black/20">
      <div className="flex items-center gap-2 text-theme-strong">
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
      <span className="text-xs uppercase tracking-[0.18em] text-theme-muted">{label}</span>
      <div className="rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] px-3 py-2 font-semibold text-theme-strong">{value}</div>
    </label>
  );
}

function Toggle({ label, enabled }: { label: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] px-4 py-3">
      <span className="text-sm text-theme-strong">{label}</span>
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

function applyTheme(choice: ThemeChoice) {
  if (typeof window === "undefined") return;
  const resolved = choice === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : choice;

  document.documentElement.dataset.theme = resolved;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
  if (document.body) {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(resolved === "dark" ? "theme-dark" : "theme-light");
  }
}

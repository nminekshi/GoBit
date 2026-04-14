"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Settings, ShieldCheck, Bell, Lock, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

const STORAGE_KEY = "gobit_admin_settings";

const DEFAULT_PLATFORM = [
  { label: "Maintenance mode notifications", on: true, hint: "Alert admins before downtime" },
  { label: "Auto-archive ended auctions", on: false, hint: "Move ended listings to cold storage" },
];

const DEFAULT_NOTIFICATIONS = [
  { label: "Alerts for high-risk auctions", on: true, hint: "Flag anomalies from the fraud model" },
  { label: "Weekly performance summary", on: false, hint: "Email KPIs every Monday" },
  { label: "Payout settlement updates", on: true, hint: "Notify when payouts are initiated" },
];

const DEFAULT_SECURITY = [
  { label: "Enforce 2FA for admins", on: true, hint: "Require OTP for all admin logins" },
  { label: "Restrict new IPs until verified", on: true, hint: "Hold sessions until IP trusted" },
  { label: "Session timeout (30m)", on: false, hint: "Shorten if you need higher security" },
];

const COMPLIANCE_BADGES = [
  { label: "GDPR", status: "Compliant" },
  { label: "KYC", status: "Required" },
  { label: "AML", status: "Monitored" },
  { label: "PCI", status: "Compliant" },
];

type ToggleItem = { label: string; on: boolean; hint: string };

export default function AdminSettingsPage() {
  const [platform, setPlatform] = useState<ToggleItem[]>(DEFAULT_PLATFORM);
  const [notifications, setNotifications] = useState<ToggleItem[]>(DEFAULT_NOTIFICATIONS);
  const [security, setSecurity] = useState<ToggleItem[]>(DEFAULT_SECURITY);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Load persisted settings from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.platform) setPlatform(parsed.platform);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.security) setSecurity(parsed.security);
      }
    } catch (e) {
      console.warn("Could not load settings:", e);
    }
    setLoaded(true);
  }, []);

  const handleToggle = useCallback((groupSetter: React.Dispatch<React.SetStateAction<ToggleItem[]>>, label: string) => {
    groupSetter((prev) => prev.map((item) => (item.label === label ? { ...item, on: !item.on } : item)));
    setDirty(true);
    setSaved(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Simulate small network delay
    await new Promise((r) => setTimeout(r, 800));

    const payload = { platform, notifications, security, savedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    console.log("Admin settings persisted:", payload);

    setSaving(false);
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 4000);
  };

  const handleReset = () => {
    setPlatform(DEFAULT_PLATFORM);
    setNotifications(DEFAULT_NOTIFICATIONS);
    setSecurity(DEFAULT_SECURITY);
    localStorage.removeItem(STORAGE_KEY);
    setDirty(false);
    setSaved(false);
  };

  // Count how many toggles are currently ON
  const enabledCount = [...platform, ...notifications, ...security].filter(t => t.on).length;
  const totalCount = [...platform, ...notifications, ...security].length;

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-8 text-white sm:px-6 lg:px-10">
      {/* Success Toast */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-[#0b1326] px-5 py-3 shadow-2xl shadow-emerald-500/10 animate-in slide-in-from-top">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-sm font-bold text-white">Settings Saved Successfully</p>
            <p className="text-[11px] text-white/50">Configuration persisted to local storage.</p>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-none space-y-6">
        <header className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-400">Admin</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Settings</h1>
            <p className="mt-2 text-sm text-white/60">Configure platform preferences, notifications, security, and compliance.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
              <p className="text-lg font-bold text-emerald-400">{enabledCount}<span className="text-white/30">/{totalCount}</span></p>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Active Rules</p>
            </div>
          </div>
        </header>

        {!loaded ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : (
          <>
            <div className="grid w-full gap-5 md:grid-cols-2">
              <SettingsCard title="Platform" icon={<Settings className="h-5 w-5 text-emerald-300" />}>
                <div className="space-y-3">
                  {platform.map((item) => (
                    <ToggleRow
                      key={item.label}
                      label={item.label}
                      hint={item.hint}
                      on={item.on}
                      onToggle={() => handleToggle(setPlatform, item.label)}
                    />
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Notifications" icon={<Bell className="h-5 w-5 text-emerald-300" />}>
                <div className="space-y-3">
                  {notifications.map((item) => (
                    <ToggleRow
                      key={item.label}
                      label={item.label}
                      hint={item.hint}
                      on={item.on}
                      onToggle={() => handleToggle(setNotifications, item.label)}
                    />
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Security" icon={<Lock className="h-5 w-5 text-emerald-300" />}>
                <div className="space-y-3">
                  {security.map((item) => (
                    <ToggleRow
                      key={item.label}
                      label={item.label}
                      hint={item.hint}
                      on={item.on}
                      onToggle={() => handleToggle(setSecurity, item.label)}
                    />
                  ))}
                  {security.find(s => s.label === "Enforce 2FA for admins")?.on && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                      <ShieldCheck className="h-4 w-4" /> 2FA enforced for admins
                    </div>
                  )}
                </div>
              </SettingsCard>

              <SettingsCard title="Compliance" icon={<ShieldCheck className="h-5 w-5 text-emerald-300" />}>
                <p className="text-sm text-white/70">Review policy links and audit requirements.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {COMPLIANCE_BADGES.map((badge) => (
                    <span
                      key={badge.label}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white"
                    >
                      {badge.label}
                      <StatusPill status={badge.status} />
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80">
                  <AlertTriangle className="h-4 w-4 text-amber-300" />
                  Keep policy docs current and export audit trails monthly.
                </div>
              </SettingsCard>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-5">
              <button
                onClick={handleReset}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 hover:text-white hover:border-rose-400/40 transition-colors"
              >
                Reset to Defaults
              </button>

              <button
                onClick={handleSave}
                disabled={saving || (!dirty && !saved)}
                className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold shadow-lg transition-all ${
                  saved
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/10"
                    : saving
                      ? "bg-white/5 text-white/50 cursor-not-allowed border border-white/5"
                      : dirty
                        ? "bg-emerald-500 text-black shadow-emerald-500/25 hover:bg-emerald-400 border border-emerald-400"
                        : "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed"
                }`}
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                ) : saved ? (
                  <><CheckCircle2 className="h-4 w-4" /> Saved</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4" /> Save Changes</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function SettingsCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
      <div className="flex items-center gap-2 text-white">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-4 flex-1">{children}</div>
    </div>
  );
}

function ToggleRow({ label, hint, on, onToggle }: { label: string; hint?: string; on?: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{label}</p>
        {hint && <p className="text-xs text-white/60">{hint}</p>}
      </div>
      <Toggle on={on} onToggle={onToggle} />
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
        on
          ? "border-emerald-400/60 bg-emerald-500/30"
          : "border-white/20 bg-white/10"
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
  const tone = status === "Compliant" ? "bg-emerald-500/15 text-emerald-200" : status === "Required" ? "bg-amber-500/15 text-amber-200" : "bg-blue-500/15 text-blue-200";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{status}</span>;
}

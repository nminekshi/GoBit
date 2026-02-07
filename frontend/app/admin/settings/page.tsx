"use client";

import React, { useState } from "react";
import { Settings, ShieldCheck, Bell, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";

const PLATFORM_TOGGLES = [
  { label: "Maintenance mode notifications", on: true, hint: "Alert admins before downtime" },
  { label: "Auto-archive ended auctions", on: false, hint: "Move ended listings to cold storage" },
];

const NOTIFICATION_TOGGLES = [
  { label: "Alerts for high-risk auctions", on: true, hint: "Flag anomalies from the fraud model" },
  { label: "Weekly performance summary", on: false, hint: "Email KPIs every Monday" },
  { label: "Payout settlement updates", on: true, hint: "Notify when payouts are initiated" },
];

const SECURITY_TOGGLES = [
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

export default function AdminSettingsPage() {
  const [platform, setPlatform] = useState(PLATFORM_TOGGLES);
  const [notifications, setNotifications] = useState(NOTIFICATION_TOGGLES);
  const [security, setSecurity] = useState(SECURITY_TOGGLES);

  const handleToggle = (groupSetter: React.Dispatch<React.SetStateAction<typeof PLATFORM_TOGGLES>>, label: string) => {
    groupSetter((prev) => prev.map((item) => (item.label === label ? { ...item, on: !item.on } : item)));
  };

  const handleSave = () => {
    const payload = {
      platform,
      notifications,
      security,
    };
    console.log("Admin settings saved", payload);
    alert("Settings saved (demo). Wire this to your API.");
  };

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-none space-y-6">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Admin</p>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-sm text-white/60">Configure platform preferences, notifications, security, and compliance.</p>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 text-sm font-semibold text-white/70">
            <span className="rounded-xl bg-emerald-500/15 px-3 py-1 text-emerald-200">Platform</span>
            <span className="rounded-xl bg-white/5 px-3 py-1">Notifications</span>
            <span className="rounded-xl bg-white/5 px-3 py-1">Security</span>
            <span className="rounded-xl bg-white/5 px-3 py-1">Compliance</span>
          </div>
        </header>

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
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                <ShieldCheck className="h-4 w-4" /> 2FA enforced for admins
              </div>
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

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
          >
            <CheckCircle2 className="h-4 w-4" /> Save Changes
          </button>
        </div>
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

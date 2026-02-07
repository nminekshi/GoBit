"use client";

import React, { useState } from "react";
import { Bell, Globe, Lock, Save, ShieldCheck, User, Wallet } from "lucide-react";

const TABS = ["Profile", "Payouts", "Notifications", "Security"] as const;
type Tab = (typeof TABS)[number];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");

  return (
    <main className="min-h-screen w-full bg-[#050914] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="flex w-full flex-col gap-6 min-h-[85vh]">
        <header className="flex flex-wrap items-center gap-3 justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Seller</p>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-sm text-white/60">Manage your profile, payout accounts, alerts, and security.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">
            <Save className="h-4 w-4" /> Save changes
          </button>
        </header>

        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab ? "bg-emerald-500 text-black" : "text-white/70 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Profile" && <ProfilePanel />}
        {activeTab === "Payouts" && <PayoutPanel />}
        {activeTab === "Notifications" && <NotificationsPanel />}
        {activeTab === "Security" && <SecurityPanel />}
      </div>
    </main>
  );
}

function PanelShell({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-center gap-2 text-white">
        <Icon className="h-5 w-5 text-emerald-300" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ProfilePanel() {
  return (
    <PanelShell title="Profile" icon={User}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Display name" placeholder="Your store name" defaultValue="Hasara" />
        <Field label="Contact email" placeholder="you@brand.com" defaultValue="seller@example.com" />
        <Field label="Phone" placeholder="(+1) 555-1234" defaultValue="(+94) 777-123-456" />
        <Field label="Location" placeholder="City, Country" defaultValue="Colombo, LK" />
      </div>
      <Field label="About" placeholder="Short bio" defaultValue="Trusted seller specializing in premium electronics and collectibles." multiline />
    </PanelShell>
  );
}

function PayoutPanel() {
  return (
    <PanelShell title="Payouts" icon={Wallet}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Bank name" placeholder="Bank" defaultValue="First Global Bank" />
        <Field label="Account number" placeholder="XXXX" defaultValue="**** 4587" />
        <Field label="Routing / Swift" placeholder="Swift" defaultValue="FGHILKLX" />
        <Field label="Currency" placeholder="USD" defaultValue="USD" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/70">
        <Badge icon={Globe} text="Multi-currency enabled" />
        <Badge icon={ShieldCheck} text="2FA required for changes" />
      </div>
    </PanelShell>
  );
}

function NotificationsPanel() {
  const rows = [
    { label: "New bids", desc: "Alert when someone bids on your listing", defaultOn: true },
    { label: "Messages", desc: "Direct messages from buyers", defaultOn: true },
    { label: "Payouts", desc: "Payout initiated or delayed", defaultOn: true },
    { label: "Price watch", desc: "When watchlisted items get bids", defaultOn: false },
  ];
  return (
    <PanelShell title="Notifications" icon={Bell}>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">{row.label}</p>
              <p className="text-xs text-white/60">{row.desc}</p>
            </div>
            <Toggle defaultOn={row.defaultOn} />
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

function SecurityPanel() {
  return (
    <PanelShell title="Security" icon={Lock}>
      <div className="space-y-3">
        <SecurityRow label="Two-factor authentication" desc="Protect payouts and login changes" />
        <SecurityRow label="Login alerts" desc="Notify on new device sign-ins" />
        <SecurityRow label="Session timeout" desc="Auto-signout after 30 minutes idle" />
      </div>
    </PanelShell>
  );
}

function SecurityRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/60">{desc}</p>
      </div>
      <Toggle defaultOn={true} />
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(Boolean(defaultOn));
  return (
    <button
      onClick={() => setOn((p) => !p)}
      className={`relative h-7 w-12 rounded-full border transition ${
        on ? "border-emerald-400 bg-emerald-500/30" : "border-white/15 bg-white/5"
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${on ? "left-5" : "left-0.5"}`}
      />
    </button>
  );
}

function Field({ label, placeholder, defaultValue, multiline }: { label: string; placeholder: string; defaultValue?: string; multiline?: boolean }) {
  return (
    <label className="block space-y-1 text-sm text-white/70">
      <span className="text-xs uppercase tracking-wide text-white/50">{label}</span>
      {multiline ? (
        <textarea
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/60 focus:outline-none"
        />
      ) : (
        <input
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/60 focus:outline-none"
        />
      )}
    </label>
  );
}

function Badge({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
      <Icon className="h-4 w-4 text-emerald-300" /> {text}
    </span>
  );
}

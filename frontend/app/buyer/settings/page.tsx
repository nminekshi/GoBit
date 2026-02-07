"use client";

import React, { useEffect, useRef, useState } from "react";
import { User, Bell, Lock, Palette, CheckCircle2, Globe2, Shield, LogOut, KeyRound } from "lucide-react";

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
  const [profileName, setProfileName] = useState("Alex Morgan");
  const [profileEmail, setProfileEmail] = useState("alex.morgan@example.com");
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [draftName, setDraftName] = useState(profileName);
  const [draftEmail, setDraftEmail] = useState(profileEmail);
  const [draftAvatar, setDraftAvatar] = useState<string | null>(null);

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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setProfileAvatar(result);
        setDraftAvatar(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  const openProfileModal = () => {
    setDraftName(profileName);
    setDraftEmail(profileEmail);
    setDraftAvatar(profileAvatar);
    setIsProfileModalOpen(true);
  };

  const handleProfileSave = () => {
    setProfileName(draftName.trim() || "Seller");
    setProfileEmail(draftEmail.trim() || profileEmail);
    if (draftAvatar) setProfileAvatar(draftAvatar);
    setIsProfileModalOpen(false);
  };

  return (
    <main className="theme-page min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-none space-y-8">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Buyer</p>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-sm text-theme-muted">Profile, preferences, and security controls aligned with the buyer dashboard style.</p>
        </header>

        <div className="space-y-6">
          <div className="flex flex-col gap-6 rounded-3xl border border-[color:var(--card-border)] bg-[var(--card-bg)] p-6 shadow-lg shadow-black/20 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-400 bg-black/40 text-3xl font-bold text-white">
                {profileAvatar ? (
                  <img src={profileAvatar} alt="Profile" className="h-full w-full rounded-full object-cover" />
                ) : (
                  profileName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-theme-strong">{profileName}</h2>
                <p className="text-theme-muted">{profileEmail}</p>
                <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">Seller</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <button
                onClick={openProfileModal}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
              >
                <User className="h-4 w-4" /> Edit Profile
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Personal Information" icon={<User className="h-5 w-5 text-emerald-300" />}>
              <div className="grid gap-3">
                <ReadOnlyField label="Full Name" value={profileName} />
                <ReadOnlyField label="Email Address" value={profileEmail} />
              </div>
            </Card>

            <Card title="Account Settings" icon={<Lock className="h-5 w-5 text-emerald-300" />}>
              <div className="space-y-3 text-theme-strong">
                <button className="flex w-full items-center justify-between rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-left text-sm font-semibold transition hover:border-emerald-400/60">
                  <span className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-theme-muted" /> Change Password</span>
                  <span className="text-theme-muted">••••••</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:border-red-400/60">
                  <span className="flex items-center gap-2"><LogOut className="h-4 w-4" /> Sign Out</span>
                  <span className="text-red-300">→</span>
                </button>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
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

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-xl rounded-3xl border border-[color:var(--card-border)] bg-[#1a1f2b] p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold">Edit Profile</h3>
                <p className="mt-1 text-sm text-theme-muted">Update your name, email, and profile photo.</p>
              </div>
              <button
                aria-label="Close"
                onClick={() => setIsProfileModalOpen(false)}
                className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block space-y-2 text-sm font-semibold text-white/80">
                <span>Name</span>
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-emerald-500/40 focus:ring"
                  placeholder="Your name"
                />
              </label>

              <div className="space-y-2 text-sm font-semibold text-white/80">
                <span>Profile Picture</span>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    {draftAvatar || profileAvatar ? (
                      <img src={draftAvatar || profileAvatar || ""} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-white/60">No photo</span>
                    )}
                  </div>
                  <label className="flex-1 cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white/80 transition hover:border-emerald-400/60 hover:text-white">
                    Upload New Photo
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => {
                        const result = ev.target?.result;
                        if (typeof result === "string") setDraftAvatar(result);
                      };
                      reader.readAsDataURL(file);
                    }} className="hidden" />
                  </label>
                </div>
              </div>

              <label className="block space-y-2 text-sm font-semibold text-white/80">
                <span>Email</span>
                <input
                  value={draftEmail}
                  onChange={(e) => setDraftEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-emerald-500/40 focus:ring"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <button
              onClick={handleProfileSave}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
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

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 text-sm">
      <span className="text-xs uppercase tracking-[0.18em] text-theme-muted">{label}</span>
      <div className="rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] px-3 py-3 text-base font-semibold text-theme-strong">
        {value}
      </div>
    </div>
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

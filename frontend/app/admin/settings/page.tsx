"use client";

import { Settings, ShieldCheck, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-[#050915] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-none space-y-6">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Admin</p>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-sm text-white/60">Platform preferences, notifications, and compliance.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
            <div className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5 text-emerald-300" />
              <h3 className="text-lg font-semibold">Platform</h3>
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/80">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" defaultChecked />
                Maintenance mode notifications
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" />
                Auto-archive ended auctions
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
            <div className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5 text-emerald-300" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/80">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" defaultChecked />
                Alerts for high-risk auctions
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" />
                Weekly performance summary
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <h3 className="text-lg font-semibold">Compliance</h3>
            </div>
            <p className="mt-3 text-sm text-white/70">Review policy links and audit requirements.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-emerald-300">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-400/30">GDPR</span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-400/30">KYC</span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-400/30">AML</span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-400/30">PCI</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

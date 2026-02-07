"use client";

import { ShieldCheck, Lock, KeyRound, Activity } from "lucide-react";

export default function AdminSecurityPage() {
  return (
    <main className="min-h-screen bg-[#050915] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Admin</p>
          <h1 className="text-3xl font-bold">Security</h1>
          <p className="text-sm text-white/60">Access control, session policy, and audit posture.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <h3 className="text-lg font-semibold">Posture</h3>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> WAF active · OWASP ruleset</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Backups healthy · 12h</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-400" /> Webhooks latency watch</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
            <div className="flex items-center gap-2 text-white">
              <Lock className="h-5 w-5 text-emerald-300" />
              <h3 className="text-lg font-semibold">Access</h3>
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/80">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" defaultChecked />
                Enforce 2FA for admins
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" defaultChecked />
                Restrict new IPs until verified
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" />
                Session timeout 30 minutes
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <KeyRound className="h-5 w-5 text-emerald-300" />
              <h3 className="text-lg font-semibold">Audit Trail</h3>
            </div>
            <div className="mt-4 space-y-2 text-sm text-white/80">
              {[
                "admin_lee enabled 2FA enforcement",
                "system rotated API keys",
                "ops_admin exported payout report",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                  <Activity className="h-4 w-4 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

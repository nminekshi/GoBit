"use client";

import { Users, ShieldCheck, Ban, Search } from "lucide-react";

export default function AdminUsersPage() {
  const users = [
    { id: "user_842", role: "seller", kyc: true, disputes: 5, status: "High risk" },
    { id: "dealer_hub_21", role: "seller", kyc: true, disputes: 2, status: "Monitor" },
    { id: "bidder_302", role: "buyer", kyc: false, disputes: 0, status: "Normal" },
  ];

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-none space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Admin</p>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-sm text-white/60">KYC status, disputes, and quick actions.</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/60">
              <Search className="h-4 w-4" /> Search
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400">
              <Users className="h-4 w-4" /> Invite user
            </button>
          </div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[1.2fr_0.9fr_0.8fr_0.8fr_auto] items-center bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
              <span>User</span>
              <span>Role</span>
              <span>KYC</span>
              <span>Disputes</span>
              <span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-white/5">
              {users.map((u) => (
                <div key={u.id} className="grid grid-cols-[1.2fr_0.9fr_0.8fr_0.8fr_auto] items-center px-4 py-3 text-sm hover:bg-white/5">
                  <div className="font-semibold text-white">{u.id}</div>
                  <div className="text-white/80 capitalize">{u.role}</div>
                  <div className="text-white/80">{u.kyc ? "Verified" : "Pending"}</div>
                  <div className="text-white/80">{u.disputes}</div>
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:border-emerald-400/60">
                      Review
                    </button>
                    <button className="rounded-lg bg-rose-500/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500">
                      <Ban className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            2FA enforced for admins · WAF active
          </div>
        </div>
      </div>
    </main>
  );
}

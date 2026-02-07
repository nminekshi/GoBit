"use client";

import { useEffect, useState } from "react";
import { Users, ShieldCheck, Ban, Search, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type AdminUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  mobile?: string;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const rawAuth = typeof window !== "undefined" ? window.localStorage.getItem("auth") : null;
        const parsed = rawAuth ? JSON.parse(rawAuth) : null;
        const token = parsed?.token;

        if (!token) {
          setError("Please login as an admin to view users.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.message || "Failed to fetch users");
          setLoading(false);
          return;
        }

        const mapped = Array.isArray(data?.users)
          ? data.users.map((u: any) => ({
              id: u._id || u.id,
              username: u.username,
              email: u.email,
              role: u.role,
              mobile: u.mobile,
              createdAt: u.createdAt,
            }))
          : [];

        setUsers(mapped);
        setError(null);
      } catch (err) {
        console.error("Error loading users", err);
        setError("Unable to load users right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (value?: string) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleDateString();
    } catch (e) {
      return value;
    }
  };

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-none space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Admin</p>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-sm text-white/60">Live user list pulled from the backend.</p>
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
            <div className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.9fr_auto] items-center bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Joined</span>
              <span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-white/5">
              {loading ? (
                <div className="flex items-center gap-2 px-4 py-6 text-sm text-white/80">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-300" /> Loading users...
                </div>
              ) : error ? (
                <div className="px-4 py-6 text-sm text-rose-300">{error}</div>
              ) : users.length === 0 ? (
                <div className="px-4 py-6 text-sm text-white/70">No users found.</div>
              ) : (
                users.map((u) => (
                  <div key={u.id} className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.9fr_auto] items-center px-4 py-3 text-sm hover:bg-white/5">
                    <div className="font-semibold text-white">{u.username}</div>
                    <div className="text-white/80 truncate" title={u.email}>{u.email}</div>
                    <div className="text-white/80 capitalize">{u.role}</div>
                    <div className="text-white/80">{formatDate(u.createdAt)}</div>
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:border-emerald-400/60">
                        Review
                      </button>
                      <button className="rounded-lg bg-rose-500/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500">
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
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

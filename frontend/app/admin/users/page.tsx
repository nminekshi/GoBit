"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, ShieldCheck, Ban, Search, Loader2, X } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type AdminUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  mobile?: string;
  createdAt?: string;
};

type BackendUser = {
  _id?: string;
  id?: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ username: "", email: "", mobile: "", role: "buyer", password: "" });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [banLoadingId, setBanLoadingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const parseJsonSafe = async (res: Response): Promise<unknown> => {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      return { message: text || "Unexpected response from server" };
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
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

      const data = (await parseJsonSafe(res)) as { users?: BackendUser[]; message?: string };

      if (!res.ok) {
        setError(data?.message || "Failed to fetch users");
        setUsers([]);
        setLoading(false);
        return;
      }

      const mapped = Array.isArray(data?.users)
        ? data.users.map((u) => ({
            id: u._id || u.id || "",
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
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const formatDate = (value?: string) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleDateString();
    } catch (e) {
      return value;
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const q = searchTerm.toLowerCase();
    return users.filter((u) =>
      [u.username, u.email, u.role].some((field) => field?.toLowerCase().includes(q))
    );
  }, [users, searchTerm]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);

    if (!inviteForm.username || !inviteForm.email || !inviteForm.password) {
      setInviteError("Username, email, and password are required.");
      return;
    }

    try {
      setInviteLoading(true);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: inviteForm.username,
          email: inviteForm.email,
          mobile: inviteForm.mobile,
          password: inviteForm.password,
          role: inviteForm.role,
        }),
      });

      const data = (await parseJsonSafe(res)) as { message?: string };
      if (!res.ok) {
        setInviteError(data?.message || "Failed to invite user.");
        return;
      }

      setInviteSuccess("User invited successfully.");
      setInviteForm({ username: "", email: "", mobile: "", role: "buyer", password: "" });
      await fetchUsers();
    } catch (err) {
      console.error("Error inviting user", err);
      setInviteError("Unable to invite user right now.");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleBan = async (user: AdminUser) => {
    const confirm = window.confirm(`Delete user ${user.username}? This cannot be undone.`);
    if (!confirm) return;
    try {
      setBanLoadingId(user.id);
      setActionMessage(null);
      setError(null);
      const rawAuth = typeof window !== "undefined" ? window.localStorage.getItem("auth") : null;
      const parsed = rawAuth ? JSON.parse(rawAuth) : null;
      const token = parsed?.token;

      if (!token) {
        setError("Please login as an admin to manage users.");
        return;
      }

      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) {
        setError(data?.message || "Failed to delete user");
        setActionMessage(null);
        return;
      }
      setError(null);
      setActionMessage("User deleted.");
      await fetchUsers();
    } catch (err) {
      console.error("Error deleting user", err);
      setError("Unable to delete user right now.");
    } finally {
      setBanLoadingId(null);
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white w-full sm:w-72">
              <Search className="h-4 w-4 text-white/60" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by user, email, or role"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
              />
            </div>
            <div className="flex gap-2 self-end sm:self-auto">
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/60"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" /> Clear
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
                onClick={() => setShowInvite(true)}
              >
                <Users className="h-4 w-4" /> Invite user
              </button>
            </div>
          </div>
        </header>

        {actionMessage && <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{actionMessage}</div>}

        {showInvite && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Invite a new user</p>
                <p className="text-xs text-white/60">Creates the account via the backend register endpoint.</p>
              </div>
              <button
                aria-label="Close invite"
                onClick={() => {
                  setShowInvite(false);
                  setInviteError(null);
                  setInviteSuccess(null);
                }}
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:border-emerald-400/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={handleInvite}>
              <input
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-emerald-400/60 focus:outline-none"
                placeholder="Username"
                value={inviteForm.username}
                onChange={(e) => setInviteForm((f) => ({ ...f, username: e.target.value }))}
              />
              <input
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-emerald-400/60 focus:outline-none"
                placeholder="Email"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
              />
              <input
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-emerald-400/60 focus:outline-none"
                placeholder="Mobile (optional)"
                value={inviteForm.mobile}
                onChange={(e) => setInviteForm((f) => ({ ...f, mobile: e.target.value }))}
              />
              <input
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-emerald-400/60 focus:outline-none"
                placeholder="Temporary password"
                type="text"
                value={inviteForm.password}
                onChange={(e) => setInviteForm((f) => ({ ...f, password: e.target.value }))}
              />
              <select
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-emerald-400/60 focus:outline-none"
                value={inviteForm.role}
                onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value }))}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:border-emerald-400/60"
                  onClick={() => {
                    setInviteForm({ username: "", email: "", mobile: "", role: "buyer", password: "" });
                    setInviteError(null);
                    setInviteSuccess(null);
                  }}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-60"
                >
                  {inviteLoading && <Loader2 className="h-4 w-4 animate-spin" />} Invite
                </button>
              </div>
            </form>
            {inviteError && <p className="mt-2 text-sm text-rose-300">{inviteError}</p>}
            {inviteSuccess && <p className="mt-2 text-sm text-emerald-300">{inviteSuccess}</p>}
          </div>
        )}

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
              ) : filteredUsers.length === 0 ? (
                <div className="px-4 py-6 text-sm text-white/70">No users found.</div>
              ) : (
                filteredUsers.map((u) => (
                  <div key={u.id} className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.9fr_auto] items-center px-4 py-3 text-sm hover:bg-white/5">
                    <div className="font-semibold text-white">{u.username}</div>
                    <div className="text-white/80 truncate" title={u.email}>{u.email}</div>
                    <div className="text-white/80 capitalize">{u.role}</div>
                    <div className="text-white/80">{formatDate(u.createdAt)}</div>
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:border-emerald-400/60"
                        onClick={() => {
                          setSelectedUser(u);
                          setShowReview(true);
                        }}
                      >
                        Review
                      </button>
                      <button
                        className="rounded-lg bg-rose-500/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-60"
                        onClick={() => handleBan(u)}
                        disabled={banLoadingId === u.id}
                      >
                        {banLoadingId === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
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

      {showReview && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1326] p-6 text-white shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">User</p>
                <h2 className="text-xl font-bold">{selectedUser.username}</h2>
              </div>
              <button
                onClick={() => setShowReview(false)}
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:border-emerald-400/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-white/80">
              <div className="flex justify-between"><span>Email</span><span className="text-white">{selectedUser.email}</span></div>
              <div className="flex justify-between"><span>Role</span><span className="capitalize text-white">{selectedUser.role}</span></div>
              <div className="flex justify-between"><span>Mobile</span><span className="text-white">{selectedUser.mobile || "-"}</span></div>
              <div className="flex justify-between"><span>Joined</span><span className="text-white">{formatDate(selectedUser.createdAt)}</span></div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/60"
                onClick={() => setShowReview(false)}
              >
                Close
              </button>
              <button
                className="rounded-lg bg-rose-500/80 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-60"
                onClick={() => {
                  setShowReview(false);
                  handleBan(selectedUser);
                }}
                disabled={banLoadingId === selectedUser.id}
              >
                {banLoadingId === selectedUser.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete user"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

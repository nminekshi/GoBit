"use client";
import { useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to send reset email");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#040918] via-[#101827] to-[#1e293b] px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-700/70 shadow-2xl shadow-slate-900/60 p-8 backdrop-blur">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-sm text-slate-300">
            Enter the email linked to your account and we'll send you a reset link.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-emerald-400 mb-1">Email Sent!</h3>
                <p className="text-sm text-slate-300">
                  If an account with that email exists, a password reset link has been sent.
                  Please check your inbox and spam folder.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
                <p className="text-sm text-rose-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-emerald-500 text-slate-950 text-sm md:text-base rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Remember your password?{" "}
            <Link href="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>

        {success && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setSuccess(false)}
              className="text-sm text-emerald-400 font-semibold hover:text-emerald-300 hover:underline"
            >
              Send another reset link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

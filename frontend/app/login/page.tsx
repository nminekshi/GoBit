
"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#040918] via-[#101827] to-[#1e293b] px-4">
    <div className="w-full max-w-sm rounded-2xl bg-slate-900/90 border border-slate-700/70 shadow-2xl shadow-slate-900/60 p-8 flex flex-col items-center backdrop-blur">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Log in</h1>
      <p className="text-sm text-slate-300 mb-8 text-center">
        Access your account to bid, watch items, and manage your details.
      </p>
      <form className="w-full flex flex-col gap-5">
          <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
            className="w-full rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              autoComplete="username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            placeholder="Enter your username"
            />
          </div>
          <div className="relative">
          <label className="block text-sm font-semibold text-slate-200 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
            className="w-full rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-2.5 pr-10 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Enter your password"
            />
            <button
              type="button"
              tabIndex={-1}
            className="absolute right-3 bottom-2.5 text-lg text-slate-300 hover:text-white"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.664-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 2.21-.715 4.25-1.92 5.92M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.21 2.21A9.956 9.956 0 0021 12c0-5.523-4.477-10-10-10S1 6.477 1 12c0 2.21.715 4.25 1.92 5.92M4.22 4.22l15.56 15.56" /></svg>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between mt-1 mb-2">
            <label className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
              <input type="checkbox" className="form-checkbox rounded border-slate-500 accent-emerald-500" />
              Remember me
            </label>
            <Link href="/forget-password" className="text-xs md:text-sm text-emerald-400 font-semibold hover:text-emerald-300 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="mx-auto mt-3 px-8 py-3 bg-emerald-500 text-slate-950 text-sm md:text-base rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

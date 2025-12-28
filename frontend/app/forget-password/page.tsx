"use client";
import { useState } from "react";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#040918] via-[#101827] to-[#1e293b] px-4">
    <div className="w-full max-w-sm rounded-2xl bg-slate-900/90 border border-slate-700/70 shadow-2xl shadow-slate-900/60 p-8 flex flex-col items-center backdrop-blur">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
        Reset password
      </h1>
      <p className="text-sm text-slate-300 mb-8 text-center">
        Enter the email linked to your account and we’ll send you a reset link.
      </p>
      <form className="w-full flex flex-col gap-5">
          <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              autoComplete="email"
              required
            placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
          className="mx-auto mt-3 px-8 py-3 bg-emerald-500 text-slate-950 text-sm md:text-base rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-colors"
          >
          Send reset link
          </button>
        </form>
      </div>
    </div>
  );
}

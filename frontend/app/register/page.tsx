"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#040918] via-[#101827] to-[#1e293b] px-4">
       <div className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-700/70 shadow-2xl shadow-slate-900/60 p-8 flex flex-col items-center backdrop-blur">
         <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
           Create your account
         </h1>
         <p className="text-sm text-slate-300 mb-8 text-center">
           Join to bid on auctions, watch items, and manage your profile in one place.
         </p>
         <form className="w-full flex flex-col gap-5">
          <div>
             <label className="block text-sm font-semibold text-slate-200 mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
               className="w-full rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoComplete="username"
              placeholder="Enter a name others will see"
            />
          </div>
          <div>
             <label className="block text-sm font-semibold text-slate-200 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
               className="w-full rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div>
             <label className="block text-sm font-semibold text-slate-200 mb-1" htmlFor="mobile">
              Mobile number
            </label>
            <input
              id="mobile"
              type="tel"
               className="w-full rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              value={form.mobile}
              onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
              autoComplete="tel"
              placeholder="Phone number for updates"
            />
          </div>
          <div>
             <label className="block text-sm font-semibold text-slate-200 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
               className="w-full rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="new-password"
              placeholder="Create a strong password"
            />
          </div>
          <div>
             <label className="block text-sm font-semibold text-slate-200 mb-1" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
               className="w-full rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              autoComplete="new-password"
              placeholder="Type the password again"
            />
          </div>
          <button
            type="submit"
             className="mx-auto mt-2 px-8 py-3 bg-emerald-500 text-slate-950 text-sm md:text-base rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-colors"
          >
            Register
          </button>
           <p className="mt-4 text-xs text-slate-400 text-center max-w-xs mx-auto">
             By registering you agree to our terms and basic policies.
          </p>
        </form>
      </div>
    </div>
  );
}

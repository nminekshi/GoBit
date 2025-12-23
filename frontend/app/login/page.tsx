
"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#182430]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">Log In</h1>
        <form className="w-full flex flex-col gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-500 mb-2" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="w-full rounded-lg bg-[#efeaea] px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              autoComplete="username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            />
          </div>
          <div className="relative">
            <label className="block text-lg font-semibold text-gray-500 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg bg-[#efeaea] px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black pr-10"
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 bottom-3 text-lg text-gray-700 hover:text-black"
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
          <div className="flex items-center justify-between mt-1 mb-4">
            <label className="flex items-center gap-2 text-base text-gray-600">
              <input type="checkbox" className="form-checkbox rounded border-gray-400" />
              Remember me
            </label>
            <Link href="/forget-password" className="text-base text-gray-600 font-semibold hover:underline">Forget Password?</Link>
          </div>
          <button
            type="submit"
            className="mx-auto mt-4 px-8 py-3 bg-black text-white text-lg rounded-xl font-medium shadow hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#182430]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-8 text-center">Welcome</h1>
        <form className="w-full flex flex-col gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-500 mb-2" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="w-full rounded-lg bg-[#efeaea] px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-500 mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg bg-[#efeaea] px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-500 mb-2" htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              className="w-full rounded-lg bg-[#efeaea] px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.mobile}
              onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
              autoComplete="tel"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-500 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg bg-[#efeaea] px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-500 mb-2" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full rounded-lg bg-[#efeaea] px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="mx-auto mt-4 px-8 py-3 bg-black text-white text-lg rounded-xl font-medium shadow hover:bg-gray-900 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

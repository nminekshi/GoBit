"use client";
import { useState } from "react";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">Forget Password</h1>
        <form className="w-full flex flex-col gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-500 mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg bg-[#efeaea] px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              autoComplete="email"
              required
            />
          </div>
          <button
            type="submit"
            className="mx-auto mt-4 px-8 py-3 bg-black text-white text-lg rounded-xl font-medium shadow hover:bg-gray-900 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

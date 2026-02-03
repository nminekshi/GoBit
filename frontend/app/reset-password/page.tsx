"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.newPassword !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (form.newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (!token) {
            setError("Invalid or missing reset token");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: form.newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.message || "Failed to reset password");
                setLoading(false);
                return;
            }

            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#040918] via-[#101827] to-[#1e293b] px-4">
                <div className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-700/70 shadow-2xl shadow-slate-900/60 p-8 backdrop-blur">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 text-emerald-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
                        <p className="text-slate-300 mb-6">
                            Your password has been reset successfully. You can now login with your new password.
                        </p>
                        <p className="text-sm text-slate-400">Redirecting to login page...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#040918] via-[#101827] to-[#1e293b] px-4">
            <div className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-700/70 shadow-2xl shadow-slate-900/60 p-8 backdrop-blur">
                <div className="text-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Set New Password</h1>
                    <p className="text-sm text-slate-300">
                        Enter your new password below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <label className="block text-sm font-semibold text-slate-200 mb-1" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-2.5 pr-10 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                            value={form.newPassword}
                            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                            placeholder="Enter new password"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            className="absolute right-3 bottom-2.5 text-slate-300 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.664-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 2.21-.715 4.25-1.92 5.92M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-semibold text-slate-200 mb-1" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            className="w-full rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-2.5 pr-10 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            className="absolute right-3 bottom-2.5 text-slate-300 hover:text-white"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.664-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 2.21-.715 4.25-1.92 5.92M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
                            <p className="text-sm text-rose-400">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full px-8 py-3 bg-emerald-500 text-slate-950 text-sm md:text-base rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Resetting Password..." : "Reset Password"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm text-emerald-400 font-semibold hover:text-emerald-300 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#040918] via-[#101827] to-[#1e293b]">
                <div className="text-white">Loading...</div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}

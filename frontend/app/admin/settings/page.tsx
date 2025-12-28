import React from "react";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900 text-xl lg:px-12">
      <div className="mx-auto flex w-full max-w-full flex-col gap-8">
        {/* Header */}
        <header className="border-b border-slate-200 pb-4">
          <p className="text-2xl font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Admin settings
          </p>
          <h1 className="mt-1 text-5xl font-semibold tracking-tight md:text-6xl">
            Control panel
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Update how the platform behaves for everyone: basic details, security
            rules, notifications, and AI fraud preferences. All fields here are
            static examples you can connect to your backend later.
          </p>
        </header>

        <section className="space-y-8">
          {/* General settings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-3xl font-semibold text-slate-900">General</h2>
            <p className="mt-2 text-lg text-slate-500">
              Basic information about your marketplace.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-lg font-semibold text-slate-700" htmlFor="platformName">
                  Platform name
                </label>
                <input
                  id="platformName"
                  type="text"
                  defaultValue="GoBit Auctions"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl text-slate-900 outline-none focus:border-emerald-500"
                  readOnly
                />
                <p className="text-base text-slate-500">
                  Example only · wire this to your settings API.
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-lg font-semibold text-slate-700" htmlFor="supportEmail">
                  Support email
                </label>
                <input
                  id="supportEmail"
                  type="email"
                  defaultValue="support@gobit.example"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl text-slate-900 outline-none focus:border-emerald-500"
                  readOnly
                />
                <p className="text-base text-slate-500">
                  Where users can reach your team.
                </p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-3xl font-semibold text-slate-900">Notifications</h2>
            <p className="mt-2 text-lg text-slate-500">
              Choose which events should generate admin alerts.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4" readOnly />
                <div>
                  <p className="text-xl font-semibold text-slate-900">New high‑value auction</p>
                  <p className="text-lg text-slate-600">
                    Alert admins when a lot is created above a set threshold.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4" readOnly />
                <div>
                  <p className="text-xl font-semibold text-slate-900">Chargeback or dispute</p>
                  <p className="text-lg text-slate-600">
                    Send a notification whenever a payment is disputed.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4" readOnly />
                <div>
                  <p className="text-xl font-semibold text-slate-900">Critical system error</p>
                  <p className="text-lg text-slate-600">
                    For example failed webhooks or downtime on payment APIs.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <input type="checkbox" className="mt-1 h-4 w-4" readOnly />
                <div>
                  <p className="text-xl font-semibold text-slate-900">Weekly summary email</p>
                  <p className="text-lg text-slate-600">
                    Snapshot of revenue, active users, and AI alerts.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-3xl font-semibold text-slate-900">Security</h2>
            <p className="mt-2 text-lg text-slate-500">
              High‑level security and access rules for admins.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xl font-semibold text-slate-900">Require 2FA for admins</p>
                <p className="text-lg text-slate-600">
                  Strongly recommended so only verified devices can access this area.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-base font-semibold text-emerald-700">
                  Enabled (example)
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-semibold text-slate-900">Session timeout</p>
                <p className="text-lg text-slate-600">
                  How long admins can stay signed in without any activity.
                </p>
                <p className="mt-3 inline-flex rounded-full bg-slate-50 px-4 py-2 text-base font-semibold text-slate-800">
                  30 minutes (sample)
                </p>
              </div>
            </div>
          </div>

          {/* AI & fraud settings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-3xl font-semibold text-slate-900">AI & fraud</h2>
            <p className="mt-2 text-lg text-slate-500">
              Control how strict the AI fraud model and price predictions should be.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xl font-semibold text-slate-900">Fraud sensitivity</p>
                <p className="text-lg text-slate-600">
                  Higher sensitivity catches more fraud but may flag more good users.
                </p>
                <p className="mt-3 inline-flex rounded-full bg-amber-50 px-4 py-2 text-base font-semibold text-amber-700">
                  Medium (sample)
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-semibold text-slate-900">Price suggestion range</p>
                <p className="text-lg text-slate-600">
                  How far AI is allowed to move from recent sale prices.
                </p>
                <p className="mt-3 inline-flex rounded-full bg-slate-50 px-4 py-2 text-base font-semibold text-slate-800">
                  ±10% from market (sample)
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-end border-t border-slate-200 pt-6">
          <button
            className="rounded-xl bg-slate-900 px-6 py-3 text-xl font-semibold text-white opacity-60"
            disabled
          >
            Save changes (demo only)
          </button>
        </footer>
      </div>
    </main>
  );
}

"use client";

import React from "react";
import { CreditCard, Wallet, ShieldCheck, RefreshCw, ArrowUpRight, CheckCircle2, Plus } from "lucide-react";

const TRANSACTIONS = [
  { id: "TX-98211", label: "Deposit", amount: "+$500", status: "Settled", time: "2026-02-06 14:20 UTC" },
  { id: "TX-98205", label: "Bid hold", amount: "-$320", status: "On hold", time: "2026-02-05 19:08 UTC" },
  { id: "TX-98192", label: "Release", amount: "+$320", status: "Settled", time: "2026-02-05 20:31 UTC" },
  { id: "TX-98170", label: "Card auth", amount: "-$50", status: "Pending", time: "2026-02-04 09:44 UTC" },
];

export default function BuyerPaymentsPage() {
  return (
    <main className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-none space-y-8">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Buyer</p>
          <h1 className="text-3xl font-bold">Payments & Wallet</h1>
          <p className="text-sm text-white/60">Manage funding sources, deposits, and recent payment events.</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard icon={<Wallet className="h-5 w-5 text-emerald-300" />} label="Wallet balance" value="$1,240" sub="Available for bids" tone="good" />
          <SummaryCard icon={<ShieldCheck className="h-5 w-5 text-emerald-300" />} label="Escrow holds" value="$320" sub="Pending releases" tone="warn" />
          <SummaryCard icon={<RefreshCw className="h-5 w-5 text-emerald-300" />} label="Last sync" value="2m ago" sub="Status: healthy" tone="good" />
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <Card title="Payment Methods" icon={<CreditCard className="h-5 w-5 text-emerald-300" />}>
              <div className="space-y-3">
                {[{ brand: "Visa •••• 4242", tag: "Primary", expires: "08/28" }, { brand: "Mastercard •••• 7711", tag: "Backup", expires: "03/27" }].map((m) => (
                  <div key={m.brand} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">{m.brand}</p>
                      <p className="text-xs text-white/60">Expires {m.expires}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">{m.tag}</span>
                  </div>
                ))}
                <button className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-dashed border-emerald-400/50 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300 hover:text-white">
                  <Plus className="h-4 w-4" /> Add payment method
                </button>
              </div>
            </Card>

            <Card title="Transactions" icon={<ArrowUpRight className="h-5 w-5 text-emerald-300" />}>
              <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/20">
                {TRANSACTIONS.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 text-sm sm:grid-cols-[1fr_auto_auto_auto]">
                    <div className="space-y-1">
                      <p className="font-semibold text-white">{tx.label}</p>
                      <p className="text-xs text-white/60">{tx.id}</p>
                    </div>
                    <span className={`text-sm font-semibold ${tx.amount.startsWith("-") ? "text-rose-300" : "text-emerald-300"}`}>{tx.amount}</span>
                    <StatusPill status={tx.status} />
                    <span className="hidden text-xs text-white/60 sm:block">{tx.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Billing & Limits" icon={<ShieldCheck className="h-5 w-5 text-emerald-300" />}>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  <span>Monthly deposit limit</span>
                  <span className="font-semibold text-white">$10,000</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  <span>Escrow releases</span>
                  <span className="text-emerald-300">Auto after win</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  <span>2FA for payments</span>
                  <span className="text-emerald-300">Enabled</span>
                </div>
                <button className="w-full rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border hover:border-emerald-300/60">
                  Update billing details
                </button>
              </div>
            </Card>

            <Card title="Trust & Safety" icon={<ShieldCheck className="h-5 w-5 text-emerald-300" />}>
              <div className="flex flex-col gap-3 text-sm text-white/80">
                {["Secure escrow for wins", "Fraud checks on every payment", "Refunds follow policy", "24/7 monitoring"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center gap-2 text-white">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-4 flex-1 space-y-3">{children}</div>
    </div>
  );
}

function SummaryCard({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string; sub: string; tone: "good" | "warn" | "info" }) {
  const pill = tone === "good" ? "bg-emerald-500/15 text-emerald-200" : tone === "warn" ? "bg-amber-500/15 text-amber-200" : "bg-blue-500/15 text-blue-200";
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-200">
        {icon}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sm text-white/60">
          {label}
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${pill}`}>{tone === "good" ? "Healthy" : tone === "warn" ? "Attention" : "Info"}</span>
        </div>
        <p className="text-xl font-semibold text-white">{value}</p>
        <p className="text-xs text-white/60">{sub}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone = status === "Settled" ? "bg-emerald-500/15 text-emerald-200" : status === "On hold" ? "bg-amber-500/15 text-amber-200" : "bg-blue-500/15 text-blue-200";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{status}</span>;
}

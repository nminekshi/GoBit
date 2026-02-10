"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CreditCard, Wallet, ShieldCheck, RefreshCw, ArrowUpRight, CheckCircle2, Plus } from "lucide-react";

type TxStatus = "Settled" | "On hold" | "Pending";

type Transaction = {
  id: string;
  label: string;
  amount: number; // positive for credit, negative for debit
  status: TxStatus;
  time: string;
};

type PaymentMethod = {
  id: string;
  brand: string;
  expires: string;
  tag?: string;
};

type WalletState = {
  balance: number;
  holds: number;
  lastSync: string;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
};

const STORAGE_KEY = "buyer-wallet";

export default function BuyerPaymentsPage() {
  const [currentUser, setCurrentUser] = useState<{ id: string | null; name: string | null } | null>(null);
  const [wallet, setWallet] = useState<WalletState>({ balance: 0, holds: 0, lastSync: new Date().toISOString(), transactions: [], paymentMethods: [] });
  const [depositAmount, setDepositAmount] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardTag, setCardTag] = useState("Primary");

  // Load user and wallet from storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const id = parsed?.user?._id || parsed?.user?.id || parsed?.user?.uid || parsed?.user?.email || parsed?.user?.username || null;
      const name = parsed?.user?.username || parsed?.user?.name || parsed?.user?.email || null;
      if (!id) return;
      setCurrentUser({ id, name });

      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsedWallets = stored ? JSON.parse(stored) : {};
      const mine = parsedWallets?.[id] as WalletState | undefined;

      if (mine) {
        setWallet(mine);
      } else {
        const fresh: WalletState = {
          balance: 0,
          holds: 0,
          lastSync: new Date().toISOString(),
          transactions: [],
          paymentMethods: [],
        };
        setWallet(fresh);
        parsedWallets[id] = fresh;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedWallets));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const persistWallet = (next: WalletState) => {
    if (!currentUser?.id || typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsedWallets = stored ? JSON.parse(stored) : {};
      parsedWallets[currentUser.id] = next;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedWallets));
      setWallet(next);
    } catch {
      // ignore storage errors
    }
  };

  const handleDeposit = () => {
    if (!currentUser?.id) {
      alert("Please log in as a buyer to deposit.");
      return;
    }
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      alert("Enter a valid deposit amount.");
      return;
    }
    const tx: Transaction = {
      id: `TX-${Date.now()}`,
      label: "Deposit",
      amount,
      status: "Settled",
      time: new Date().toISOString(),
    };
    const next: WalletState = {
      ...wallet,
      balance: wallet.balance + amount,
      lastSync: new Date().toISOString(),
      transactions: [tx, ...wallet.transactions].slice(0, 50),
    };
    persistWallet(next);
    setDepositAmount("");
  };

  const handleAddCard = () => {
    if (!cardBrand.trim() || !cardExpiry.trim()) {
      alert("Add card brand and expiry.");
      return;
    }
    const method: PaymentMethod = {
      id: `PM-${Date.now()}`,
      brand: cardBrand.trim(),
      expires: cardExpiry.trim(),
      tag: cardTag.trim() || "Primary",
    };
    const next: WalletState = {
      ...wallet,
      paymentMethods: [method, ...wallet.paymentMethods].slice(0, 10),
      lastSync: new Date().toISOString(),
    };
    persistWallet(next);
    setCardBrand("");
    setCardExpiry("");
    setCardTag("Secondary");
  };

  const transactions = useMemo(() => wallet.transactions || [], [wallet.transactions]);

  const availableBalance = Math.max(wallet.balance - wallet.holds, 0);

  return (
    <main className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-none space-y-8">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Buyer</p>
          <h1 className="text-3xl font-bold">Payments & Wallet</h1>
          <p className="text-sm text-white/60">Manage funding sources, deposits, and recent payment events.</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard icon={<Wallet className="h-5 w-5 text-emerald-300" />} label="Wallet balance" value={`$${wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} sub="Total funds" tone="good" />
          <SummaryCard icon={<ShieldCheck className="h-5 w-5 text-emerald-300" />} label="Escrow holds" value={`$${wallet.holds.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} sub="Pending releases" tone="warn" />
          <SummaryCard icon={<RefreshCw className="h-5 w-5 text-emerald-300" />} label="Available" value={`$${availableBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} sub="Usable for bids" tone="good" />
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <Card title="Payment Methods" icon={<CreditCard className="h-5 w-5 text-emerald-300" />}>
              <div className="space-y-3">
                {wallet.paymentMethods.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">No cards saved yet.</div>
                )}
                {wallet.paymentMethods.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">{m.brand}</p>
                      <p className="text-xs text-white/60">Expires {m.expires}</p>
                    </div>
                    {m.tag && <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">{m.tag}</span>}
                  </div>
                ))}
                <div className="grid gap-2 rounded-2xl border border-dashed border-emerald-400/50 bg-black/10 p-4 text-sm text-white/80">
                  <div className="grid gap-2 sm:grid-cols-3 sm:items-center">
                    <input
                      value={cardBrand}
                      onChange={(e) => setCardBrand(e.target.value)}
                      placeholder="Card brand and last 4 (e.g., Visa •••• 4242)"
                      className="sm:col-span-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
                    />
                    <input
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
                    />
                    <input
                      value={cardTag}
                      onChange={(e) => setCardTag(e.target.value)}
                      placeholder="Tag (Primary/Backup)"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleAddCard}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300 hover:text-white"
                  >
                    <Plus className="h-4 w-4" /> Add payment method
                  </button>
                </div>
              </div>
            </Card>

            <Card title="Transactions" icon={<ArrowUpRight className="h-5 w-5 text-emerald-300" />}>
              {transactions.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">No transactions yet.</div>
              ) : (
                <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/20">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 text-sm sm:grid-cols-[1fr_auto_auto_auto]">
                      <div className="space-y-1">
                        <p className="font-semibold text-white">{tx.label}</p>
                        <p className="text-xs text-white/60">{tx.id}</p>
                      </div>
                      <span className={`text-sm font-semibold ${tx.amount < 0 ? "text-rose-300" : "text-emerald-300"}`}>
                        {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                      <StatusPill status={tx.status} />
                      <span className="hidden text-xs text-white/60 sm:block">{new Date(tx.time).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Deposit funds" icon={<Wallet className="h-5 w-5 text-emerald-300" />}>
              <div className="space-y-3 text-sm text-white/80">
                <p className="text-white/70">Move money into your bidding wallet. Deposits settle instantly for demo purposes.</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="number"
                    min="1"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Amount (USD)"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none sm:max-w-[200px]"
                  />
                  <button
                    onClick={handleDeposit}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                  >
                    Deposit now
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" /> Secure processing and instant ledger update.
                </div>
              </div>
            </Card>

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
                <div className="text-xs text-white/50">Last sync: {new Date(wallet.lastSync).toLocaleString()}</div>
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

function StatusPill({ status }: { status: TxStatus }) {
  const tone = status === "Settled" ? "bg-emerald-500/15 text-emerald-200" : status === "On hold" ? "bg-amber-500/15 text-amber-200" : "bg-blue-500/15 text-blue-200";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{status}</span>;
}

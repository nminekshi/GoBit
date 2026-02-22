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
  last4: string;
  expires: string;
  tag?: string;
  isDefault?: boolean;
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
  const [hydrated, setHydrated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string | null; name: string | null } | null>(null);
  const [wallet, setWallet] = useState<WalletState>({ balance: 0, holds: 0, lastSync: "", transactions: [], paymentMethods: [] });
  const [depositAmount, setDepositAmount] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardTag, setCardTag] = useState("Primary");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

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
        const coerced = {
          balance: mine.balance || 0,
          holds: mine.holds || 0,
          lastSync: mine.lastSync || new Date().toISOString(),
          transactions: Array.isArray(mine.transactions) ? mine.transactions : [],
          paymentMethods: Array.isArray(mine.paymentMethods)
            ? mine.paymentMethods.map((m) => ({ ...m, last4: (m as any).last4 || "0000", isDefault: (m as any).isDefault || false }))
            : [],
        } as WalletState;
        setWallet(coerced);
        setSelectedCardId(coerced.paymentMethods.find((m) => m.isDefault)?.id || coerced.paymentMethods[0]?.id || null);
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
    const activeCard = wallet.paymentMethods.find((m) => m.id === selectedCardId) || wallet.paymentMethods[0];
    if (!activeCard) {
      alert("Add a card to deposit.");
      return;
    }
    const tx: Transaction = {
      id: `TX-${Date.now()}`,
      label: `Deposit • ${activeCard.brand} •••• ${activeCard.last4}`,
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
    if (!cardBrand.trim() || !cardExpiry.trim() || !cardNumber.trim()) {
      alert("Add card brand, number, and expiry.");
      return;
    }
    const last4 = cardNumber.replace(/\D/g, "").slice(-4) || "0000";
    const method: PaymentMethod = {
      id: `PM-${Date.now()}`,
      brand: cardBrand.trim(),
      last4,
      expires: cardExpiry.trim(),
      tag: cardTag.trim() || "Primary",
      isDefault: wallet.paymentMethods.length === 0,
    };
    const next: WalletState = {
      ...wallet,
      paymentMethods: [method, ...wallet.paymentMethods].slice(0, 10),
      lastSync: new Date().toISOString(),
    };
    persistWallet(next);
    setSelectedCardId(method.id);
    setCardBrand("");
    setCardNumber("");
    setCardExpiry("");
    setCardTag("Secondary");
  };

  const transactions = useMemo(() => wallet.transactions || [], [wallet.transactions]);

  const availableBalance = Math.max(wallet.balance - wallet.holds, 0);
  const lastSyncLabel = hydrated && wallet.lastSync ? new Date(wallet.lastSync).toLocaleString() : "Syncing...";

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
                  <label key={m.id} className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${selectedCardId === m.id ? "border-emerald-400/70 bg-emerald-500/10" : "border-white/10 bg-black/20"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={selectedCardId === m.id} onChange={() => setSelectedCardId(m.id)} className="h-4 w-4" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">{m.brand} •••• {m.last4}</p>
                        <p className="text-xs text-white/60">Expires {m.expires}</p>
                      </div>
                    </div>
                    {m.tag && <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">{m.tag}</span>}
                  </label>
                ))}
                <div className="grid gap-2 rounded-2xl border border-dashed border-emerald-400/50 bg-black/10 p-4 text-sm text-white/80">
                  <div className="grid gap-2 sm:grid-cols-4 sm:items-center">
                    <input
                      value={cardBrand}
                      onChange={(e) => setCardBrand(e.target.value)}
                      placeholder="Card brand (e.g., Visa)"
                      className="sm:col-span-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
                    />
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card number"
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
                  <select
                    value={selectedCardId || ""}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none sm:max-w-[220px]"
                  >
                    <option value="" className="bg-[#0b1428]">Select card</option>
                    {wallet.paymentMethods.map((m) => (
                      <option key={m.id} value={m.id} className="bg-[#0b1428]">
                        {m.brand} •••• {m.last4}
                      </option>
                    ))}
                  </select>
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
                <div className="text-xs text-white/50">Last sync: {lastSyncLabel}</div>
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

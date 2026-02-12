"use client";

import React, { useMemo, useState } from "react";
import { Send, Search, UserCircle2, Clock4, CheckCheck, Paperclip, Image, Archive, MessageSquare, Star } from "lucide-react";

const THREADS = [
  {
    id: "t1",
    buyer: "Kevin D.",
    email: "kevin@lux.com",
    subject: "Rolex Datejust shipping timeline",
    lastMessage: "Can you confirm dispatch by Friday?",
    time: "2m ago",
    unread: 1,
    priority: "high" as const,
  },
  {
    id: "t2",
    buyer: "Sara M.",
    email: "sara@dev.io",
    subject: "Request more photos",
    lastMessage: "Front grill close-up please",
    time: "1h ago",
    unread: 0,
    priority: "normal" as const,
  },
  {
    id: "t3",
    buyer: "Studio Cam",
    email: "hello@studio.com",
    subject: "Invoice copy",
    lastMessage: "Can you resend the PDF?",
    time: "3h ago",
    unread: 0,
    priority: "normal" as const,
  },
];

const MESSAGES: Record<string, { from: "buyer" | "seller"; text: string; ts: string }[]> = {
  t1: [
    { from: "buyer", text: "Hi, can you confirm dispatch by Friday?", ts: "10:12" },
    { from: "seller", text: "Yes, I can ship by Thursday with tracking.", ts: "10:14" },
    { from: "buyer", text: "Great, please add signature on delivery.", ts: "10:15" },
  ],
  t2: [
    { from: "buyer", text: "Can you share a close-up of the grill?", ts: "09:01" },
    { from: "seller", text: "Sure, attaching two angles shortly.", ts: "09:05" },
  ],
  t3: [
    { from: "buyer", text: "Please resend the invoice PDF.", ts: "08:10" },
    { from: "seller", text: "On it. You should have it now.", ts: "08:15" },
  ],
};

export default function MessagesPage() {
  const [activeThread, setActiveThread] = useState(THREADS[0].id);
  const [draft, setDraft] = useState("");

  const currentMessages = useMemo(() => MESSAGES[activeThread] || [], [activeThread]);
  const thread = useMemo(() => THREADS.find((t) => t.id === activeThread)!, [activeThread]);

  return (
    <main className="min-h-screen w-full bg-[#050914] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="grid w-full gap-4 min-h-[85vh] lg:grid-cols-[320px_1fr]">
        <aside className="h-full min-h-[70vh] rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <Search className="h-4 w-4 text-white/50" />
            <input
              placeholder="Search buyers"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
            />
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
            <MessageSquare className="h-4 w-4" /> Conversations
          </div>
          <div className="mt-3 space-y-2">
            {THREADS.map((t) => {
              const isActive = t.id === activeThread;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveThread(t.id)}
                  className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                    isActive
                      ? "border-emerald-400/60 bg-emerald-500/10 text-white shadow-[0_10px_30px_rgba(16,185,129,0.15)]"
                      : "border-white/10 bg-white/0 text-white/80 hover:border-emerald-400/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="h-8 w-8 text-white/70" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">{t.buyer}</p>
                        {t.priority === "high" && (
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-300">Priority</span>
                        )}
                      </div>
                      <p className="truncate text-xs text-white/60">{t.subject}</p>
                    </div>
                    <div className="text-right text-[11px] text-white/50">{t.time}</div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-white/50">
                    <span className="truncate">{t.lastMessage}</span>
                    {t.unread > 0 && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-black">{t.unread}</span>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/70">
            <button className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:border-emerald-400/60">
              <Archive className="h-4 w-4" /> Archive
            </button>
            <button className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:border-emerald-400/60">
              <Star className="h-4 w-4" /> Starred
            </button>
          </div>
        </aside>

        <section className="flex h-full min-h-[70vh] flex-col rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <UserCircle2 className="h-8 w-8 text-white/70" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">{thread.buyer}</p>
              <p className="truncate text-xs text-white/60">{thread.email}</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/70">Order #INV-2048</span>
          </div>

          <div className="mt-4 flex-1 space-y-3 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 min-h-[50vh]">
            {currentMessages.map((m, idx) => (
              <div key={idx} className={`flex ${m.from === "seller" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-lg shadow-black/20 ${
                    m.from === "seller"
                      ? "bg-emerald-500 text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[11px] ${m.from === "seller" ? "text-black/70" : "text-white/50"}`}>{m.ts}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:border-emerald-400/60 hover:text-white">
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:border-emerald-400/60 hover:text-white">
              <Image className="h-5 w-5" />
            </button>
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a reply..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

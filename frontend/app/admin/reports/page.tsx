"use client";

import { BarChart3, Download, CalendarDays } from "lucide-react";

export default function AdminReportsPage() {
  const reports = [
    { id: "R-2201", title: "Weekly Performance", period: "Last 7 days", size: "1.2 MB" },
    { id: "R-2200", title: "Fraud & Disputes", period: "Last 30 days", size: "980 KB" },
    { id: "R-2199", title: "Revenue & GMV", period: "Q1 Preview", size: "1.8 MB" },
  ];

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Admin</p>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-sm text-white/60">Download performance, fraud, and financial summaries.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/60">
            <CalendarDays className="h-4 w-4" /> Schedule
          </button>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((r) => (
            <div key={r.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">{r.id}</p>
                  <h3 className="text-lg font-semibold">{r.title}</h3>
                  <p className="text-sm text-white/60">{r.period}</p>
                </div>
                <BarChart3 className="h-6 w-6 text-emerald-300" />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-white/70">
                <span>{r.size}</span>
                <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-black shadow-emerald-500/20 hover:bg-emerald-400">
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

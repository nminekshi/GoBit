"use client";

import React, { useState } from "react";
import { BarChart3, Download, CalendarDays, Loader2, CheckCircle2, Clock, X, Mail, Check } from "lucide-react";
import { auctionAPI } from "../../lib/api";

export default function AdminReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string | null>(null);
  
  // Cron Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cronState, setCronState] = useState({ report: "R-2201", frequency: "Weekly", email: "" });
  const [cronSuccess, setCronSuccess] = useState(false);

  // Universal CSV generator handler
  const triggerCSVDownload = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWeeklyPerformance = async () => {
    setDownloading("R-2201");
    try {
      const auctions = await auctionAPI.fetchAuctions();
      
      let csvContent = "Auction ID,Title,Status,Category,Start Price (USD),Current Bid (USD),Total Bids,End Time\n";
      
      // We'll iterate all auctions and format cleanly
      auctions.forEach((a: any) => {
        const id = a._id || "N/A";
        const title = `"${(a.title || "").replace(/"/g, '""')}"`;
        const status = a.status || "N/A";
        const category = a.category || "N/A";
        const startPrice = a.startPrice || 0;
        const currentBid = a.currentBid || 0;
        const bidCount = a.bids ? a.bids.length : 0;
        const endTime = a.endTime ? new Date(a.endTime).toISOString() : "N/A";
        
        csvContent += `${id},${title},${status},${category},${startPrice},${currentBid},${bidCount},${endTime}\n`;
      });
      
      triggerCSVDownload("gobit-weekly-performance.csv", csvContent);
      setCompleted("R-2201");
      setTimeout(() => setCompleted(null), 3000);
    } catch (err) {
      console.error("Failed to generate report:", err);
      alert("Error generating report. Check console.");
    } finally {
      setDownloading(null);
    }
  };

  const handleFraudDisputes = async () => {
    setDownloading("R-2200");
    try {
      const suspiciousBids = await auctionAPI.fetchSuspiciousBids();
      
      let csvContent = "Bid ID,Auction ID,Auction Title,Bidder ID,Bid Amount (USD),ML Risk Score,Triggered Flags,Timestamp\n";
      
      suspiciousBids.forEach((bid: any) => {
        const bidId = bid._id || "N/A";
        const auctionId = bid.auctionId || "N/A";
        const title = `"${(bid.auctionTitle || "").replace(/"/g, '""')}"`;
        // Bidder can be populated or just ID string.
        const bidderId = bid.bidder?._id || bid.bidder || "N/A";
        const amount = bid.bidAmount || 0;
        const score = bid.riskScore || 0;
        const flags = `"${(bid.flags || []).join(" | ").replace(/"/g, '""')}"`;
        const time = bid.timestamp ? new Date(bid.timestamp).toISOString() : "N/A";
        
        csvContent += `${bidId},${auctionId},${title},${bidderId},${amount},${score},${flags},${time}\n`;
      });
      
      triggerCSVDownload("gobit-ml-fraud-report.csv", csvContent);
      setCompleted("R-2200");
      setTimeout(() => setCompleted(null), 3000);
    } catch (err) {
      console.error("Failed to generate report:", err);
      alert("Error generating report. Check console.");
    } finally {
      setDownloading(null);
    }
  };

  const handleRevenueGMV = async () => {
    setDownloading("R-2199");
    try {
      // For GMV we just use active/closed auctions again but focus financial fields
      const auctions = await auctionAPI.fetchAuctions();
      
      let csvContent = "Auction ID,Title,Seller ID,Winner ID,Status,Gross Merchandise Value (USD)\n";
      
      // Only summarize items that have monetary bids or are closed
      const monetaryAuctions = auctions.filter((a: any) => a.currentBid && a.currentBid > 0);
      
      monetaryAuctions.forEach((a: any) => {
        const id = a._id || "N/A";
        const title = `"${(a.title || "").replace(/"/g, '""')}"`;
        const sellerId = a.seller?._id || a.seller || "N/A";
        const winnerId = a.winner || "None";
        const status = a.status || "N/A";
        const gmv = a.currentBid || 0;
        
        csvContent += `${id},${title},${sellerId},${winnerId},${status},${gmv}\n`;
      });
      
      triggerCSVDownload("gobit-financial-revenue.csv", csvContent);
      setCompleted("R-2199");
      setTimeout(() => setCompleted(null), 3000);
    } catch (err) {
      console.error("Failed to generate report:", err);
      alert("Error generating report. Check console.");
    } finally {
      setDownloading(null);
    }
  };

  const reports = [
    { 
      id: "R-2201", 
      title: "Weekly Performance", 
      period: "Platform-wide auction ledger", 
      size: "CSV · Live Query",
      action: handleWeeklyPerformance 
    },
    { 
      id: "R-2200", 
      title: "Fraud & Disputes", 
      period: "Machine Learning (ML) Intercepts", 
      size: "CSV · Live Query",
      action: handleFraudDisputes
    },
    { 
      id: "R-2199", 
      title: "Revenue & GMV", 
      period: "Gross Merchandise Value Ledger", 
      size: "CSV · Live Query",
      action: handleRevenueGMV
    },
  ];

  const handleScheduleCron = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cronState.email) return;
    
    setDownloading("cron");
    try {
      const success = await auctionAPI.sendReportEmail(cronState.email, cronState.report, cronState.frequency);
      if (success) {
        setCronSuccess(true);
        setTimeout(() => {
          setCronSuccess(false);
          setIsModalOpen(false);
          setCronState({ report: "R-2201", frequency: "Weekly", email: "" });
        }, 3000);
      } else {
        alert("Failed to dispatch email. Please configure EMAIL_USER and EMAIL_PASS in your backend .env file.");
      }
    } catch (err) {
      console.error("Schedule error:", err);
      alert("Error occurred while deploying CRON job.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-8 text-white sm:px-6 lg:px-10">
      
      {/* Dynamic Schedule Cron Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1326] p-6 shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Automated Tasks</h2>
                <p className="text-xs text-white/50">Schedule background CRON jobs.</p>
              </div>
            </div>

            {cronSuccess ? (
               <div className="flex flex-col items-center justify-center py-6 text-emerald-400">
                  <div className="rounded-full bg-emerald-500/20 p-4 mb-4">
                     <Check className="h-8 w-8" />
                  </div>
                  <p className="font-bold text-lg">CRON Job Registered!</p>
                  <p className="text-white/60 text-sm mt-1 text-center">Your pipeline is now highly optimized.<br/>It will execute automatically.</p>
               </div>
            ) : (
              <form onSubmit={handleScheduleCron} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/70">Select Report Metric</label>
                  <select 
                    value={cronState.report}
                    onChange={(e) => setCronState(p => ({ ...p, report: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-emerald-500/50 focus:outline-none"
                  >
                    <option value="R-2201">Weekly Performance Overview</option>
                    <option value="R-2200">ML Fraud & Disputes Tracker</option>
                    <option value="R-2199">Gross Revenue (GMV) LTR</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/70">Execution Frequency</label>
                  <div className="flex gap-2">
                    {["Daily", "Weekly", "Monthly"].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setCronState(p => ({ ...p, frequency: freq }))}
                        className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                          cronState.frequency === freq
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/70">Delivery Destination (Email)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-white/30" />
                    <input 
                      type="email"
                      required
                      placeholder="admin@gobit.com"
                      value={cronState.email}
                      onChange={(e) => setCronState(p => ({ ...p, email: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:border-emerald-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={downloading === "cron"}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading === "cron" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Clock className="h-5 w-5" />}
                  {downloading === "cron" ? "Registering Daemon..." : "Deploy CRON Job"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-none space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-400">Admin</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Data Exports & Reports</h1>
            <p className="mt-2 text-sm text-white/60">Generate and download live performance, ML fraud logs, and financial summaries as CSV spreadsheets straight from MongoDB.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:border-emerald-400/60 transition-colors shadow-lg"
          >
            <CalendarDays className="h-4 w-4 text-emerald-300" /> Schedule Cron
          </button>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => {
             const isDownloading = downloading === r.id;
             const isCompleted = completed === r.id;

             return (
              <div key={r.id} className="relative overflow-hidden flex flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 shadow-xl shadow-black/40 hover:bg-white/10 transition-all hover:border-emerald-500/30">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mt-1 tracking-tight text-white">{r.title}</h3>
                    <p className="mt-1.5 text-xs font-medium text-white/50">{r.period}</p>
                    <p className="mt-6 text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-400/80 bg-emerald-500/10 inline-flex px-2 py-0.5 rounded-full">{r.id}</p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black/40 border border-white/10 text-emerald-400">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-5">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-white/30">{r.size}</span>
                  
                  <button 
                    onClick={r.action}
                    disabled={isDownloading || isCompleted}
                    className={`inline-flex min-w-[130px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[11px] uppercase tracking-wider font-bold shadow-lg transition-all ${
                       isCompleted 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ring-1 ring-emerald-500/20'
                        : isDownloading 
                           ? 'bg-white/5 text-white/50 cursor-not-allowed border border-white/5'
                           : 'bg-emerald-500 text-black shadow-emerald-500/20 hover:bg-emerald-400 border border-emerald-400'
                    }`}
                  >
                    {isCompleted ? (
                       <>
                         <CheckCircle2 className="h-4 w-4" /> Exported!
                       </>
                    ) : isDownloading ? (
                       <>
                         <Loader2 className="h-4 w-4 animate-spin text-white/80" /> Compiling...
                       </>
                    ) : (
                       <>
                         <Download className="h-4 w-4" /> Generate
                       </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}

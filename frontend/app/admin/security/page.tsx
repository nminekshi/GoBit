"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, Cpu, Lock } from "lucide-react";
import { auctionAPI } from "../../lib/api";

export default function AdminSecurityPage() {
  const [bids, setBids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadBids = async () => {
      try {
        const data = await auctionAPI.fetchSuspiciousBids();
        if (mounted) {
          setBids(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadBids();
    return () => { mounted = false; };
  }, []);

  const criticalBids = bids.filter(b => b.riskScore >= 80).length;

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-none space-y-6">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Admin Controls
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Security Operations Center</h1>
              <p className="text-sm text-white/60">Live monitoring of your FYP Machine Learning detection pipeline.</p>
            </div>
          </div>
        </header>

        {/* Actionable Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
               <Cpu className="h-5 w-5" />
             </div>
             <div className="flex flex-col">
               <div className="flex items-center gap-2 text-sm text-white/50">
                 Python ML Engine
                 <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">Online</span>
               </div>
               <p className="text-lg font-semibold text-white">Active Status</p>
               <p className="text-xs text-white/50">Uvicorn API Port 8000</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300">
               <ShieldAlert className="h-5 w-5" />
             </div>
             <div className="flex flex-col">
               <div className="flex items-center gap-2 text-sm text-white/50">
                 Intercepted Anomalies
               </div>
               <p className="text-lg font-semibold text-white">{isLoading ? "..." : bids.length}</p>
               <p className="text-xs text-white/50">Caught by AI Heuristics</p>
             </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
               <AlertTriangle className="h-5 w-5" />
             </div>
             <div className="flex flex-col">
               <div className="flex items-center gap-2 text-sm text-white/50">
                 Critical Threshold
                 {criticalBids > 0 && <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-400">Review</span>}
               </div>
               <p className="text-lg font-semibold text-white">{isLoading ? "..." : criticalBids}</p>
               <p className="text-xs text-white/50">Risk Score &gt;= 80</p>
             </div>
          </div>
        </div>

        {/* Launchpads and Feeds */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          
          {/* Main Controls (Spans 2/3) */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <h2 className="text-sm font-semibold text-white/60">System Interfaces</h2>
            
            <Link 
              href="/admin/security/fraud"
              className="group relative flex flex-col sm:flex-row items-center gap-5 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6 overflow-hidden transition-all hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 hover:bg-emerald-500/[0.02]"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl transition-transform group-hover:scale-150" />
              
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black/40 border border-white/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20 group-hover:text-emerald-300">
                 <ShieldCheck className="h-8 w-8" />
              </div>
              
              <div className="flex flex-col flex-1">
                 <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                   Fraud Detection Matrix
                 </h3>
                 <p className="mt-1 text-sm text-white/60 leading-relaxed max-w-md">
                    Open the live WebSockets dashboard. Watch your synthetic Python Machine Learning model intercept and flag sniper bots, self-outbidding logic, and anomalies locally in real-time.
                 </p>
              </div>
              
              <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-full border border-white/10 bg-white/5 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all text-white/70 group-hover:text-emerald-300 mt-4 sm:mt-0 shadow-inner">
                 <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Inactive System Item */}
            <div className="group relative flex flex-col sm:flex-row items-center gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 opacity-60 cursor-not-allowed">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black/40 border border-white/10 text-white/40">
                 <Lock className="h-6 w-6" />
              </div>
              <div className="flex flex-col flex-1">
                 <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                   Access Control Limits <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/50 border border-white/5">Q3 Roadmap</span>
                 </h3>
                 <p className="mt-1 text-xs text-white/40 leading-relaxed max-w-md">
                    Management of root permissions, remote VPN connection policies, and administrative two-factor authentication requirements.
                 </p>
              </div>
            </div>
          </div>

          {/* Live Feed Column (Spans 1/3) */}
          <div className="flex flex-col gap-5 lg:col-span-1">
             <h2 className="text-sm font-semibold text-white/60">Recent Threat Intercepts</h2>
             <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 h-full">
               {bids.slice(0, 4).map(bid => {
                 const isCrit = bid.riskScore >= 80;
                 return (
                   <div key={bid._id} className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-black/20 p-3 hover:bg-black/40 transition-colors">
                      <div className="flex items-center justify-between">
                         <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isCrit ? 'text-rose-400' : 'text-amber-400'}`}>
                           <AlertTriangle className="w-3 h-3"/> {bid.flags[0]?.replace('[ML] ', '') || "Anomaly"}
                         </span>
                         <span className="text-[10px] font-mono text-white/40">{new Date(bid.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                         <span className="text-white/80 line-clamp-1 truncate max-w-[150px]">{bid.auctionTitle}</span>
                         <span className={`font-mono text-xs font-bold ${isCrit ? 'text-rose-400' : 'text-amber-400'}`}>Score: {bid.riskScore}</span>
                      </div>
                   </div>
                 );
               })}
               
               {bids.length === 0 && !isLoading && (
                 <div className="flex flex-1 items-center justify-center text-sm text-white/40 italic text-center px-4">
                   No recent threats detected on the network.
                 </div>
               )}

               {bids.length > 4 && (
                 <Link href="/admin/security/fraud" className="mt-auto pt-2 text-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                   View all {bids.length} records &rarr;
                 </Link>
               )}
             </div>
          </div>

        </div>

      </div>
    </main>
  );
}

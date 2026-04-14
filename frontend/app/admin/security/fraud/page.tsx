"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { ShieldAlert, AlertTriangle, RefreshCcw, Clock, Target, ShieldCheck } from "lucide-react";
import io, { Socket } from "socket.io-client";

// Minimal types
interface UserBrief {
  _id: string;
  username: string;
  email: string;
}

interface SuspiciousBid {
  _id: string;
  auctionId: string;
  auctionTitle: string;
  bidder: UserBrief | string;
  bidAmount: number;
  riskScore: number;
  flags: string[];
  timestamp: string;
}

export default function FraudDashboard() {
  const [bids, setBids] = useState<SuspiciousBid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const fetchBids = useCallback(async () => {
    try {
      setIsLoading(true);
      const { auctionAPI } = await import("../../../lib/api");
      const data = await auctionAPI.fetchSuspiciousBids();
      setBids(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  useEffect(() => {
    let activeSocket: Socket;
    const setupSocket = async () => {
      const { API_BASE_URL } = await import("../../../lib/api");
      const socket = io(API_BASE_URL, {
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      activeSocket = socket;
      socketRef.current = socket;

      socket.on("connect", () => setIsConnected(true));
      socket.on("disconnect", () => setIsConnected(false));

      socket.on("admin:fraud_alert", (payload: any) => {
        // payload: { auctionId, auctionTitle, bid: { ...bidDetails } }
        const newFraudBid: SuspiciousBid = {
          _id: payload.bid._id || Math.random().toString(),
          auctionId: payload.auctionId,
          auctionTitle: payload.auctionTitle,
          bidder: payload.bid.bidderId, 
          bidAmount: payload.bid.bidAmount,
          riskScore: payload.bid.riskScore,
          flags: payload.bid.flags || [],
          timestamp: payload.bid.timestamp,
        };

        setBids((prev) => {
          // Add to beginning and sort by risk
          const updated = [newFraudBid, ...prev.filter(b => b._id !== newFraudBid._id)];
          return updated.sort((a, b) => b.riskScore - a.riskScore);
        });
      });
    };

    setupSocket();

    return () => {
      if (activeSocket) activeSocket.disconnect();
    };
  }, []);

  const getRiskTone = (score: number) => {
    if (score >= 80) return "bg-rose-500/15 border-rose-500/30 text-rose-300";
    if (score >= 50) return "bg-amber-500/15 border-amber-500/30 text-amber-300";
    return "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";
  };

  const highRiskCount = bids.filter((b) => b.riskScore >= 80).length;

  return (
    <main className="min-h-screen bg-[#050915] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="w-full space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.25em] text-rose-400 font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Security Operations
            </p>
            <h1 className="text-3xl font-bold">Fraud Detection</h1>
            <p className="text-sm text-white/60">Real-time monitoring of suspicious bidding behavior.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold ${isConnected ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-white/5 text-slate-400"}`}>
              <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
              {isConnected ? "Live Feed Active" : "Connecting..."}
            </div>
            <button 
              onClick={fetchBids}
              className="flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm transition-colors text-white"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
            <p className="text-sm font-medium text-slate-400">Critical Alerts</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-5xl font-bold text-rose-400">{highRiskCount}</p>
              <p className="text-sm text-slate-500">Risk &gt;= 80</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
            <p className="text-sm font-medium text-slate-400">Total Flagged Bids</p>
            <p className="mt-2 text-5xl font-bold text-amber-400">{bids.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg flex flex-col justify-center">
             <div className="flex items-center gap-3 text-emerald-300">
               <ShieldCheck className="w-10 h-10" />
               <div>
                  <p className="font-semibold text-lg">System Active</p>
                  <p className="text-xs text-white/50">Velocity &amp; Jump Models OK</p>
               </div>
             </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#09101f] shadow-2xl overflow-hidden mt-6">
          <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between bg-black/20">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" /> Suspicious Activity Ledger
            </h2>
            <div className="text-xs text-white/50">{bids.length} records found</div>
          </div>
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/40 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Risk Score</th>
                  <th className="px-6 py-4 font-medium">Flags Triggered</th>
                  <th className="px-6 py-4 font-medium">Bidder</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Auction Details</th>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading && bids.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading ledger...</td>
                  </tr>
                ) : bids.length === 0 ? (
                   <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No suspicious bids detected. Your platform is secure.</td>
                  </tr>
                ) : (
                  bids.map((bid) => {
                    const bidderName = typeof bid.bidder === 'object' && bid.bidder !== null 
                                       ? bid.bidder.username 
                                       : "Unknown/ID";
                    return (
                      <tr key={bid._id} className="transition-colors hover:bg-white/[0.02]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center rounded-xl border px-3 py-1 font-mono font-bold ${getRiskTone(bid.riskScore)}`}>
                            {bid.riskScore}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-sm">
                          <div className="flex flex-wrap gap-2">
                             {bid.flags.map((flag, idx) => (
                               <span key={idx} className="inline-flex items-center gap-1.5 rounded-lg bg-black/30 border border-white/10 px-2 py-1 text-[11px] text-slate-300">
                                 <AlertTriangle className="w-3 h-3 text-amber-400" />
                                 {flag}
                               </span>
                             ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/70">
                              {bidderName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-white/90">{bidderName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-emerald-400">
                          ${bid.bidAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium text-white/90 truncate max-w-[200px]">{bid.auctionTitle}</span>
                            <span className="text-[10px] text-white/40 block">ID: {bid.auctionId.substring(0,8)}...</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400 flex items-center gap-2 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(bid.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

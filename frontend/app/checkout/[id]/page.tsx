"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auctionAPI } from "../../lib/api";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);
  const [auction, setAuction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"payhere" | "demo">("payhere");

  useEffect(() => {
    const authRaw = typeof window !== "undefined" ? window.localStorage.getItem("auth") : null;
    if (authRaw) {
      try {
        const parsed = JSON.parse(authRaw);
        setCurrentUserId(parsed?.user?._id || parsed?.user?.id || null);
      } catch {
        setCurrentUserId(null);
      }
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      if (!currentUserId) {
        setError("Please sign in to continue to checkout.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await auctionAPI.fetchAuctionById(id as string);
        setAuction(data);
        const winnerId = typeof data?.winnerId === "string" ? data.winnerId : data?.winnerId?._id;
        if (winnerId && winnerId !== currentUserId) {
          setError("Unauthorized: only the winner can complete payment");
        } else if (!winnerId) {
          setError("This auction does not have a winner yet.");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load checkout");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, currentUserId]);

  const latestBid = auction?.bids?.length ? auction.bids[auction.bids.length - 1] : null;
  const winningAmount = latestBid?.bidAmount || auction?.currentBid;
  const paymentDeadlineHours = process.env.NEXT_PUBLIC_PAYMENT_DEADLINE_HOURS || 48;

  const payHereEndpoint = useMemo(
    () => process.env.NEXT_PUBLIC_PAYHERE_BASE_URL || "https://sandbox.payhere.lk/pay/checkout",
    []
  );

  const handlePayDemo = async () => {
    if (!auction) return;
    setMessage(null);
    setPaying(true);
    try {
      const res = await auctionAPI.payAuction(auction._id);
      setMessage(res.message || "Payment recorded");
      router.push(`/order-confirmation/${auction._id}`);
    } catch (err: any) {
      setMessage(err?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  const handlePayHere = async () => {
    if (!auction) return;
    setMessage(null);
    setPaying(true);
    try {
      const session = await auctionAPI.createPayHereSession(auction._id);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = payHereEndpoint;
      form.target = "_self";

      const fields: Record<string, string> = {
        merchant_id: session.merchantId,
        return_url: `${window.location.origin}/order-confirmation/${auction._id}?gateway=payhere`,
        cancel_url: window.location.href,
        notify_url: `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/auctions/payhere/notify`,
        order_id: session.orderId,
        items: session.items,
        amount: session.amount,
        currency: session.currency,
        first_name: session.firstName || "Buyer",
        last_name: session.lastName || "",
        email: session.email || "buyer@example.com",
        phone: session.phone || "",
        address: "",
        city: "",
        country: "Sri Lanka",
        custom_1: auction._id,
        custom_2: currentUserId || "",
        hash: session.hash,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value ?? "");
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      setMessage(err?.message || "Failed to start PayHere sandbox payment");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#02050D] via-[#051126] to-[#010308] text-white gap-6">
        <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 border-t-4 border-b-4 border-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute w-16 h-16 border-r-4 border-l-4 border-blue-500 rounded-full animate-[spin_1.5s_linear_reverse_infinite]"></div>
            <div className="w-8 h-8 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_20px_#34d399]"></div>
        </div>
        <p className="text-emerald-400 font-medium tracking-widest uppercase text-sm animate-pulse">Initializing Secure Checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#02050D] via-[#051126] to-[#010308] text-white gap-6 p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
           <svg className="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
        </div>
        <div>
           <h2 className="text-3xl font-black mb-3">Checkout Error</h2>
           <p className="text-white/60 max-w-md mx-auto text-lg">{error}</p>
        </div>
        <Link href={`/auctions/${id}`} className="mt-6 px-10 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-semibold uppercase tracking-wider backdrop-blur-md">
          Return to Auction
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02050D] via-[#051126] to-[#010308] text-white px-4 md:px-8 xl:px-12 py-8 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <div className="w-full space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-8 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase">Secure Checkout</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">Complete Payment</h1>
          </div>
          <Link href={`/auctions/${auction._id}`} className="mt-6 md:mt-0 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center gap-2 text-white/80 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md text-sm font-medium group">
            <span className="group-hover:-translate-x-1.5 transition-transform duration-300">←</span> 
            Back to listing
          </Link>
        </div>

        {/* Dynamic Full Width Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 w-full">
          
          {/* Left Column - Product & Summary */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            
            {/* Aspect Ratio adjusted correctly, smaller font scaling */}
            <div className="group relative w-full aspect-[21/10] sm:aspect-[24/9] lg:aspect-[28/9] overflow-hidden rounded-3xl border border-white/10 bg-[#040918] shadow-2xl backdrop-blur-lg">
                 {auction.imageUrl ? (
                   <Image src={auction.imageUrl} alt={auction.title} fill className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 group-hover:brightness-110" />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 text-white/30 gap-3">
                     <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                     <p className="font-medium text-sm tracking-wide">No Image Provided</p>
                   </div>
                 )}
                 {/* Inner Gradient for Content Readability */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#02050D] via-[#02050D]/80 to-transparent flex flex-col justify-end p-6 md:p-8 transition-opacity duration-500">
                     <p className="text-emerald-400 font-bold tracking-[0.15em] text-xs mb-2 uppercase flex items-center gap-2">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#34d399]"></span> 
                       {auction.category}
                     </p>
                     <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 drop-shadow-lg tracking-tight leading-tight">{auction.title}</h2>
                     <div className="flex flex-wrap gap-3 items-center text-xs font-medium">
                         <span className="px-4 py-2 rounded-full bg-black/60 border border-white/20 backdrop-blur-xl flex items-center gap-2 shadow-lg hover:bg-black/40 transition-colors">
                           {auction.auctionType === "live" ? <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]"></span> : <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>}
                           {auction.auctionType === "live" ? "Live Auction Event" : "Standard Listing"}
                         </span>
                         <span className="px-4 py-2 rounded-full bg-black/60 border border-white/20 backdrop-blur-xl flex items-center gap-2 shadow-lg text-white/80 hover:bg-black/40 transition-colors">
                           <svg className="w-3.5 h-3.5 opacity-70" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
                           Winning Bidder: <strong className="text-white ml-1">{auction.winnerId?.username || "You"}</strong>
                         </span>
                     </div>
                 </div>
            </div>

            {/* Bidding Summary Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
               <div className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:bg-emerald-500/[0.04] hover:border-emerald-500/30">
                  <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-[0.05] transition-all duration-500 translate-x-6 group-hover:translate-x-0 group-hover:-translate-y-2">
                     <svg className="w-20 h-20 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h2.25c.12.98.98 1.46 2.26 1.46 1.54 0 2.22-.71 2.22-1.55 0-1.14-1.28-1.41-3.1-1.9-2.22-.59-3.41-1.63-3.41-3.35 0-1.62 1.32-2.81 3.05-3.15V4h2.67v1.95c1.4.3 2.65 1.15 2.94 2.8h-2.26c-.16-.83-.88-1.23-1.92-1.23-1.1 0-1.96.53-1.96 1.45 0 1.05 1.25 1.31 3.25 1.84 2.37.64 3.26 1.84 3.26 3.4 0 1.76-1.34 2.9-3.31 3.23z"/></svg>
                  </div>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-3 relative z-10 flex items-center gap-2">
                    <span className="h-px bg-white/20 flex-1"></span> Winning Amount <span className="h-px bg-white/20 flex-1"></span>
                  </p>
                  <p className="text-3xl lg:text-4xl text-emerald-400 font-black tracking-tighter relative z-10 text-center">
                    ${winningAmount?.toLocaleString()}
                  </p>
               </div>
               
               <div className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20">
                  <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-[0.05] transition-all duration-500 translate-x-6 group-hover:translate-x-0 group-hover:-translate-y-2">
                     <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-3 relative z-10 flex items-center gap-2">
                    <span className="h-px bg-white/20 flex-1"></span> Time To Pay <span className="h-px bg-white/20 flex-1"></span>
                  </p>
                  <div className="flex flex-col items-center justify-center relative z-10">
                     <p className="text-3xl lg:text-4xl text-white font-black tracking-tighter">{paymentDeadlineHours}</p>
                     <p className="text-[10px] font-semibold tracking-wide text-white/50 uppercase">Hours Limit</p>
                  </div>
               </div>
               
               <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 flex flex-col justify-center">
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="h-px bg-white/20 w-6"></span> Account Info
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 text-emerald-400 flex items-center justify-center font-black text-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        {auction.winnerId?.username?.[0]?.toUpperCase() || "U"}
                     </div>
                     <div className="min-w-0 flex-1">
                        <p className="text-lg font-bold text-white truncate drop-shadow-sm leading-tight">{auction.winnerId?.username || "You"}</p>
                        <p className="text-emerald-400/80 text-xs truncate font-medium mt-0.5">{auction.winnerId?.email || "No email"}</p>
                     </div>
                  </div>
               </div>
            </div>

          </div>

          {/* Right Column - Payment Module */}
          <div className="xl:col-span-4 relative h-full">
             <div className="xl:sticky xl:top-8 rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 lg:p-8 backdrop-blur-3xl shadow-xl flex flex-col gap-6 h-fit">
                 {/* Header for Payment */}
                 <div className="border-b border-white/10 pb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
                       <span className="h-8 w-1.5 -ml-8 bg-emerald-500 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
                       Payment
                    </h3>
                    <p className="text-white/50 text-xs md:text-sm mt-3 leading-relaxed font-medium">
                      Select simulation gateway. Transactions are processed securely in an isolated test environment.
                    </p>
                 </div>

                 {/* Payment Option Buttons */}
                 <div className="space-y-3">
                    <button 
                       onClick={() => setPaymentMethod("payhere")}
                       className={`group relative w-full text-left transition-all duration-300 rounded-2xl p-5 border overflow-hidden ${paymentMethod === "payhere" ? "border-emerald-500/60 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5" : "border-white/5 bg-black/40 hover:bg-white/[0.05] hover:border-white/20"} flex items-start gap-4`}
                    >
                       <div className={`mt-0.5 shrink-0 h-5 w-5 rounded-full border-[2px] transition-all duration-300 flex items-center justify-center ${paymentMethod === "payhere" ? "border-emerald-500 bg-emerald-500/20" : "border-white/20"}`}>
                           {paymentMethod === "payhere" && <div className="h-2 w-2 rounded-full bg-emerald-500"></div>}
                       </div>
                       <div className="relative z-10">
                          <p className={`font-bold text-base transition-colors duration-300 ${paymentMethod === "payhere" ? "text-emerald-400" : "text-white"}`}>PayHere API</p>
                          <p className={`text-xs mt-1 leading-relaxed transition-colors duration-300 ${paymentMethod === "payhere" ? "text-emerald-100/70" : "text-white/40"}`}>External redirect gateway testing.</p>
                       </div>
                    </button>

                    <button 
                       onClick={() => setPaymentMethod("demo")}
                       className={`group relative w-full text-left transition-all duration-300 rounded-2xl p-5 border overflow-hidden ${paymentMethod === "demo" ? "border-emerald-500/60 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5" : "border-white/5 bg-black/40 hover:bg-white/[0.05] hover:border-white/20"} flex items-start gap-4`}
                    >
                       <div className={`mt-0.5 shrink-0 h-5 w-5 rounded-full border-[2px] transition-all duration-300 flex items-center justify-center ${paymentMethod === "demo" ? "border-emerald-500 bg-emerald-500/20" : "border-white/20"}`}>
                           {paymentMethod === "demo" && <div className="h-2 w-2 rounded-full bg-emerald-500"></div>}
                       </div>
                       <div className="relative z-10">
                          <p className={`font-bold text-base transition-colors duration-300 ${paymentMethod === "demo" ? "text-emerald-400" : "text-white"}`}>Fast Demo Pay</p>
                          <p className={`text-xs mt-1 leading-relaxed transition-colors duration-300 ${paymentMethod === "demo" ? "text-emerald-100/70" : "text-white/40"}`}>Direct internal API call bypass.</p>
                       </div>
                    </button>
                 </div>

                 {/* Feedback Alert */}
                 {message && (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-300 text-xs flex gap-3 items-center backdrop-blur-md font-medium">
                       <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_8px_#34d399]"></div>
                       <span className="leading-relaxed">{message}</span>
                    </div>
                 )}

                 {/* Order Total & Submit */}
                 <div className="pt-6 border-t border-white/10 mt-auto">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-white/50 text-xs font-bold uppercase tracking-[0.1em]">Total Due</span>
                        <div className="text-right flex items-baseline">
                           <span className="text-emerald-500 text-lg font-medium">$</span>
                           <span className="text-3xl sm:text-4xl font-bold text-white ml-1 drop-shadow-md tracking-tighter">{winningAmount?.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                      onClick={paymentMethod === "payhere" ? handlePayHere : handlePayDemo}
                      disabled={paying}
                      className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-6 py-4 lg:py-5 text-center text-sm font-bold text-[#010308] shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {/* Shine effect */}
                      <div className="-translate-x-[150%] absolute inset-0 block h-full w-1/2 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-[1.5s] ease-in-out group-hover:translate-x-[250%]"></div>
                      
                      <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest uppercase">
                         {paying ? (
                           <>
                             <svg className="animate-[spin_1s_ease-in-out_infinite] h-5 w-5 text-[#010308]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             Processing...
                           </>
                         ) : paymentMethod === "payhere" ? "Pay with PayHere" : "Confirm Demo Payment"}
                      </span>
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 mt-5 text-white/30 text-[10px] font-semibold tracking-wide uppercase">
                       <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                       AES-256 Encrypted Simulation
                    </div>
                 </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

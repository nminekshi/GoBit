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
      <div className="min-h-screen flex items-center justify-center bg-[#040918] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#040918] text-white gap-4">
        <p className="text-xl text-rose-400">{error}</p>
        <Link href={`/auctions/${id}`} className="text-emerald-400 hover:underline">Back to auction</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040918] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">Checkout</p>
            <h1 className="text-3xl font-bold">Complete Payment</h1>
          </div>
          <Link href={`/auctions/${auction._id}`} className="text-emerald-400 hover:underline text-sm">Back to auction</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="flex gap-4">
              <div className="relative h-28 w-36 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                {auction.imageUrl ? (
                  <Image src={auction.imageUrl} alt={auction.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/40 text-xs">No image</div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-white/50">Item</p>
                <h2 className="text-xl font-semibold">{auction.title}</h2>
                <p className="text-sm text-white/60">Category: {auction.category}</p>
                <p className="text-sm text-white/60">Auction type: {auction.auctionType === "live" ? "Live" : "Normal"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-white/50 text-xs uppercase">Winning bid</p>
                <p className="text-2xl font-semibold text-emerald-300">${winningAmount?.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-white/50 text-xs uppercase">Payment deadline</p>
                <p className="text-base font-semibold text-white">{paymentDeadlineHours} hours</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm space-y-2">
              <p className="text-white/50 text-xs uppercase">Buyer</p>
              <p className="font-semibold">{auction.winnerId?.username || "You"}</p>
              <p className="text-white/70 text-xs">{auction.winnerId?.email || ""}</p>
            </div>

            {message && <div className="rounded-xl border border-white/10 bg-emerald-500/10 text-emerald-200 p-3 text-sm">{message}</div>}

            <button
              onClick={paymentMethod === "payhere" ? handlePayHere : handlePayDemo}
              disabled={paying}
              className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition disabled:opacity-60"
            >
              {paying ? "Processing..." : paymentMethod === "payhere" ? "Pay with PayHere Sandbox" : "Mark as Paid (Demo)"}
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 text-sm">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            <p className="text-white/70 text-sm">Choose how to simulate payment. PayHere opens the sandbox checkout page.</p>
            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3 hover:border-emerald-300/60">
                <input
                  type="radio"
                  className="mt-1"
                  checked={paymentMethod === "payhere"}
                  onChange={() => setPaymentMethod("payhere")}
                />
                <div className="space-y-1">
                  <p className="font-semibold">PayHere Sandbox</p>
                  <p className="text-xs text-white/60">Redirects to PayHere sandbox using merchant 1234093. Great for testing full flow.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/10 p-3 hover:border-emerald-300/60">
                <input
                  type="radio"
                  className="mt-1"
                  checked={paymentMethod === "demo"}
                  onChange={() => setPaymentMethod("demo")}
                />
                <div className="space-y-1">
                  <p className="font-semibold">Mark as Paid (Demo)</p>
                  <p className="text-xs text-white/60">Calls the existing API to record payment without external gateway.</p>
                </div>
              </label>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-100 text-xs">
              Payment is due within {paymentDeadlineHours} hours to avoid cancellation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

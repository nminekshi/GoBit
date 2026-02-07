"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Wallet, MessageCircle, Settings, Menu } from "lucide-react";

// --- Types ---
interface Auction {
  id: string;
  title: string;
  category: string;
  description: string;
  startPrice: number;
  currentBid: number;
  status: "active" | "draft" | "sold";
  startTime: Date;
  endTime: Date;
  winner?: string;
  bidsCount: number;
  imageUrl: string;
  views: number;
  createdAt: Date;
}

// --- Mock Data ---
const MOCK_SELLER_AUCTIONS: Auction[] = [
  {
    id: "s1",
    title: "2021 Tesla Model 3 Long Range", // Updated to match style of request
    category: "Electronics",
    description: "All-Wheel Drive, 28,000 miles. Autopilot enabled. Includes Wall Connector and...",
    startPrice: 32500,
    currentBid: 32500,
    status: "active",
    startTime: new Date("2026-02-01T13:47:00"),
    endTime: new Date("2026-02-05T13:50:00"),
    bidsCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=260&h=200",
    views: 124,
    createdAt: new Date(),
  },
  {
    id: "s2",
    title: "Eames Lounge Chair Replica",
    category: "Art & Editions",
    description: "High-quality reproduction with premium Italian leather and walnut veneer finish.",
    startPrice: 500,
    currentBid: 500,
    status: "draft",
    startTime: new Date("2026-02-10T09:00:00"),
    endTime: new Date("2026-02-15T18:00:00"),
    bidsCount: 0,
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=260&h=200",
    views: 0,
    createdAt: new Date(),
  },
  {
    id: "s3",
    title: "Signed Basketball Jersey",
    category: "Art & Editions",
    description: "Authentic signed jersey from the 2024 championship game. COA included.",
    startPrice: 200,
    currentBid: 52000,
    status: "sold",
    startTime: new Date("2026-01-20T10:00:00"),
    endTime: new Date("2026-02-01T13:50:00"),
    winner: "Dili@gmail.com",
    bidsCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=260&h=200", // placeholder
    views: 340,
    createdAt: new Date(),
  },
];

// Normalize persisted auctions to ensure numeric fields and defaults are present
const normalizeAuction = (a: any): Auction => {
  const startPrice = Number(a.startPrice) || 0;
  const currentBid = Number(a.currentBid ?? startPrice) || startPrice;
  const views = Number(a.views) || 0;
  const bidsCount = Number(a.bidsCount) || 0;
  const startTime = a.startTime ? new Date(a.startTime) : new Date();
  const endTime = a.endTime ? new Date(a.endTime) : new Date();

  const statusList = ["active", "draft", "sold"] as const;
  const status = statusList.includes(a.status) ? a.status : "draft";

  return {
    id: a.id ?? crypto.randomUUID(),
    title: a.title ?? "Untitled Auction",
    category: a.category ?? "Misc",
    description: a.description ?? "",
    startPrice,
    currentBid,
    status,
    startTime,
    endTime,
    winner: a.winner,
    bidsCount,
    imageUrl: a.imageUrl || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=260&h=200",
    views,
    createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
  };
};

export default function SellerDashboard() {
  // --- State ---
  const [myAuctions, setMyAuctions] = useState<Auction[]>(MOCK_SELLER_AUCTIONS);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("Seller");
  const [profileEmail, setProfileEmail] = useState("seller@example.com");
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  // Dashboard Filters
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft" | "sold">("all");

  const pathname = usePathname();



  // --- Effects ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const username = parsed?.user?.username as string | undefined;
      if (username) {
        setDisplayName(username);
        setProfileName(username);
      }

      // Load auctions from local storage
      const savedAuctions = window.localStorage.getItem("global_auctions");
      if (savedAuctions) {
        const parsedAuctions = JSON.parse(savedAuctions);

        // Merge logic: normalize all auctions then overlay saved on top of mocks by id
        const auctionMap = new Map<string, Auction>();
        MOCK_SELLER_AUCTIONS.map(normalizeAuction).forEach(a => auctionMap.set(a.id, a));
        parsedAuctions.map(normalizeAuction).forEach((a: Auction) => auctionMap.set(a.id, a));

        setMyAuctions(Array.from(auctionMap.values()));
      }
    } catch {
      // ignore parse errors
    }
  }, []);



  // --- Derived State ---
  const filteredAuctions = myAuctions.filter(a => filterStatus === "all" || a.status === filterStatus);

  const totalEarnings = myAuctions
    .filter((a) => a.status === "sold")
    .reduce((sum, a) => sum + (Number(a.currentBid) || Number(a.startPrice) || 0), 0);

  const activeListings = myAuctions.filter(a => a.status === 'active').length;
  const totalViews = myAuctions.reduce((sum, a) => sum + (Number(a.views) || 0), 0);

  const navItems = [
    { label: "Overview", href: "/seller/dashboard", icon: LayoutDashboard },
    { label: "Create Auction", href: "/seller/create-auction", icon: PlusCircle },
    { label: "Orders & Payouts", href: "/seller/orders", icon: Wallet },
    { label: "Messages", href: "/seller/messages", icon: MessageCircle },
    { label: "Settings", href: "/seller/settings", icon: Settings },
  ];

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setProfileAvatar(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const safeName = profileName.trim() || "Seller";
    setDisplayName(safeName);
    setIsProfileModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Seller Dashboard
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your listings, track earnings, and reach more buyers.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/buyer/dashboard">
              <button className="rounded-xl bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20">
                Switch to Buyer View
              </button>
            </Link>
            <Link href="/seller/create-auction">
              <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600">
                + Create New Auction
              </button>
            </Link>
          </div>
        </header>

        <div className="flex w-full flex-col gap-6 items-start lg:flex-row">
          {/* Sidebar */}
          <aside
            className={`relative shrink-0 rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b1324] to-[#050914] backdrop-blur transition-all duration-300 ${
              isCollapsed ? "w-28 p-2" : "w-full lg:w-72 p-3"
            } min-h-[80vh]`}
          >
            <div className="flex h-full flex-col gap-3">
              <div className="flex items-center gap-3 pr-1">
                <div className="flex items-center gap-3">
                  {profileAvatar ? (
                    <img
                      src={profileAvatar}
                      alt="Profile"
                      className="h-10 w-10 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-white">
                      {(displayName || "S").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`flex flex-col transition-all duration-300 ${
                      isCollapsed
                        ? "pointer-events-none opacity-0 translate-x-1 w-0 max-w-0 overflow-hidden"
                        : "opacity-100 w-auto max-w-[180px]"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-wide text-white/50">Profile</p>
                    <p className="text-sm font-semibold text-white">{displayName || "Seller"}</p>
                    {!isCollapsed && (
                      <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="mt-1 w-fit rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/80 transition hover:border-emerald-400/60 hover:text-white"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
                <button
                  aria-label="Toggle sidebar"
                  onClick={() => setIsCollapsed((prev) => !prev)}
                  className="ml-auto rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:border-emerald-400/60 hover:text-emerald-200"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname?.startsWith(item.href);
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={`group flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? "border-emerald-400/60 bg-emerald-500/10 text-white shadow-[0_10px_30px_rgba(16,185,129,0.15)]"
                            : "border-white/10 text-white/70 hover:border-emerald-400/50 hover:text-white"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span
                          className={`transition-all duration-200 ${
                            isCollapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-xs"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div
                className={`overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/25 via-cyan-500/20 to-indigo-500/25 p-3 text-sm text-emerald-50 shadow-[0_12px_28px_rgba(16,185,129,0.16)] transition-all duration-300 ${
                  isCollapsed ? "pointer-events-none h-0 border-0 p-0 opacity-0" : "opacity-100"
                }`}
              >
                <p className="text-xs uppercase tracking-wide text-emerald-50/80">Boost reach</p>
                <p className="mt-1 text-sm font-semibold text-white">Promote a listing</p>
                <p className="mt-1 text-emerald-50/80">Feature your auction to appear in trending spots and get more bids.</p>
                <Link href="/seller/create-auction">
                  <button className="mt-3 w-full rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white">
                    Promote now
                  </button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Column */}
          <div className="flex-1 space-y-6 w-full">
            {/* Stats Section */}
            <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium text-slate-400">Total Earnings</p>
                <p className="mt-2 text-3xl font-bold text-emerald-400">${totalEarnings.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium text-slate-400">Active Listings</p>
                <p className="mt-2 text-3xl font-bold text-white">{activeListings}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium text-slate-400">Total Views</p>
                <p className="mt-2 text-3xl font-bold text-blue-400">{totalViews}</p>
              </div>
            </section>

            {/* Content Area */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">My Listings</h2>
                <div className="flex space-x-1 rounded-xl bg-white/5 p-1">
                  {(['all', 'active', 'sold', 'draft'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${filterStatus === status
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                        }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredAuctions.length === 0 ? (
                  <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                    <p className="text-slate-500">No auctions found in this category.</p>
                    <Link href="/seller/create-auction">
                      <button className="mt-4 text-emerald-400 hover:underline">
                        Create your first auction
                      </button>
                    </Link>
                  </div>
                ) : (
                  filteredAuctions.map(auction => {
                    // Calculate time left (mock logic for demo, real would differ)
                    const timeLeft = auction.status === 'active' ? '2d 14h' : auction.status === 'sold' ? 'Ended' : '-';

                    return (
                      <div key={auction.id} className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 font-sans">
                        {/* Image */}
                        <div className="relative w-full overflow-hidden border-b border-white/10 bg-black/30 aspect-[4/3]">
                          <img
                            src={auction.imageUrl}
                            alt={auction.title}
                            className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                          />
                          <div className="absolute top-3 right-3">
                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md ${auction.status === 'active' ? 'bg-emerald-500 text-black' :
                              auction.status === 'sold' ? 'bg-blue-500 text-white' :
                                'bg-slate-500 text-white'
                              }`}>
                              {auction.status}
                            </span>
                          </div>
                        </div>

                        {/* Content Body */}
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="text-xl font-semibold text-white leading-tight line-clamp-1">{auction.title}</h3>
                          <p className="mt-1 text-sm text-white/60">
                            {auction.category}
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                              <p className="text-xs uppercase tracking-wide text-white/50">
                                Current bid
                              </p>
                              <p className="text-lg font-semibold text-white">${auction.currentBid.toLocaleString()}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                              <p className="text-xs uppercase tracking-wide text-white/50">
                                Ends in
                              </p>
                              <p className="text-lg font-semibold text-white">{timeLeft}</p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-white/60">{auction.views} views</span>
                            <span className="text-emerald-300">Bid ready</span>
                          </div>

                          <Link href={`/seller/edit-auction/${auction.id}`}>
                            <button className="mt-5 w-full rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white/90 shadow-lg shadow-white/5">
                              Manage Listing
                            </button>
                          </Link>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#141820] p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold">Edit Profile</h3>
                <p className="mt-1 text-sm text-white/60">Update your name, email, and profile picture.</p>
              </div>
              <button
                aria-label="Close"
                onClick={() => setIsProfileModalOpen(false)}
                className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block space-y-2 text-sm font-semibold text-white/80">
                <span>Name</span>
                <input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-emerald-500/40 focus:ring"
                  placeholder="Your name"
                />
              </label>

              <div className="space-y-2 text-sm font-semibold text-white/80">
                <span>Profile Picture</span>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    {profileAvatar ? (
                      <img src={profileAvatar} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-white/60">No photo</span>
                    )}
                  </div>
                  <label className="flex-1 cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white/80 transition hover:border-emerald-400/60 hover:text-white">
                    Upload New Photo
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
              </div>

              <label className="block space-y-2 text-sm font-semibold text-white/80">
                <span>Email</span>
                <input
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-emerald-500/40 focus:ring"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <button
              onClick={handleSaveProfile}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

// Mimic the type from dashboard
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

// Mock data to fallback if not in local storage (sync with dashboard mock)
const MOCK_SELLER_AUCTIONS: Auction[] = [
    {
        id: "s1",
        title: "2021 Tesla Model 3 Long Range",
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
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=260&h=200",
        views: 340,
        createdAt: new Date(),
    },
];

export default function EditAuctionPage() {
    const router = useRouter();
    const params = useParams();
    const auctionId = params.id as string;

    const [formData, setFormData] = useState({
        title: "",
        category: "Watches",
        description: "",
        startPrice: "",
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [originalAuction, setOriginalAuction] = useState<any>(null); // Store full object to preserve other fields

    useEffect(() => {
        if (!auctionId || typeof window === "undefined") return;

        // 1. Try LocalStorage
        const savedAuctionsRaw = window.localStorage.getItem("global_auctions");
        let foundAuction = null;

        if (savedAuctionsRaw) {
            const savedAuctions = JSON.parse(savedAuctionsRaw);
            foundAuction = savedAuctions.find((a: any) => a.id === auctionId);
        }

        // 2. Try Mock Data if not found
        if (!foundAuction) {
            foundAuction = MOCK_SELLER_AUCTIONS.find((a) => a.id === auctionId);
        }

        if (foundAuction) {
            setFormData({
                title: foundAuction.title,
                category: foundAuction.category,
                description: foundAuction.description,
                startPrice: foundAuction.startPrice.toString(),
            });
            setPreviewUrl(foundAuction.imageUrl);
            setOriginalAuction(foundAuction);
        } else {
            // Handle Not Found?
            console.error("Auction not found");
        }

    }, [auctionId]);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mimic API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const updatedAuction = {
            ...originalAuction, // keep existing fields like status, views, etc.
            title: formData.title,
            category: formData.category,
            description: formData.description || "No description provided.",
            startPrice: Number(formData.startPrice),
            imageUrl: previewUrl || originalAuction?.imageUrl,
            // Note: In a real app we might not update 'currentBid' if it already has bids, 
            // but for simplicity we'll assume startPrice update might affect it if no bids, 
            // or just leave currentBid alone. Let's leave currentBid alone unless it's strictly equal to old startPrice?
            // Actually, safe to just update metadata.
        };

        // Save to LocalStorage
        try {
            const savedAuctionsRaw = window.localStorage.getItem("global_auctions");
            let savedAuctions = savedAuctionsRaw ? JSON.parse(savedAuctionsRaw) : [];

            // Logic: 
            // If it exists in savedAuctions, update it.
            // If it DOESN'T exist (it was a mock), add it to savedAuctions (so it overrides mock in dashboard).

            const index = savedAuctions.findIndex((a: any) => a.id === auctionId);

            if (index !== -1) {
                savedAuctions[index] = updatedAuction;
            } else {
                savedAuctions = [updatedAuction, ...savedAuctions];
            }

            window.localStorage.setItem("global_auctions", JSON.stringify(savedAuctions));

            alert("Auction updated successfully!");
            router.push("/seller/dashboard");
        } catch (err) {
            console.error("Failed to save auction locally:", err);
            setIsSubmitting(false);
        }
    };

    // Handle delete
    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            return;
        }

        try {
            const savedAuctionsRaw = window.localStorage.getItem("global_auctions");
            if (savedAuctionsRaw) {
                const savedAuctions = JSON.parse(savedAuctionsRaw);
                const newAuctions = savedAuctions.filter((a: any) => a.id !== auctionId);

                // If it was a mock auction that hadn't been saved yet, we just ensure it's "deleted" 
                // by adding it to a "deletedIds" list OR just not showing it if we were fully using LS.
                // But for this hybrid approach, if it's not in LS, we can't "delete" it from the hardcoded mocks 
                // without persisting a "deleted" state. 
                // SIMPLIFICATION: We will save the filtered list back. 
                // If the user tries to delete a MOCK that hasn't been edited (so not in LS), 
                // we technically need to add it to a "deleted_auctions" list in LS to filter it out from Dashboard.
                // allow me to implement that robustness:

                window.localStorage.setItem("global_auctions", JSON.stringify(newAuctions));

                // Track deleted mock IDs
                const deletedRaw = window.localStorage.getItem("deleted_auctions");
                const deletedIds = deletedRaw ? JSON.parse(deletedRaw) : [];
                if (!deletedIds.includes(auctionId)) {
                    deletedIds.push(auctionId);
                    window.localStorage.setItem("deleted_auctions", JSON.stringify(deletedIds));
                }
            } else {
                // No global auctions yet, so it must be a mock or fresh.
                // Just track as deleted
                const deletedRaw = window.localStorage.getItem("deleted_auctions");
                const deletedIds = deletedRaw ? JSON.parse(deletedRaw) : [];
                deletedIds.push(auctionId);
                window.localStorage.setItem("deleted_auctions", JSON.stringify(deletedIds));
            }

            alert("Auction deleted successfully.");
            router.push("/seller/dashboard");
        } catch (err) {
            console.error("Failed to delete auction:", err);
            alert("Failed to delete auction. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />

            <div className="w-full max-w-4xl space-y-8 relative z-10">

                {/* Header Section */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 text-emerald-400 mb-2">
                        <span className="text-2xl font-bold">✎</span>
                        <h1 className="text-3xl font-bold text-white">Edit Auction</h1>
                    </div>
                    <p className="text-slate-400">Update listing details</p>
                </div>

                {/* Main Form Card - Glassmorphism */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Item Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300">
                                Item Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/20 focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition"
                                placeholder="2018 BMW X5 xDrive35i"
                            />
                        </div>

                        {/* Category select */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300">
                                Category <span className="text-rose-400">*</span>
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition appearance-none [&>option]:bg-[#0B1121]"
                            >
                                <option value="Watches">Watches</option>
                                <option value="Vehicles">Vehicles</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Real Estate">Real Estate</option>
                                <option value="Art & Editions">Art & Editions</option>
                                <option value="Computers">Computers</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300">
                                Description
                            </label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/20 focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition resize-none"
                                placeholder="Luxury SUV with 62,000 miles. Panoramic sunroof, heated seats, and navigation..."
                            />
                        </div>

                        {/* Starting Price */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300">
                                Starting Price <span className="text-rose-400">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                                <input
                                    required
                                    type="number"
                                    value={formData.startPrice}
                                    onChange={(e) => setFormData({ ...formData, startPrice: e.target.value })}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-4 py-3 text-white placeholder:text-white/20 focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition"
                                    placeholder="100000"
                                />
                            </div>
                        </div>

                        {/* Item Image */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300">
                                Item Image
                            </label>

                            <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-12 text-center transition hover:border-emerald-500/50 hover:bg-white/10">
                                {previewUrl ? (
                                    <div className="relative w-64 h-48 overflow-hidden rounded-lg shadow-md group">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => setPreviewUrl(null)}
                                                className="bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition backdrop-blur-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-4 rounded-full bg-white/5 p-4 text-slate-400">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        </div>
                                        <span className="text-sm font-medium text-slate-400">Change Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4">
                            <Link href="/seller/dashboard">
                                <button
                                    type="button"
                                    className="px-6 py-3 text-sm font-semibold text-slate-400 hover:text-white transition"
                                >
                                    ← Cancel
                                </button>
                            </Link>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white transition"
                                >
                                    DELETE LISTING
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-xl bg-emerald-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:shadow-emerald-500/40 transition disabled:opacity-70 flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            SAVING...
                                        </>
                                    ) : "SAVE CHANGES"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

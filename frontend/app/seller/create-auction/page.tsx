"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateAuctionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        category: "Watches",
        description: "",
        startPrice: "",
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        const newAuction = {
            id: Math.random().toString(36).substr(2, 9),
            title: formData.title,
            category: formData.category,
            description: formData.description || "No description provided.",
            startPrice: Number(formData.startPrice),
            currentBid: Number(formData.startPrice),
            status: "active",
            startTime: new Date(),
            endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
            bidsCount: 0,
            imageUrl: previewUrl || "https://images.unsplash.com/photo-1550259114-ad7188f0a967?auto=format&fit=crop&q=80&w=260&h=200",
            views: 0,
            createdAt: new Date(),
        };

        // Save to LocalStorage
        try {
            const savedAuctionsRaw = window.localStorage.getItem("global_auctions");
            const savedAuctions = savedAuctionsRaw ? JSON.parse(savedAuctionsRaw) : [];
            const newGlobalAuctions = [newAuction, ...savedAuctions];
            window.localStorage.setItem("global_auctions", JSON.stringify(newGlobalAuctions));

            alert("Auction item added successfully!");
            router.push("/seller/dashboard");
        } catch (err) {
            console.error("Failed to save auction locally:", err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#040918] px-4 py-8 text-white sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-4xl space-y-8">

                {/* Header Section */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 text-emerald-400 mb-2">
                        <span className="text-2xl font-bold">+</span>
                        <h1 className="text-3xl font-bold text-white">Add New Auction</h1>
                    </div>
                    <p className="text-slate-400">Create a new auction item for bidding</p>
                </div>

                {/* Main Form Card */}
                <div className="rounded-3xl bg-white p-8 text-slate-900 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Item Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">
                                Item Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                                placeholder="2018 BMW X5 xDrive35i"
                            />
                        </div>

                        {/* Category select (Hidden requirement but needed for data) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition appearance-none"
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
                            <label className="block text-sm font-semibold text-slate-700">
                                Description
                            </label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition resize-none"
                                placeholder="Luxury SUV with 62,000 miles. Panoramic sunroof, heated seats, and navigation..."
                            />
                        </div>

                        {/* Starting Price */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">
                                Starting Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                                <input
                                    required
                                    type="number"
                                    value={formData.startPrice}
                                    onChange={(e) => setFormData({ ...formData, startPrice: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                                    placeholder="100000"
                                />
                            </div>
                        </div>

                        {/* Item Image */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">
                                Item Image
                            </label>

                            <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center transition hover:border-blue-500 hover:bg-blue-50">
                                {previewUrl ? (
                                    <div className="relative w-64 h-48 overflow-hidden rounded-lg shadow-md group">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => setPreviewUrl(null)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-4 rounded-full bg-slate-200 p-4 text-slate-400">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">Change Image</span>
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
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Link href="/seller/dashboard">
                                <button
                                    type="button"
                                    className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
                                >
                                    ← Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40 transition disabled:opacity-70 flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        CREATING AUCTION...
                                    </>
                                ) : "CREATE AUCTION"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

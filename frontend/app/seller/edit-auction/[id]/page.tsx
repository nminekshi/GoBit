"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { auctionAPI, categorySlugToName, categoryNameToSlug } from "../../../lib/api";

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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!auctionId) return;

        const loadAuction = async () => {
            setIsLoading(true);
            try {
                const auction = await auctionAPI.fetchAuctionById(auctionId);
                if (auction) {
                    setFormData({
                        title: auction.title,
                        category: categorySlugToName(auction.category),
                        description: auction.description || "",
                        startPrice: auction.startPrice.toString(),
                    });
                    setPreviewUrl(auction.imageUrl);
                } else {
                    setError("Auction not found.");
                }
            } catch (err) {
                console.error("Error loading auction:", err);
                setError("Failed to load auction data.");
            } finally {
                setIsLoading(false);
            }
        };

        loadAuction();
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
        setError(null);

        try {
            await auctionAPI.updateAuction(auctionId, {
                title: formData.title,
                category: categoryNameToSlug(formData.category),
                description: formData.description,
                startPrice: Number(formData.startPrice),
                imageUrl: previewUrl || undefined,
            });

            alert("Auction updated successfully!");
            router.push("/seller/dashboard");
        } catch (err: any) {
            console.error("Failed to update auction:", err);
            setError(err.message || "Failed to update auction. Please try again.");
            setIsSubmitting(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            return;
        }

        setIsSubmitting(true);
        try {
            await auctionAPI.deleteAuction(auctionId);
            alert("Auction deleted successfully.");
            router.push("/seller/dashboard");
        } catch (err: any) {
            console.error("Failed to delete auction:", err);
            alert(err.message || "Failed to delete auction. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#040918]">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-white/60">Loading auction details...</p>
                </div>
            </div>
        );
    }

    if (error && !isSubmitting) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#040918] px-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center max-w-md">
                    <p className="text-rose-400 mb-6">{error}</p>
                    <Link href="/seller/dashboard">
                        <button className="rounded-xl bg-white/10 px-6 py-2 text-sm font-semibold text-white hover:bg-white/20 transition">
                            Return to Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

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
                                    <div className="relative w-full max-w-xl aspect-video overflow-hidden rounded-xl shadow-2xl border border-white/10 bg-black/40 group">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
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
                                    disabled={isSubmitting}
                                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white transition disabled:opacity-50"
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

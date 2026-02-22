// API base URL - adjust based on environment
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:4000";

export type AuctionType = "normal" | "live";

// Helper function to get user ID from localStorage
const getUserId = (): string | null => {
    if (typeof window === "undefined") return null;
    try {
        const authData = window.localStorage.getItem("auth");
        if (!authData) return null;
        const parsed = JSON.parse(authData);
        return parsed?.user?._id || parsed?.user?.id || null;
    } catch {
        return null;
    }
};

// Auction API functions
export const auctionAPI = {
    // Fetch all auctions or filter by category
    async fetchAuctions(category?: string, status?: string, auctionType?: AuctionType): Promise<any[]> {
        try {
            let url = `${API_BASE_URL}/auctions`;
            const params = new URLSearchParams();
            if (category) params.append("category", category);
            if (status) params.append("status", status);
            if (auctionType) params.append("auctionType", auctionType);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch auctions");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching auctions:", error);
            return [];
        }
    },

    // Fetch auctions by category (alternative endpoint)
    async fetchAuctionsByCategory(category: string): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/auctions/category/${category}`);
            if (!response.ok) {
                throw new Error("Failed to fetch auctions");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching auctions by category:", error);
            return [];
        }
    },

    // Fetch single auction by ID
    async fetchAuctionById(id: string): Promise<any | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/auctions/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch auction");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching auction:", error);
            return null;
        }
    },

    // Create new auction
    async createAuction(data: {
        title: string;
        description?: string;
        category: string;
        startPrice: number;
        imageUrl?: string;
        endTime?: Date;
        details?: Record<string, string>;
        auctionType?: AuctionType;
        liveDurationSeconds?: number;
        liveAutoExtendSeconds?: number;
        liveExtendThresholdSeconds?: number;
        liveStartTime?: Date;
    }): Promise<any | null> {
        try {
            const userId = getUserId();
            if (!userId) {
                throw new Error("User not authenticated");
            }

            const response = await fetch(`${API_BASE_URL}/auctions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create auction");
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating auction:", error);
            throw error;
        }
    },

    // Update auction
    async updateAuction(
        id: string,
        data: {
            title?: string;
            description?: string;
            category?: string;
            startPrice?: number;
            imageUrl?: string;
            status?: string;
            endTime?: Date;
            commission?: number;
            isVerified?: boolean;
        }
    ): Promise<any | null> {
        try {
            const userId = getUserId();
            if (!userId) {
                throw new Error("User not authenticated");
            }

            const response = await fetch(`${API_BASE_URL}/auctions/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update auction");
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating auction:", error);
            throw error;
        }
    },

    // Delete auction
    async deleteAuction(id: string): Promise<boolean> {
        try {
            const userId = getUserId();
            if (!userId) {
                throw new Error("User not authenticated");
            }

            const response = await fetch(`${API_BASE_URL}/auctions/${id}`, {
                method: "DELETE",
                headers: {
                    "x-user-id": userId,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete auction");
            }

            return true;
        } catch (error) {
            console.error("Error deleting auction:", error);
            throw error;
        }
    },

    // Fetch auctions by seller
    async fetchSellerAuctions(sellerId: string): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/auctions/seller/${sellerId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch seller auctions");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching seller auctions:", error);
            return [];
        }
    },

    // Place a bid on an auction
    async placeBid(id: string, bidAmount: number): Promise<any> {
        try {
            const userId = getUserId();
            if (!userId) throw new Error("User not authenticated");

            const response = await fetch(`${API_BASE_URL}/auctions/${id}/bid`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                },
                body: JSON.stringify({ bidAmount }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to place bid");
            }
            return await response.json();
        } catch (error) {
            console.error("Error placing bid:", error);
            throw error;
        }
    },

    // Toggle watchlist for an auction
    async toggleWatchlist(id: string): Promise<{ message: string; isWatched: boolean }> {
        try {
            const userId = getUserId();
            if (!userId) throw new Error("User not authenticated");

            const response = await fetch(`${API_BASE_URL}/auctions/${id}/watch`, {
                method: "POST",
                headers: {
                    "x-user-id": userId,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update watchlist");
            }
            return await response.json();
        } catch (error) {
            console.error("Error toggling watchlist:", error);
            throw error;
        }
    },

    async claimAuction(id: string): Promise<{ message: string; claimedAt?: string; checkoutPath?: string }> {
        const userId = getUserId();
        if (!userId) throw new Error("User not authenticated");

        const res = await fetch(`${API_BASE_URL}/auctions/${id}/claim`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-user-id": userId },
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data?.error || "Failed to claim item");
        }
        return data;
    },

    async payAuction(id: string): Promise<{ message: string; orderId?: string; paidAt?: string }> {
        const userId = getUserId();
        if (!userId) throw new Error("User not authenticated");

        const res = await fetch(`${API_BASE_URL}/auctions/${id}/pay`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-user-id": userId },
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data?.error || "Payment failed");
        }
        return data;
    },

    // Create PayHere sandbox payment session
    async createPayHereSession(id: string): Promise<{
        merchantId: string;
        hash: string;
        orderId: string;
        amount: string;
        currency: string;
        items: string;
        firstName: string;
        lastName?: string;
        email?: string;
        phone?: string;
    }> {
        const userId = getUserId();
        if (!userId) throw new Error("User not authenticated");

        const res = await fetch(`${API_BASE_URL}/auctions/${id}/payhere/session`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-user-id": userId },
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data?.error || "Failed to create PayHere session");
        }
        return data;
    },

    // Fetch auctions where user has bid
    async fetchMyBids(): Promise<any[]> {
        try {
            const userId = getUserId();
            if (!userId) return [];

            const response = await fetch(`${API_BASE_URL}/auctions/my/bids`, {
                headers: { "x-user-id": userId },
            });
            if (!response.ok) throw new Error("Failed to fetch your bids");
            return await response.json();
        } catch (error) {
            console.error("Error fetching my bids:", error);
            return [];
        }
    },

    // Fetch user's watchlist
    async fetchMyWatchlist(): Promise<any[]> {
        try {
            const userId = getUserId();
            if (!userId) return [];

            const response = await fetch(`${API_BASE_URL}/auctions/my/watchlist`, {
                headers: { "x-user-id": userId },
            });
            if (!response.ok) throw new Error("Failed to fetch watchlist");
            return await response.json();
        } catch (error) {
            console.error("Error fetching my watchlist:", error);
            return [];
        }
    },

    // Fetch buyer summary stats
    async fetchBuyerSummary(): Promise<{ activeBidsCount: number; watchlistCount: number; wonCount: number }> {
        try {
            const userId = getUserId();
            if (!userId) return { activeBidsCount: 0, watchlistCount: 0, wonCount: 0 };

            const response = await fetch(`${API_BASE_URL}/auctions/my/summary`, {
                headers: { "x-user-id": userId },
            });
            if (!response.ok) throw new Error("Failed to fetch summary");
            return await response.json();
        } catch (error) {
            console.error("Error fetching buyer summary:", error);
            return { activeBidsCount: 0, watchlistCount: 0, wonCount: 0 };
        }
    },
};

// Helper function to map category display names to slugs
export const categoryNameToSlug = (name: string): string => {
    const mapping: { [key: string]: string } = {
        "Watches": "watches",
        "Vehicles": "vehicles",
        "Electronics": "electronics",
        "Real Estate": "realestate",
        "Art & Editions": "art",
        "Computers": "computers",
    };
    return mapping[name] || name.toLowerCase().replace(/\s+/g, "");
};

// Helper function to map category slugs to display names
export const categorySlugToName = (slug: string): string => {
    const mapping: { [key: string]: string } = {
        "watches": "Watches",
        "vehicles": "Vehicles",
        "electronics": "Electronics",
        "realestate": "Real Estate",
        "art": "Art & Editions",
        "computers": "Computers",
    };
    return mapping[slug] || slug;
};

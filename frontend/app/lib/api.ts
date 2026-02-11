// API base URL - adjust based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
    async fetchAuctions(category?: string): Promise<any[]> {
        try {
            const url = category
                ? `${API_BASE_URL}/auctions?category=${category}`
                : `${API_BASE_URL}/auctions`;

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
            imageUrl?: string;
            status?: string;
            endTime?: Date;
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

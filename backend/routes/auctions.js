const express = require("express");
const router = express.Router();
const Auction = require("../models/Auction");

const mongoose = require("mongoose");
const User = require("../models/User");

// Middleware to verify authentication (simple version - you may want to enhance this)
const authenticate = async (req, res, next) => {
    try {
        // For now, we'll accept a userId in the request body or headers
        // In production, you'd verify a JWT token here
        const userId = req.headers["x-user-id"] || req.body.userId;

        if (!userId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        // Optionally verify user exists (recommended for production)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.userId = userId;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({ error: "Authentication failed" });
    }
};

// GET /auctions - Get all auctions (with optional category filter)
router.get("/", async (req, res) => {
    try {
        const { category, status } = req.query;
        const filter = {};

        if (category) {
            filter.category = category.toLowerCase();
        }

        if (status) {
            filter.status = status;
        } else {
            // By default, only show active auctions
            filter.status = "active";
        }

        const auctions = await Auction.find(filter)
            .populate("sellerId", "username email")
            .sort({ createdAt: -1 });

        res.json(auctions);
    } catch (error) {
        console.error("Error fetching auctions:", error);
        res.status(500).json({ error: "Failed to fetch auctions" });
    }
});

// GET /auctions/category/:category - Get auctions by category
router.get("/category/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const auctions = await Auction.find({
            category: category.toLowerCase(),
            status: "active"
        })
            .populate("sellerId", "username email")
            .sort({ createdAt: -1 });

        res.json(auctions);
    } catch (error) {
        console.error("Error fetching auctions by category:", error);
        res.status(500).json({ error: "Failed to fetch auctions" });
    }
});

// GET /auctions/my/summary - Get summary stats for buyer dashboard
router.get("/my/summary", authenticate, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const activeBidsCount = await Auction.countDocuments({
            "bids.bidderId": userId,
            status: "active"
        });

        const user = await User.findById(req.userId);
        const watchlistCount = user ? user.watchlist.length : 0;

        const wonCount = await Auction.countDocuments({
            "bids.0.bidderId": userId,
            status: "completed"
        });

        res.json({
            activeBidsCount,
            watchlistCount,
            wonCount
        });
    } catch (error) {
        console.error("Error fetching buyer summary:", error);
        res.status(500).json({ error: "Failed to fetch summary" });
    }
});

// GET /auctions/my/bids - Get auctions where the user has placed bids
router.get("/my/bids", authenticate, async (req, res) => {
    try {
        const auctions = await Auction.find({
            "bids.bidderId": req.userId
        })
            .populate("sellerId", "username email")
            .sort({ updatedAt: -1 });

        res.json(auctions);
    } catch (error) {
        console.error("Error fetching user bids:", error);
        res.status(500).json({ error: "Failed to fetch your bids" });
    }
});

// GET /auctions/my/watchlist - Get auctions in the user's watchlist
router.get("/my/watchlist", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: "watchlist",
            populate: { path: "sellerId", select: "username email" }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user.watchlist);
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        res.status(500).json({ error: "Failed to fetch watchlist" });
    }
});

// GET /auctions/:id - Get single auction
router.get("/:id", async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id)
            .populate("sellerId", "username email");

        if (!auction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        // Increment view count
        auction.views += 1;
        await auction.save();

        res.json(auction);
    } catch (error) {
        console.error("Error fetching auction:", error);
        res.status(500).json({ error: "Failed to fetch auction" });
    }
});

// POST /auctions - Create new auction (authenticated sellers only)
router.post("/", authenticate, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            startPrice,
            imageUrl,
            endTime,
        } = req.body;

        // Validate required fields
        if (!title || !category || !startPrice) {
            return res.status(400).json({
                error: "Missing required fields: title, category, and startPrice are required"
            });
        }

        // Set default end time if not provided (7 days from now)
        const auctionEndTime = endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const auction = new Auction({
            title,
            description,
            category: category.toLowerCase(),
            startPrice: Number(startPrice),
            currentBid: Number(startPrice),
            imageUrl,
            endTime: auctionEndTime,
            sellerId: req.userId,
        });

        await auction.save();

        // Populate seller info before returning
        await auction.populate("sellerId", "username email");

        res.status(201).json(auction);
    } catch (error) {
        console.error("Error creating auction:", error);
        res.status(500).json({ error: "Failed to create auction" });
    }
});

// PUT /auctions/:id - Update auction (authenticated sellers only)
router.put("/:id", authenticate, async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);

        if (!auction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        // Verify the user is the seller
        if (auction.sellerId.toString() !== req.userId) {
            return res.status(403).json({ error: "Not authorized to update this auction" });
        }

        // Update allowed fields
        const allowedUpdates = ["title", "description", "imageUrl", "status", "endTime", "category", "startPrice"];
        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                if (key === "category" && typeof req.body[key] === "string") {
                    auction[key] = req.body[key].toLowerCase();
                } else if (key === "startPrice") {
                    auction[key] = Number(req.body[key]);
                } else {
                    auction[key] = req.body[key];
                }
            }
        });

        await auction.save();
        await auction.populate("sellerId", "username email");

        res.json(auction);
    } catch (error) {
        console.error("Error updating auction:", error);
        res.status(500).json({ error: "Failed to update auction" });
    }
});

// DELETE /auctions/:id - Delete auction (authenticated sellers only)
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);

        if (!auction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        // Verify the user is the seller
        if (auction.sellerId.toString() !== req.userId) {
            return res.status(403).json({ error: "Not authorized to delete this auction" });
        }

        await Auction.findByIdAndDelete(req.params.id);

        res.json({ message: "Auction deleted successfully" });
    } catch (error) {
        console.error("Error deleting auction:", error);
        res.status(500).json({ error: "Failed to delete auction" });
    }
});

// POST /auctions/:id/bid - Place a bid on an auction
router.post("/:id/bid", authenticate, async (req, res) => {
    try {
        const { bidAmount } = req.body;
        const auction = await Auction.findById(req.params.id);

        if (!auction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        if (auction.status !== "active") {
            return res.status(400).json({ error: "This auction is no longer active" });
        }

        if (auction.sellerId.toString() === req.userId) {
            return res.status(400).json({ error: "Sellers cannot bid on their own auctions" });
        }

        if (Number(bidAmount) <= auction.currentBid) {
            return res.status(400).json({ error: `Bid must be higher than current bid of $${auction.currentBid}` });
        }

        // Add bid to history
        auction.bids.push({
            bidderId: req.userId,
            bidAmount: Number(bidAmount),
            timestamp: new Date()
        });

        // Update current stats
        auction.currentBid = Number(bidAmount);
        auction.bidsCount += 1;

        await auction.save();
        await auction.populate("sellerId", "username email");

        res.json(auction);
    } catch (error) {
        console.error("Error placing bid:", error);
        res.status(500).json({ error: "Failed to place bid" });
    }
});

// POST /auctions/:id/watch - Toggle watchlist for an auction
router.post("/:id/watch", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const auctionId = req.params.id;
        const index = user.watchlist.indexOf(auctionId);

        if (index > -1) {
            // Remove from watchlist
            user.watchlist.splice(index, 1);
            await user.save();
            res.json({ message: "Removed from watchlist", isWatched: false });
        } else {
            // Add to watchlist
            user.watchlist.push(auctionId);
            await user.save();
            res.json({ message: "Added to watchlist", isWatched: true });
        }
    } catch (error) {
        console.error("Error toggling watchlist:", error);
        res.status(500).json({ error: "Failed to update watchlist" });
    }
});



// GET /auctions/seller/:sellerId - Get auctions by seller
router.get("/seller/:sellerId", async (req, res) => {
    try {
        const auctions = await Auction.find({ sellerId: req.params.sellerId })
            .populate("sellerId", "username email")
            .sort({ createdAt: -1 });

        res.json(auctions);
    } catch (error) {
        console.error("Error fetching seller auctions:", error);
        res.status(500).json({ error: "Failed to fetch seller auctions" });
    }
});

module.exports = router;

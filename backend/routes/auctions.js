const express = require("express");
const router = express.Router();
const Auction = require("../models/Auction");

// Middleware to verify authentication (simple version - you may want to enhance this)
const authenticate = (req, res, next) => {
    // For now, we'll accept a userId in the request body or headers
    // In production, you'd verify a JWT token here
    const userId = req.headers["x-user-id"] || req.body.userId;
    if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
    }
    req.userId = userId;
    next();
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
        const allowedUpdates = ["title", "description", "imageUrl", "status", "endTime"];
        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                auction[key] = req.body[key];
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

const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Auction = require("../models/Auction");
const {
    placeBid: placeBidService,
    buildLiveAuctionConfig,
    LIVE_ENABLED_CATEGORIES,
    completeAuction,
    sendPaymentConfirmationEmailOnce,
    processSmartAgentsByAuction,
    processSmartAgentBySetting,
    getSmartAgentOverviewForUser,
} = require("../services/auctionService");
const SmartAutoBidAgent = require("../models/SmartAutoBidAgent");

const mongoose = require("mongoose");
const User = require("../models/User");

// Ensure we correctly resolve the winner before payment-related actions
async function ensureWinnerAssignment(auction, userId) {
    // If auction already has a winner, nothing to do
    if (auction?.winnerId) return auction;

    // Fallback: if there are bids, promote the latest bidder as winner
    const latestBid = auction?.bids?.length ? auction.bids[auction.bids.length - 1] : null;
    if (latestBid?.bidderId) {
        auction.winnerId = latestBid.bidderId;
        await auction.save();
        await auction.populate("winnerId", "username email phone");

        // If the caller is the latest bidder, keep using this instance
        if (latestBid.bidderId.toString() === userId) {
            return auction;
        }
    }

    return auction;
}

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
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
};

// Middleware for Admin access
const isAdmin = async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ error: "Access denied. Admins only." });
    }
};

// Helper to compute MD5 uppercase signatures (used for PayHere callbacks)
const md5Upper = (text) => crypto.createHash("md5").update(text).digest("hex").toUpperCase();

// Diagnostic route
router.get("/debug/auth-status", authenticate, (req, res) => {
    res.json({
        message: "You are authenticated",
        userId: req.userId,
        role: req.user?.role,
        userObject: {
            username: req.user?.username,
            role: req.user?.role,
            _id: req.user?._id
        }
    });
});

// POST /auctions/admin/send-report
router.post("/admin/send-report", authenticate, isAdmin, async (req, res) => {
    try {
        const { email, report, frequency } = req.body;
        if (!email || !report) return res.status(400).json({ error: "Missing parameters" });

        // Transport config
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let csvContent = "";
        let filename = "";
        let subject = "";

        // Build report text just like the frontend
        if (report === "R-2201") {
            const auctions = await Auction.find({}).lean();
            csvContent = "Auction ID,Title,Status,Category,Start Price (USD),Current Bid (USD),Total Bids,End Time\n";
            auctions.forEach(a => {
                csvContent += `${a._id},"${a.title}",${a.status},${a.category},${a.startPrice},${a.currentBid},${a.bids?.length || 0},${a.endTime}\n`;
            });
            filename = "gobit-weekly-performance.csv";
            subject = "GoBit Admin Report: Weekly Performance CRON";
        } else if (report === "R-2200") {
            const auctions = await Auction.find({ "bids.isSuspicious": true }).populate("bids.bidderId", "username email");
            csvContent = "Bid ID,Auction ID,Auction Title,Bidder Username,Bid Amount (USD),ML Risk Score,Triggered Flags\n";
            auctions.forEach(a => {
                const flags = a.bids.filter(b => b.isSuspicious);
                flags.forEach(b => {
                    csvContent += `${b._id},${a._id},"${a.title}",${b.bidderId?.username || "Unknown"},${b.bidAmount},${b.riskScore},"${b.flags.join(" | ")}"\n`;
                });
            });
            filename = "gobit-ml-fraud-report.csv";
            subject = "GoBit Admin Report: Machine Learning Fraud Intercepts CRON";
        } else {
            const auctions = await Auction.find({ currentBid: { $gt: 0 } }).lean();
            csvContent = "Auction ID,Title,Seller ID,Winner ID,Status,Gross Merchandise Value (USD)\n";
            auctions.forEach(a => {
                csvContent += `${a._id},"${a.title}",${a.seller},${a.winner || "None"},${a.status},${a.currentBid}\n`;
            });
            filename = "gobit-financial-revenue.csv";
            subject = "GoBit Admin Report: Gross Merchandise Volume (GMV) CRON";
        }

        // Setup email payload
        const mailOptions = {
            from: process.env.EMAIL_USER || "admin@gobit.com",
            to: email,
            subject: subject,
            text: `Hello Admin,\n\nYour automated ${frequency} report has been generated directly from the MongoDB cluster.\n\nAttached is the requested data CSV file.\n\nBest,\nGoBit Automated CRON System`,
            attachments: [
                {
                    filename: filename,
                    content: csvContent,
                    contentType: 'text/csv'
                }
            ]
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email sent successfully" });

    } catch (error) {
        console.error("Error sending report email:", error);
        res.status(500).json({ error: "Failed to dispatch email. Please ensure .env EMAIL_USER and EMAIL_PASS are configured." });
    }
});

// GET /auctions/admin/dashboard-stats
router.get("/admin/dashboard-stats", authenticate, isAdmin, async (req, res) => {
    try {
        const activeAuctions = await Auction.countDocuments({ status: "active" });
        const totalUsers = await User.countDocuments();

        // Sum currentBid for GMV
        const gmvResult = await Auction.aggregate([
            { $match: { currentBid: { $gt: 0 } } },
            { $group: { _id: null, totalVolume: { $sum: "$currentBid" } } }
        ]);
        const gmv = gmvResult.length > 0 ? gmvResult[0].totalVolume : 0;

        // ML Intercepts count
        const flaggedAuctions = await Auction.find({ "bids.isSuspicious": true });
        let totalIntercepts = 0;
        flaggedAuctions.forEach(auction => {
            const flags = auction.bids.filter(b => b.isSuspicious);
            totalIntercepts += flags.length;
        });

        // Live Activity: getting recent bids
        let allBids = [];
        const allAuctions = await Auction.find({ "bids.0": { $exists: true } }).select("title bids").lean();
        allAuctions.forEach(a => {
            if (a.bids) {
                a.bids.forEach(b => {
                    allBids.push({
                        time: new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        fullTime: new Date(b.timestamp).toISOString(),
                        message: `New bid $${b.bidAmount} on ${a.title}`,
                        tag: b.isSuspicious ? "Security" : "Live"
                    });
                });
            }
        });

        allBids.sort((a, b) => new Date(b.fullTime) - new Date(a.fullTime));
        const liveActivity = allBids.slice(0, 4);

        // Recent Transactions: Top active/closed auctions
        const recentTransactions = await Auction.find({}, "title currentBid status")
            .sort({ currentBid: -1 })
            .limit(4)
            .lean()
            .then(docs => docs.map(d => ({
                id: d._id.toString().substring(18).toUpperCase(),
                item: d.title,
                amount: `$${(d.currentBid || 0).toLocaleString()}`,
                status: d.status === "closed" ? "Paid" : "Pending"
            })));

        // Pending Approvals (Active Auctions or Pending Users proxy)
        const pendingAuctions = await Auction.find({ status: "pending" }, "title seller")
            .populate("seller", "username").lean().limit(4);

        let pendingApprovals = pendingAuctions.map(a => ({
            id: "A-" + a._id.toString().substring(18).toUpperCase(),
            title: a.title,
            seller: a.seller?.username || "Unknown",
            type: "Auction"
        }));

        // CHART DATA: Top 5 auctions by current bid for bar chart
        const topAuctions = await Auction.find({ currentBid: { $gt: 0 } }, "title currentBid category")
            .sort({ currentBid: -1 })
            .limit(5)
            .lean()
            .then(docs => docs.map(d => ({
                title: d.title?.length > 20 ? d.title.substring(0, 20) + "..." : d.title,
                value: d.currentBid || 0,
                category: d.category || "other"
            })));

        // CHART DATA: ML Risk Score Distribution
        const riskBuckets = { "0-20": 0, "20-40": 0, "40-60": 0, "60-80": 0, "80-100": 0 };
        const allAuctionsForRisk = await Auction.find({ "bids.0": { $exists: true } }).select("bids").lean();
        allAuctionsForRisk.forEach(a => {
            if (a.bids) {
                a.bids.forEach(b => {
                    const score = b.riskScore || 0;
                    if (score < 20) riskBuckets["0-20"]++;
                    else if (score < 40) riskBuckets["20-40"]++;
                    else if (score < 60) riskBuckets["40-60"]++;
                    else if (score < 80) riskBuckets["60-80"]++;
                    else riskBuckets["80-100"]++;
                });
            }
        });
        const riskDistribution = Object.entries(riskBuckets).map(([range, count]) => ({ range, count }));

        res.json({
            activeAuctions,
            totalUsers,
            gmv,
            totalIntercepts,
            liveActivity,
            recentTransactions,
            pendingApprovals,
            topAuctions,
            riskDistribution
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
});

// GET /auctions/admin/suspicious-bids - Get all suspicious bids
router.get("/admin/suspicious-bids", authenticate, isAdmin, async (req, res) => {
    try {
        const auctions = await Auction.find({ "bids.isSuspicious": true })
            .populate("bids.bidderId", "username email");

        let suspiciousBids = [];
        auctions.forEach(auction => {
            const flags = auction.bids.filter(b => b.isSuspicious);
            flags.forEach(bid => {
                suspiciousBids.push({
                    _id: bid._id,
                    auctionId: auction._id,
                    auctionTitle: auction.title,
                    bidder: bid.bidderId,
                    bidAmount: bid.bidAmount,
                    riskScore: bid.riskScore,
                    flags: bid.flags,
                    timestamp: bid.timestamp,
                });
            });
        });

        // Sort by highest risk score first
        suspiciousBids.sort((a, b) => b.riskScore - a.riskScore);

        res.json(suspiciousBids);
    } catch (error) {
        console.error("Error fetching suspicious bids:", error);
        res.status(500).json({ error: "Failed to fetch suspicious bids" });
    }
});

// GET /auctions - Get all auctions (with optional category filter)
router.get("/", async (req, res) => {
    try {
        const { category, status, auctionType } = req.query;
        const filter = {};

        if (category) {
            filter.category = category.toLowerCase();
        }

        if (auctionType === "live") {
            filter.auctionType = "live";
        } else if (auctionType === "normal") {
            filter.auctionType = "normal";
        }

        if (status) {
            if (status !== "all") {
                filter.status = status;
            }
            // If status is "all", we don't add status to filter, so it finds all
        } else {
            // By default, only show active auctions
            filter.status = "active";
        }

        const auctions = await Auction.find(filter)
            .populate("sellerId", "username email")
            .populate("winnerId", "username email")
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
            .populate("winnerId", "username email")
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

        // Count auctions the user actually won (winnerId matches user and auction is finished)
        const wonCount = await Auction.countDocuments({
            winnerId: userId,
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
            .populate("winnerId", "username email")
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
            populate: [{ path: "sellerId", select: "username email" }, { path: "winnerId", select: "username email" }]
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
        let auction = await Auction.findById(req.params.id)
            .populate("sellerId", "username email")
            .populate("bids.bidderId", "username")
            .populate("winnerId", "username email");

        if (!auction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        // If auction should be completed (time passed) but status is still active, finalize it
        if (auction.status === "active" && auction.endTime && new Date() >= new Date(auction.endTime)) {
            auction = await completeAuction(auction);
            await auction.populate("winnerId", "username email");
        }

        // Ensure winnerId is set (fallback to latest bid) for clients that need winner to proceed
        auction = await ensureWinnerAssignment(auction, undefined);

        // Attach a lightweight debug snapshot to help the client decide
        const latestBid = auction.bids?.length ? auction.bids[auction.bids.length - 1] : null;
        const debug = {
            status: auction.status,
            winnerId: auction.winnerId?._id || auction.winnerId,
            latestBidderId: latestBid?.bidderId,
            bidsCount: auction.bids?.length || 0,
        };

        // Increment view count
        auction.views += 1;
        await auction.save();

        // Flatten map fields (like details) so frontend can access keys via object indexing.
        const auctionObject = auction.toObject({ flattenMaps: true });

        // Return auction plus a minimal debug section to inspect winner assignment on the client
        res.json({ ...auctionObject, _debugWinner: debug });
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
            details,
            auctionType,
            liveDurationSeconds,
            liveAutoExtendSeconds,
            liveExtendThresholdSeconds,
            liveStartTime,
            startTime,
        } = req.body;

        // Validate required fields
        if (!title || !category || !startPrice) {
            return res.status(400).json({
                error: "Missing required fields: title, category, and startPrice are required"
            });
        }

        const normalizedCategory = category.toLowerCase();
        const isLiveRequested = auctionType === "live" && LIVE_ENABLED_CATEGORIES.includes(normalizedCategory);

        const startAt = startTime ? new Date(startTime) : new Date();

        // Set default end time if not provided (7 days from now)
        const auctionEndTime = endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const baseAuction = {
            title,
            description,
            category: normalizedCategory,
            startPrice: Number(startPrice),
            currentBid: Number(startPrice),
            imageUrl,
            endTime: auctionEndTime,
            sellerId: req.userId,
            details: details || {},
            startTime: startAt,
        };

        if (isLiveRequested) {
            Object.assign(
                baseAuction,
                buildLiveAuctionConfig({
                    liveDurationSeconds,
                    liveAutoExtendSeconds,
                    liveExtendThresholdSeconds,
                    liveStartTime: liveStartTime || startAt,
                    startTime: startAt,
                })
            );
        }

        const auction = new Auction(baseAuction);

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

        // Verify the user is the seller or an admin
        const isSeller = auction.sellerId?.toString() === req.userId;
        const isAdmin = req.user?.role === "admin";

        if (!isSeller && !isAdmin) {
            console.log(`[DEBUG_AUTH] Access Denied. User:${req.userId}, Role:${req.user?.role}, Seller:${auction.sellerId?.toString()}`);
            return res.status(403).json({
                error: `AUTH_DENIED: You are not the seller (${auction.sellerId?.toString()}) and your role is (${req.user?.role}).`,
                debug: {
                    yourId: req.userId,
                    yourRole: req.user?.role,
                    sellerId: auction.sellerId?.toString(),
                    isSeller,
                    isAdmin
                }
            });
        }

        // Update allowed fields
        const allowedUpdates = ["title", "description", "imageUrl", "status", "endTime", "category", "startPrice", "details", "commission", "isVerified"];
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

        // Verify the user is the seller or an admin
        const isSeller = auction.sellerId?.toString() === req.userId;
        const isAdmin = req.user?.role === "admin";

        if (!isSeller && !isAdmin) {
            return res.status(403).json({ error: "Not authorized to delete this auction" });
        }
        // If sellerId is missing, we'll allow the authenticated user to delete it (as it's orphaned)
        // In a real app, this should probably be restricted to admins.

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
        const updatedAuction = await placeBidService({
            auctionId: req.params.id,
            bidderId: req.userId,
            bidAmount: req.body.bidAmount,
            user: req.user,
            isAutoBid: req.body.isAutoBid || false,
        });

        const io = req.app.get("io");
        if (io) {
            io.to(`auction:${updatedAuction._id}`).emit("auction:update", updatedAuction);
            const lastBid = updatedAuction.bids[updatedAuction.bids.length - 1];
            if (lastBid && lastBid.isSuspicious) {
                io.emit("admin:fraud_alert", {
                    auctionId: updatedAuction._id,
                    auctionTitle: updatedAuction.title,
                    bid: lastBid
                });
            }
        }

        // Trigger auto-bid bot check
        const { processAutoBids, processSmartAgentsByAuction } = require("../services/auctionService");
        await processAutoBids(updatedAuction._id, io);
        await processSmartAgentsByAuction(updatedAuction._id, io);


        res.json(updatedAuction);
    } catch (error) {
        console.error("Error placing bid:", error);
        res.status(error.statusCode || 500).json({ error: error.message || "Failed to place bid" });
    }
});

// POST /auctions/:id/auto-bid - Set auto-bid for item
router.post("/:id/auto-bid", authenticate, async (req, res) => {
    try {
        const { maxBid, increment } = req.body;
        const AutoBidSetting = require("../models/AutoBidSetting");

        const parsedMaxBid = Number(maxBid);
        const parsedIncrement = Number(increment) || 10;

        if (!parsedMaxBid || Number.isNaN(parsedMaxBid) || parsedMaxBid <= 0) {
            return res.status(400).json({ error: "Valid Max Bid is required" });
        }

        if (!parsedIncrement || Number.isNaN(parsedIncrement) || parsedIncrement <= 0) {
            return res.status(400).json({ error: "Valid increment is required" });
        }

        const auction = await Auction.findById(req.params.id);
        if (!auction) return res.status(404).json({ error: "Auction not found" });

        if (parsedMaxBid <= Number(auction.currentBid)) {
            return res.status(400).json({ error: "Max Bid must be higher than current bid" });
        }

        const setting = await AutoBidSetting.findOneAndUpdate(
            { userId: req.userId, auctionId: req.params.id },
            {
                maxBid: parsedMaxBid,
                increment: parsedIncrement,
                isActive: true,
                category: auction.category
            },
            { upsert: true, new: true }
        );

        // Immediate bot check (in case user sets bot when they are ALREADY outbid)
        const { processAutoBids, processSmartAgentsByAuction } = require("../services/auctionService");
        const io = req.app.get("io");
        processAutoBids(req.params.id, io);
        processSmartAgentsByAuction(req.params.id, io);


        res.json({ message: "Auto-bid setting saved", setting });
    } catch (error) {
        console.error("Error saving auto-bid:", error);
        res.status(500).json({ error: "Failed to save auto-bid" });
    }
});

// GET /auctions/:id/auto-bid - Get current user auto-bid for item
router.get("/:id/auto-bid", authenticate, async (req, res) => {
    try {
        const AutoBidSetting = require("../models/AutoBidSetting");
        const setting = await AutoBidSetting.findOne({
            userId: req.userId,
            auctionId: req.params.id
        });
        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch auto-bid status" });
    }
});

// DELETE /auctions/:id/auto-bid - Disable auto-bid
router.delete("/:id/auto-bid", authenticate, async (req, res) => {
    try {
        const AutoBidSetting = require("../models/AutoBidSetting");
        await AutoBidSetting.findOneAndDelete({
            userId: req.userId,
            auctionId: req.params.id
        });
        res.json({ message: "Auto-bid disabled" });
    } catch (error) {
        res.status(500).json({ error: "Failed to disable auto-bid" });
    }
});

// POST /auctions/my/auto-agent - Create or update smart category auto-bidding agent
router.post("/my/auto-agent", authenticate, async (req, res) => {
    try {
        const { category, maxBudget, bidIncrement, maxConcurrentAuctions, isEnabled, strategy, targetWinCount, filters } = req.body;

        if (!category || typeof category !== "string") {
            return res.status(400).json({ error: "Category is required" });
        }

        const normalizedCategory = category.toLowerCase();
        const parsedBudget = Number(maxBudget);
        const parsedIncrement = Number(bidIncrement) || 10;
        const parsedMaxConcurrent = Number(maxConcurrentAuctions) || 3;

        if (!parsedBudget || Number.isNaN(parsedBudget) || parsedBudget <= 0) {
            return res.status(400).json({ error: "Valid max budget is required" });
        }

        if (!parsedIncrement || Number.isNaN(parsedIncrement) || parsedIncrement <= 0) {
            return res.status(400).json({ error: "Valid bid increment is required" });
        }

        if (!parsedMaxConcurrent || Number.isNaN(parsedMaxConcurrent) || parsedMaxConcurrent <= 0) {
            return res.status(400).json({ error: "Valid max concurrent auctions value is required" });
        }

        const setting = await SmartAutoBidAgent.findOneAndUpdate(
            { userId: req.userId, category: normalizedCategory },
            {
                maxBudget: parsedBudget,
                bidIncrement: parsedIncrement,
                maxConcurrentAuctions: Math.min(10, parsedMaxConcurrent),
                isEnabled: isEnabled !== false,
                strategy: ["standard", "sniper", "aggressive"].includes(strategy) ? strategy : "standard",
                targetWinCount: Math.max(1, Number(targetWinCount) || 1),
                filters: filters,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (setting.isEnabled) {
            const io = req.app.get("io");
            await processSmartAgentBySetting(setting, io);
        }

        const overview = await getSmartAgentOverviewForUser(req.userId);
        res.json({ message: "Smart auto-bid agent saved", setting, overview });
    } catch (error) {
        console.error("Error saving smart auto-bid agent:", error);
        res.status(500).json({ error: "Failed to save smart auto-bid agent" });
    }
});

// GET /auctions/my/auto-agent - Get smart auto-bid agent overview for current user
router.get("/my/auto-agent", authenticate, async (req, res) => {
    try {
        const overview = await getSmartAgentOverviewForUser(req.userId);
        res.json(overview);
    } catch (error) {
        console.error("Error fetching smart auto-bid overview:", error);
        res.status(500).json({ error: "Failed to fetch smart auto-bid overview" });
    }
});

// GET /auctions/my/bidding-summary - Detailed summary of all auto-bids (item + category)
router.get("/my/bidding-summary", authenticate, async (req, res) => {
    try {
        const AutoBidSetting = require("../models/AutoBidSetting");
        const SmartAutoBidAgent = require("../models/SmartAutoBidAgent");
        const BotActivityLog = require("../models/BotActivityLog");
        const { getSmartAgentOverviewForUser } = require("../services/auctionService");

        // 1. Get Smart Agents with their active targets (radar)
        const smartAgentsOverview = await getSmartAgentOverviewForUser(req.userId);

        // 2. Get Item Bots (AutoBidSettings)
        const itemBots = await AutoBidSetting.find({ userId: req.userId, isActive: true })
            .populate("auctionId", "title imageUrl currentBid endTime status category");

        // 3. Get Recent Activity Logs (all bots)
        const logs = await BotActivityLog.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            smartAgents: smartAgentsOverview,
            itemBots,
            logs
        });
    } catch (error) {
        console.error("Error fetching bidding summary:", error);
        res.status(500).json({ error: "Failed to fetch bidding summary" });
    }
});

// GET /auctions/my/auto-agent/logs/:category - Get logs for agent
router.get("/my/auto-agent/logs/:category", authenticate, async (req, res) => {
    try {
        const BotActivityLog = require("../models/BotActivityLog");
        const logs = await BotActivityLog.find({
            userId: req.userId,
            category: req.params.category.toLowerCase()
        }).sort({ createdAt: -1 }).limit(50);
        res.json(logs);
    } catch (error) {
        console.error("Error fetching bot logs:", error);
        res.status(500).json({ error: "Failed to fetch bot logs" });
    }
});

// DELETE /auctions/my/auto-agent/:category - Disable smart auto-bid for category
router.delete("/my/auto-agent/:category", authenticate, async (req, res) => {
    try {
        const category = req.params.category.toLowerCase();
        const setting = await SmartAutoBidAgent.findOneAndUpdate(
            { userId: req.userId, category },
            { isEnabled: false },
            { new: true }
        );

        if (!setting) {
            return res.status(404).json({ error: "Smart auto-bid setting not found" });
        }

        const overview = await getSmartAgentOverviewForUser(req.userId);
        res.json({ message: "Smart auto-bid disabled", setting, overview });
    } catch (error) {
        console.error("Error disabling smart auto-bid:", error);
        res.status(500).json({ error: "Failed to disable smart auto-bid" });
    }
});

// POST /auctions/:id/claim - Winner claims item
router.post("/:id/claim", authenticate, async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) return res.status(404).json({ error: "Auction not found" });

        // ensure completed or endTime past
        if (auction.status === "active" && auction.endTime && new Date() >= new Date(auction.endTime)) {
            await completeAuction(auction);
        }

        if (auction.status !== "completed") {
            return res.status(400).json({ error: "Auction not completed yet" });
        }

        if (!auction.winnerId || auction.winnerId.toString() !== req.userId) {
            return res.status(403).json({ error: "Only the winning bidder can claim this item" });
        }

        auction.winnerClaimedAt = auction.winnerClaimedAt || new Date();
        auction.saleStatus = "claim-initiated";
        await auction.save();

        res.json({ message: "Claim initiated", claimedAt: auction.winnerClaimedAt, checkoutPath: `/checkout/${auction._id}` });
    } catch (error) {
        console.error("Error claiming auction:", error);
        res.status(500).json({ error: "Failed to claim item" });
    }
});

// POST /auctions/:id/payhere/session - Create PayHere sandbox payload (does not mark as paid)
router.post("/:id/payhere/session", authenticate, async (req, res) => {
    try {
        let auction = await Auction.findById(req.params.id).populate("winnerId", "username email phone");
        if (!auction) return res.status(404).json({ error: "Auction not found" });

        // If the auction has ended but not finalized, complete it so winnerId gets set
        const now = new Date();
        if (auction.status === "active" && auction.endTime && now >= new Date(auction.endTime)) {
            auction = await completeAuction(auction);
            await auction.populate("winnerId", "username email phone");
        }

        // Ensure winner is assigned (fallback to latest bid when missing)
        auction = await ensureWinnerAssignment(auction, req.userId);

        // If winnerId is set but does not match, yet the latest bid belongs to this user, promote them as winner
        const latestBidPay = auction.bids?.length ? auction.bids[auction.bids.length - 1] : null;
        if (latestBidPay?.bidderId?.toString() === req.userId && (!auction.winnerId || auction.winnerId.toString() !== req.userId)) {
            auction.winnerId = latestBidPay.bidderId;
            await auction.save();
        }

        // If winnerId is set but does not match, yet the latest bid belongs to this user, promote them as winner
        const latestBidSession = auction.bids?.length ? auction.bids[auction.bids.length - 1] : null;
        if (latestBidSession?.bidderId?.toString() === req.userId && (!auction.winnerId || auction.winnerId.toString() !== req.userId)) {
            auction.winnerId = latestBidSession.bidderId;
            await auction.save();
            await auction.populate("winnerId", "username email phone");
        }

        if (!auction.winnerId || auction.winnerId.toString() !== req.userId) {
            const latestBidderId = auction.bids?.length ? auction.bids[auction.bids.length - 1]?.bidderId : null;
            return res.status(403).json({
                error: "Unauthorized: only the winning bidder can pay",
                winnerId: auction.winnerId,
                latestBidderId,
                you: req.userId,
            });
        }

        if (auction.saleStatus === "paid") {
            return res.json({ message: "Payment already completed", orderId: auction.paymentOrderId, paidAt: auction.winnerPaidAt });
        }

        const merchantId = process.env.PAYHERE_MERCHANT_ID || "1234093";
        const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || "MzU1NTM3OTY4MjM1NTEyMDc0NTIyMzA1NjEyMDgzMjcxNzgzODEyMQ==";
        const currency = process.env.PAYHERE_CURRENCY || "USD";

        if (!merchantSecret) {
            return res.status(500).json({ error: "PAYHERE_MERCHANT_SECRET is not configured" });
        }

        const latestBid = auction.bids?.length ? auction.bids[auction.bids.length - 1] : null;
        const amount = Number(latestBid?.bidAmount || auction.currentBid || 0).toFixed(2);
        const orderId = auction.paymentOrderId || `ph-${Date.now()}-${auction._id.toString().slice(-6)}`;

        // Persist the generated order ID for later reconciliation with the notify callback
        auction.paymentOrderId = orderId;
        auction.saleStatus = auction.saleStatus || "payment-pending";
        await auction.save();

        const secretHash = md5Upper(merchantSecret);
        const hash = md5Upper(`${merchantId}${orderId}${amount}${currency}${secretHash}`);

        res.json({
            merchantId,
            hash,
            orderId,
            amount,
            currency,
            items: auction.title,
            firstName: auction.winnerId?.username || "Buyer",
            lastName: "",
            email: auction.winnerId?.email || "buyer@example.com",
            phone: auction.winnerId?.phone || "",
        });
    } catch (error) {
        console.error("Error creating PayHere session:", error);
        res.status(500).json({ error: "Failed to create PayHere session" });
    }
});

// POST /auctions/:id/pay - Winner completes payment
router.post("/:id/pay", authenticate, async (req, res) => {
    try {
        let auction = await Auction.findById(req.params.id);
        if (!auction) return res.status(404).json({ error: "Auction not found" });

        const now = new Date();
        if (auction.status === "active" && auction.endTime && now >= new Date(auction.endTime)) {
            auction = await completeAuction(auction);
        }

        // Ensure winner is assigned (fallback to latest bid when missing)
        auction = await ensureWinnerAssignment(auction, req.userId);

        if (!auction.winnerId || auction.winnerId.toString() !== req.userId) {
            const latestBidderId = auction.bids?.length ? auction.bids[auction.bids.length - 1]?.bidderId : null;
            return res.status(403).json({
                error: "Unauthorized: only the winning bidder can pay",
                winnerId: auction.winnerId,
                latestBidderId,
                you: req.userId,
            });
        }

        if (auction.saleStatus === "paid") {
            return res.json({ message: "Payment already completed", orderId: auction.paymentOrderId, paidAt: auction.winnerPaidAt });
        }

        auction.saleStatus = "paid";
        auction.winnerPaidAt = now;
        auction.winnerClaimedAt = auction.winnerClaimedAt || now;
        auction.paymentOrderId = auction.paymentOrderId || `ord-${Date.now()}-${auction._id.toString().slice(-6)}`;
        await auction.save();

        await sendPaymentConfirmationEmailOnce(auction);

        res.json({
            message: "Payment recorded",
            orderId: auction.paymentOrderId,
            paidAt: auction.winnerPaidAt,
        });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ error: "Failed to process payment" });
    }
});

// POST /auctions/payhere/notify - PayHere server-to-server callback
router.post("/payhere/notify", async (req, res) => {
    try {
        const {
            merchant_id,
            order_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
            custom_1,
        } = req.body || {};

        const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || "MzU1NTM3OTY4MjM1NTEyMDc0NTIyMzA1NjEyMDgzMjcxNzgzODEyMQ==";
        if (!merchantSecret) {
            console.error("PAYHERE_MERCHANT_SECRET not configured");
            return res.status(500).send("Secret missing");
        }

        const localSig = md5Upper(
            `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${md5Upper(merchantSecret)}`
        );

        if (!md5sig || md5sig.toUpperCase() !== localSig) {
            console.warn("PayHere notify signature mismatch", { order_id, md5sig, localSig });
            return res.status(400).send("INVALID SIGNATURE");
        }

        // PayHere status_code 2 = success
        if (String(status_code) !== "2") {
            return res.status(200).send("IGNORED");
        }

        let auction = null;
        if (custom_1) {
            auction = await Auction.findById(custom_1);
        }
        if (!auction) {
            auction = await Auction.findOne({ paymentOrderId: order_id });
        }

        if (!auction) {
            console.error("PayHere notify: auction not found", { order_id, custom_1 });
            return res.status(404).send("NOT FOUND");
        }

        auction.saleStatus = "paid";
        auction.winnerPaidAt = new Date();
        auction.paymentOrderId = order_id;
        await auction.save();

        await sendPaymentConfirmationEmailOnce(auction);

        return res.status(200).send("OK");
    } catch (error) {
        console.error("PayHere notify error", error);
        return res.status(500).send("ERROR");
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

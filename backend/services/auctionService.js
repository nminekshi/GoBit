const mongoose = require("mongoose");
const Auction = require("../models/Auction");

const LIVE_ENABLED_CATEGORIES = ["vehicles", "watches", "art", "electronics"];

// Normalize and clamp live auction defaults
function buildLiveAuctionConfig(payload = {}) {
    const duration = Number(payload.liveDurationSeconds) || 60;
    const autoExtend = Number(payload.liveAutoExtendSeconds) || 15;
    const extendThreshold = Number(payload.liveExtendThresholdSeconds) || 10;

    return {
        auctionType: "live",
        liveDurationSeconds: duration,
        liveAutoExtendSeconds: autoExtend,
        liveExtendThresholdSeconds: extendThreshold,
        liveStartTime: payload.liveStartTime ? new Date(payload.liveStartTime) : new Date(),
        endTime: payload.liveStartTime
            ? new Date(new Date(payload.liveStartTime).getTime() + duration * 1000)
            : new Date(Date.now() + duration * 1000),
    };
}

async function placeBid({ auctionId, bidderId, bidAmount, user }) {
    const numericBid = Number(bidAmount);
    if (!numericBid || Number.isNaN(numericBid)) {
        const err = new Error("Bid amount is required");
        err.statusCode = 400;
        throw err;
    }

    const auction = await Auction.findById(auctionId);

    if (!auction) {
        const err = new Error("Auction not found");
        err.statusCode = 404;
        throw err;
    }

    if (auction.status !== "active") {
        const err = new Error("This auction is no longer active");
        err.statusCode = 400;
        throw err;
    }

    if (auction.sellerId?.toString() === bidderId) {
        const err = new Error("Sellers cannot bid on their own auctions");
        err.statusCode = 400;
        throw err;
    }

    if (numericBid <= auction.currentBid) {
        const err = new Error(`Bid must be higher than current bid of $${auction.currentBid}`);
        err.statusCode = 400;
        throw err;
    }

    const now = new Date();

    if (auction.auctionType === "live") {
        // If timer has ended, complete the auction before rejecting new bids
        if (auction.endTime && auction.endTime <= now) {
            await completeAuction(auction);
            const err = new Error("Live auction has ended");
            err.statusCode = 400;
            throw err;
        }

        const timeLeftMs = auction.endTime ? auction.endTime.getTime() - now.getTime() : 0;
        // Auto-extend when bids occur close to the end of the countdown
        if (timeLeftMs > 0 && timeLeftMs <= auction.liveExtendThresholdSeconds * 1000) {
            auction.endTime = new Date(auction.endTime.getTime() + auction.liveAutoExtendSeconds * 1000);
        }
    }

    auction.bids.push({
        bidderId: new mongoose.Types.ObjectId(bidderId),
        bidAmount: numericBid,
        timestamp: now,
    });

    auction.currentBid = numericBid;
    auction.bidsCount += 1;
    auction.lastBidAt = now;

    await auction.save();
    await auction.populate("sellerId", "username email");
    await auction.populate("bids.bidderId", "username");

    return auction;
}

async function completeAuction(auction) {
    if (auction.status === "completed") return auction;

    const latestBid = auction.bids?.length ? auction.bids[auction.bids.length - 1] : null;
    auction.status = "completed";
    auction.liveEndedAt = auction.liveEndedAt || new Date();
    if (latestBid) {
        auction.winnerId = latestBid.bidderId;
    }
    await auction.save();
    await auction.populate("sellerId", "username email");
    await auction.populate("bids.bidderId", "username");
    return auction;
}

async function closeExpiredLiveAuctions(io) {
    const now = new Date();
    const expired = await Auction.find({
        auctionType: "live",
        status: "active",
        endTime: { $lte: now },
    });

    for (const auction of expired) {
        const completed = await completeAuction(auction);
        if (io) {
            io.to(`auction:${auction._id}`).emit("auction:update", completed);
        }
    }
}

module.exports = {
    LIVE_ENABLED_CATEGORIES,
    buildLiveAuctionConfig,
    placeBid,
    completeAuction,
    closeExpiredLiveAuctions,
};

const mongoose = require("mongoose");
const Auction = require("../models/Auction");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const { detectBidFraud } = require("../utils/fraudDetection");

const LIVE_ENABLED_CATEGORIES = ["vehicles", "watches", "art", "electronics"];

// Normalize and clamp live auction defaults
function buildLiveAuctionConfig(payload = {}) {
    const duration = Number(payload.liveDurationSeconds) || 60;
    const autoExtend = Number(payload.liveAutoExtendSeconds) || 15;
    const extendThreshold = Number(payload.liveExtendThresholdSeconds) || 10;
    const startSource = payload.liveStartTime || payload.startTime;
    const start = startSource ? new Date(startSource) : new Date();

    return {
        auctionType: "live",
        liveDurationSeconds: duration,
        liveAutoExtendSeconds: autoExtend,
        liveExtendThresholdSeconds: extendThreshold,
        liveStartTime: start,
        endTime: new Date(start.getTime() + duration * 1000),
        startTime: start,
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

    const now = new Date();
    if (auction.startTime && now < new Date(auction.startTime)) {
        const err = new Error("Auction has not started yet");
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

    const fraudResult = await detectBidFraud(auction, numericBid, bidderId);

    auction.bids.push({
        bidderId: new mongoose.Types.ObjectId(bidderId),
        bidAmount: numericBid,
        timestamp: now,
        ...fraudResult,
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
    auction.saleStatus = auction.saleStatus || "pending";
    await auction.save();
    await auction.populate("sellerId", "username email");
    await auction.populate("bids.bidderId", "username email");

    if (auction.winnerId && !auction.winnerNotified) {
        await sendWinnerEmailOnce(auction);
    }

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

async function closeExpiredNormalAuctions(io) {
    const now = new Date();
    const expired = await Auction.find({
        auctionType: { $ne: "live" },
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

async function sendWinnerEmailOnce(auction) {
    if (!auction.winnerId || auction.winnerNotified) return;

    const winner = await User.findById(auction.winnerId);
    if (!winner?.email) {
        auction.winnerNotified = true;
        await auction.save();
        return;
    }

    const transport = createMailTransport();
    const mail = {
        from: process.env.MAIL_FROM || "no-reply@fyp.local",
        to: winner.email,
        subject: `You won ${auction.title}`,
        text: buildWinnerEmailText({ auction, winner }),
    };

    try {
        await transport.sendMail(mail);
    } catch (err) {
        console.error("Failed to send winner email", err);
    } finally {
        auction.winnerNotified = true;
        await auction.save();
    }
}

async function sendPaymentConfirmationEmailOnce(auction) {
    if (!auction.winnerId || auction.paymentNotified) return;

    const winner = await User.findById(auction.winnerId);
    if (!winner?.email) {
        auction.paymentNotified = true;
        await auction.save();
        return;
    }

    const transport = createMailTransport();
    const mail = {
        from: process.env.MAIL_FROM || "no-reply@fyp.local",
        to: winner.email,
        subject: `Payment received for ${auction.title}`,
        text: buildPaymentEmailText({ auction, winner }),
    };

    try {
        await transport.sendMail(mail);
    } catch (err) {
        console.error("Failed to send payment confirmation email", err);
    } finally {
        auction.paymentNotified = true;
        await auction.save();
    }
}

function createMailTransport() {
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: process.env.SMTP_USER
                ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                : undefined,
        });
    }
    // Fallback: log-only transport to avoid blocking
    return {
        sendMail: async (opts) => {
            console.log("[MAIL:DEV-LOG]", opts);
        },
    };
}

function buildWinnerEmailText({ auction, winner }) {
    const isLive = auction.auctionType === "live";
    const deadlineHours = process.env.PAYMENT_DEADLINE_HOURS || 48;
    const latestBid = auction.bids?.length ? auction.bids[auction.bids.length - 1] : null;
    const amount = latestBid?.bidAmount || auction.currentBid;

    return [
        `Hi ${winner.username || winner.email},`,
        "",
        `Congratulations! You won the ${auction.title} in the ${auction.category} category (${isLive ? "Live" : "Normal"} Auction).`,
        `Winning bid amount: $${amount}`,
        "",
        "Next steps:",
        "1) Open the app and click 'Claim Item' on this auction.",
        "2) Complete payment and any required deposit.",
        `3) Please complete payment within ${deadlineHours} hours to avoid cancellation.`,
        "",
        "Thank you for bidding with us!",
    ].join("\n");
}

function buildPaymentEmailText({ auction, winner }) {
    const latestBid = auction.bids?.length ? auction.bids[auction.bids.length - 1] : null;
    const amount = latestBid?.bidAmount || auction.currentBid;
    const orderId = auction.paymentOrderId || "TBD";

    return [
        `Hi ${winner.username || winner.email},`,
        "",
        `We received your payment for ${auction.title} (${auction.category})`,
        `Auction type: ${auction.auctionType === "live" ? "Live" : "Normal"}`,
        `Paid amount: $${amount}`,
        `Order ID: ${orderId}`,
        "",
        "Your order is being processed. We'll notify you when shipping or pickup is ready.",
        "",
        "Thank you!",
    ].join("\n");
}

module.exports = {
    LIVE_ENABLED_CATEGORIES,
    buildLiveAuctionConfig,
    placeBid,
    completeAuction,
    closeExpiredLiveAuctions,
    closeExpiredNormalAuctions,
    sendWinnerEmailOnce,
    sendPaymentConfirmationEmailOnce,
};

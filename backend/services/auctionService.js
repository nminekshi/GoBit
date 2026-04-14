const mongoose = require("mongoose");
const Auction = require("../models/Auction");
const User = require("../models/User");
const AutoBidSetting = require("../models/AutoBidSetting");
const SmartAutoBidAgent = require("../models/SmartAutoBidAgent");
const nodemailer = require("nodemailer");
const { detectBidFraud } = require("../utils/fraudDetection");

const LIVE_ENABLED_CATEGORIES = ["vehicles", "watches", "art", "electronics"];
const processingAutoBidAuctions = new Set();
const pendingAutoBidAuctions = new Set();
const processingSmartAgentKeys = new Set();
const pendingSmartAgentKeys = new Set();

function getAutoBidCooldownMs(auctionType) {
    if (process.env.NODE_ENV === "test") return 0;
    const liveMs = Number(process.env.AUTO_BID_COOLDOWN_MS_LIVE) || 1200;
    const normalMs = Number(process.env.AUTO_BID_COOLDOWN_MS_NORMAL) || 700;
    return auctionType === "live" ? liveMs : normalMs;
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function notifyUser(io, userId, eventName, payload) {
    if (!io || !userId) return;
    io.to(`user:${userId.toString()}`).emit(eventName, payload);
}

function getLatestBid(auction) {
    return auction?.bids?.length ? auction.bids[auction.bids.length - 1] : null;
}

function prioritizeAuctions(auctions) {
    return [...auctions].sort((a, b) => {
        const priceDiff = Number(a.currentBid || 0) - Number(b.currentBid || 0);
        if (priceDiff !== 0) return priceDiff;
        const endA = new Date(a.endTime).getTime();
        const endB = new Date(b.endTime).getTime();
        return endA - endB;
    });
}

function calculateCommittedFromAuctions(auctions, userId) {
    const committedAuctions = [];
    let committedBudget = 0;

    for (const auction of auctions) {
        const latestBid = getLatestBid(auction);
        if (latestBid?.bidderId?.toString() === userId.toString()) {
            const amount = Number(latestBid.bidAmount || auction.currentBid || 0);
            committedBudget += amount;
            committedAuctions.push({
                auctionId: auction._id,
                title: auction.title,
                amount,
                endTime: auction.endTime,
            });
        }
    }

    return { committedBudget, committedAuctions };
}

function isAuctionEligibleForUserBidding(auction, userId) {
    const now = new Date();
    if (!auction || auction.status !== "active") return false;
    if (auction.sellerId?.toString() === userId.toString()) return false;
    if (auction.startTime && now < new Date(auction.startTime)) return false;
    if (auction.endTime && now >= new Date(auction.endTime)) return false;
    return true;
}

async function processSmartAgentBySetting(setting, io) {
    if (!setting?.isEnabled) return;
    const userId = setting.userId.toString();
    const key = `${userId}:${setting.category}`;

    if (processingSmartAgentKeys.has(key)) {
        pendingSmartAgentKeys.add(key);
        return;
    }

    processingSmartAgentKeys.add(key);

    try {
        do {
            pendingSmartAgentKeys.delete(key);

            const freshSetting = await SmartAutoBidAgent.findById(setting._id);
            if (!freshSetting || !freshSetting.isEnabled) break;

            const alreadyWon = await Auction.exists({
                winnerId: freshSetting.userId,
                status: "completed",
            });

            if (alreadyWon) {
                freshSetting.isEnabled = false;
                await freshSetting.save();
                notifyUser(io, freshSetting.userId, "smart-agent:won", {
                    message: "Smart auto-bidding stopped because you won an auction.",
                });
                break;
            }

            let keepRunning = true;
            let safetyCount = 0;
            const outbidNotified = new Set();

            while (keepRunning && safetyCount < 30) {
                safetyCount += 1;

                const activeAuctions = await Auction.find({
                    status: "active",
                    category: freshSetting.category,
                });

                if (!activeAuctions.length) break;

                const { committedBudget } = calculateCommittedFromAuctions(activeAuctions, freshSetting.userId);
                const remainingBudget = Number(freshSetting.maxBudget) - committedBudget;

                if (remainingBudget <= 0) {
                    freshSetting.isEnabled = false;
                    freshSetting.lastBudgetReachedAt = new Date();
                    await freshSetting.save();
                    notifyUser(io, freshSetting.userId, "smart-agent:budget-reached", {
                        category: freshSetting.category,
                        maxBudget: Number(freshSetting.maxBudget),
                        committedBudget,
                        message: "Smart auto-bidding stopped because your budget is fully committed.",
                    });
                    break;
                }

                const prioritized = prioritizeAuctions(activeAuctions);
                const candidates = [];

                for (const auction of prioritized) {
                    if (!isAuctionEligibleForUserBidding(auction, userId)) continue;

                    const latestBid = getLatestBid(auction);
                    const leaderId = latestBid?.bidderId?.toString() || null;
                    const userHasBid = auction.bids?.some((b) => b.bidderId?.toString() === userId);

                    if (leaderId === userId) continue;

                    if (userHasBid && !outbidNotified.has(auction._id.toString())) {
                        outbidNotified.add(auction._id.toString());
                        notifyUser(io, freshSetting.userId, "smart-agent:outbid", {
                            auctionId: auction._id,
                            title: auction.title,
                            currentBid: Number(auction.currentBid),
                            message: `You were outbid on ${auction.title}.`,
                        });
                    }

                    const increment = Number(freshSetting.bidIncrement) || 1;
                    const nextBid = Number(auction.currentBid) + increment;

                    if (nextBid > Number(freshSetting.maxBudget)) continue;
                    if (nextBid > remainingBudget) continue;

                    candidates.push({ auction, nextBid });
                }

                if (!candidates.length) {
                    keepRunning = false;
                    break;
                }

                const maxConcurrent = Math.max(1, Number(freshSetting.maxConcurrentAuctions) || 3);
                const picked = candidates.slice(0, maxConcurrent);
                let placed = false;

                for (const candidate of picked) {
                    try {
                        const bidder = await User.findById(freshSetting.userId);
                        if (!bidder) {
                            freshSetting.isEnabled = false;
                            await freshSetting.save();
                            keepRunning = false;
                            break;
                        }

                        const updated = await placeBid({
                            auctionId: candidate.auction._id,
                            bidderId: freshSetting.userId.toString(),
                            bidAmount: candidate.nextBid,
                            user: bidder,
                            isAutoBid: true,
                        });

                        if (io) {
                            io.to(`auction:${candidate.auction._id}`).emit("auction:update", updated);
                        }

                        notifyUser(io, freshSetting.userId, "smart-agent:bid-placed", {
                            auctionId: candidate.auction._id,
                            title: candidate.auction.title,
                            bidAmount: candidate.nextBid,
                            currentBid: updated.currentBid,
                            category: freshSetting.category,
                            message: `Smart agent placed $${candidate.nextBid} on ${candidate.auction.title}.`,
                        });

                        const cooldown = getAutoBidCooldownMs(candidate.auction.auctionType);
                        if (cooldown > 0) {
                            await wait(cooldown);
                        }

                        placed = true;
                        break;
                    } catch (err) {
                        console.warn(`[SmartAutoBid] Failed for ${freshSetting.userId} on ${candidate.auction._id}: ${err.message}`);
                    }
                }

                if (!placed) {
                    keepRunning = false;
                }
            }
        } while (pendingSmartAgentKeys.has(key));
    } finally {
        processingSmartAgentKeys.delete(key);
        pendingSmartAgentKeys.delete(key);
    }
}

async function processSmartAgentsByAuction(auctionId, io) {
    const auction = await Auction.findById(auctionId);
    if (!auction || auction.status !== "active") return;

    const enabledSettings = await SmartAutoBidAgent.find({
        category: auction.category,
        isEnabled: true,
    });

    for (const setting of enabledSettings) {
        await processSmartAgentBySetting(setting, io);
    }
}

async function processAllSmartAgents(io) {
    const enabledSettings = await SmartAutoBidAgent.find({ isEnabled: true });
    for (const setting of enabledSettings) {
        await processSmartAgentBySetting(setting, io);
    }
}

async function getSmartAgentOverviewForUser(userId) {
    const settings = await SmartAutoBidAgent.find({ userId }).sort({ updatedAt: -1 });
    const output = [];

    for (const setting of settings) {
        const activeAuctions = await Auction.find({
            status: "active",
            category: setting.category,
        }).sort({ endTime: 1 });

        const { committedBudget, committedAuctions } = calculateCommittedFromAuctions(activeAuctions, setting.userId);
        const remainingBudget = Math.max(0, Number(setting.maxBudget) - committedBudget);
        const prioritized = prioritizeAuctions(activeAuctions);

        const targets = prioritized
            .filter((auction) => {
                if (!isAuctionEligibleForUserBidding(auction, setting.userId)) return false;
                const latestBid = getLatestBid(auction);
                const leaderId = latestBid?.bidderId?.toString();
                if (leaderId === setting.userId.toString()) return false;
                const nextBid = Number(auction.currentBid) + (Number(setting.bidIncrement) || 1);
                return nextBid <= Number(setting.maxBudget) && nextBid <= remainingBudget;
            })
            .slice(0, Math.max(1, Number(setting.maxConcurrentAuctions) || 3))
            .map((auction) => ({
                auctionId: auction._id,
                title: auction.title,
                imageUrl: auction.imageUrl,
                currentBid: Number(auction.currentBid),
                auctionType: auction.auctionType,
                endTime: auction.endTime,
                nextBid: Number(auction.currentBid) + (Number(setting.bidIncrement) || 1),
            }));

        output.push({
            _id: setting._id,
            category: setting.category,
            maxBudget: Number(setting.maxBudget),
            bidIncrement: Number(setting.bidIncrement),
            maxConcurrentAuctions: Number(setting.maxConcurrentAuctions),
            isEnabled: setting.isEnabled,
            committedBudget,
            remainingBudget,
            committedAuctions,
            targets,
            updatedAt: setting.updatedAt,
        });
    }

    return output;
}

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

async function placeBid({ auctionId, bidderId, bidAmount, user, isAutoBid = false }) {
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
        isAutoBid: isAutoBid,
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

/**
 * processAutoBids
 * Scans for users who have set a Max Bid for this item/category
 * and places a new bid if they are currently outbid.
 */
async function processAutoBids(auctionId, io) {
    const auctionKey = auctionId.toString();

    if (processingAutoBidAuctions.has(auctionKey)) {
        pendingAutoBidAuctions.add(auctionKey);
        return;
    }

    processingAutoBidAuctions.add(auctionKey);

    try {
        do {
            pendingAutoBidAuctions.delete(auctionKey);

            const maxReachedNotifiedUsers = new Set();
            let didPlaceBidInCycle = false;
            let canContinue = true;

            while (canContinue) {
                const auction = await Auction.findById(auctionId);
                if (!auction || auction.status !== "active") break;

                const latestBid = auction.bids.length > 0 ? auction.bids[auction.bids.length - 1] : null;
                const currentLeaderId = latestBid?.bidderId ? latestBid.bidderId.toString() : null;

                const activeBots = await AutoBidSetting.find({
                    auctionId: auction._id,
                    isActive: true,
                }).sort({ updatedAt: 1, _id: 1 });

                if (!activeBots.length) break;

                let placedInRound = false;

                for (const bot of activeBots) {
                    const botUserId = bot.userId?.toString();
                    if (!botUserId) continue;

                    if (currentLeaderId && botUserId === currentLeaderId) {
                        continue;
                    }

                    const increment = Number(bot.increment) || 1;
                    const nextBid = Number(auction.currentBid) + increment;

                    if (nextBid > Number(bot.maxBid)) {
                        if (!maxReachedNotifiedUsers.has(botUserId)) {
                            maxReachedNotifiedUsers.add(botUserId);
                            notifyUser(io, botUserId, "auto-bid:max-reached", {
                                auctionId: auction._id,
                                currentBid: Number(auction.currentBid),
                                maxBid: Number(bot.maxBid),
                                message: "Auto-bid paused because your maximum bid was reached.",
                            });
                        }
                        continue;
                    }

                    const lastBid = auction.bids.length > 0 ? auction.bids[auction.bids.length - 1] : null;
                    if (
                        lastBid?.bidderId?.toString() === botUserId &&
                        Number(lastBid?.bidAmount) === nextBid
                    ) {
                        continue;
                    }

                    try {
                        const botUser = await User.findById(bot.userId);
                        if (!botUser) continue;

                        console.log(`[AutoBid] Bot for user ${botUserId} placing bid $${nextBid} on auction ${auctionId}`);

                        const updated = await placeBid({
                            auctionId: auction._id,
                            bidderId: botUserId,
                            bidAmount: nextBid,
                            user: botUser,
                            isAutoBid: true,
                        });

                        if (io) {
                            io.to(`auction:${auction._id}`).emit("auction:update", updated);
                        }

                        notifyUser(io, botUserId, "auto-bid:placed", {
                            auctionId: auction._id,
                            bidAmount: nextBid,
                            currentBid: updated.currentBid,
                            message: `Your auto-bid placed $${nextBid}.`,
                        });

                        const cooldown = getAutoBidCooldownMs(auction.auctionType);
                        if (cooldown > 0) {
                            await wait(cooldown);
                        }

                        placedInRound = true;
                        didPlaceBidInCycle = true;
                        break;
                    } catch (err) {
                        console.warn(`[AutoBid] Failed for ${botUserId}: ${err.message}`);
                        continue;
                    }
                }

                if (!placedInRound) {
                    canContinue = false;
                }
            }

            if (!didPlaceBidInCycle) {
                break;
            }
        } while (pendingAutoBidAuctions.has(auctionKey));
    } finally {
        processingAutoBidAuctions.delete(auctionKey);
        pendingAutoBidAuctions.delete(auctionKey);
    }
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

    if (auction.winnerId) {
        await SmartAutoBidAgent.updateMany(
            { userId: auction.winnerId, isEnabled: true },
            { isEnabled: false }
        );
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
    processAutoBids,
    processSmartAgentsByAuction,
    processAllSmartAgents,
    processSmartAgentBySetting,
    getSmartAgentOverviewForUser,
};

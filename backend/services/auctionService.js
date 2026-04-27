const mongoose = require("mongoose");
const Auction = require("../models/Auction");
const User = require("../models/User");
const AutoBidSetting = require("../models/AutoBidSetting");
const SmartAutoBidAgent = require("../models/SmartAutoBidAgent");
const BotActivityLog = require("../models/BotActivityLog");
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

function isUserOnline(io, userId) {
    if (!io || !userId) return false;
    const roomName = `user:${userId.toString()}`;
    const room = io.sockets.adapter.rooms.get(roomName);
    const isOnline = !!(room && room.size > 0);
    
    if (!isOnline) {
        console.log(`[BOT-STATUS] User ${userId} is OFFLINE (No sockets in room ${roomName})`);
    } else {
        console.log(`[BOT-STATUS] User ${userId} is ONLINE (${room.size} active connections)`);
    }
    
    return isOnline;
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

function calculateNextBid(currentBid, settingIncrement, strategy = "standard", isFirstBid = false) {
    const currentBidNum = Number(currentBid) || 0;
    
    let baseIncrement = Number(settingIncrement) || 10;

    // Tactical scaling based on price brackets
    if (currentBidNum > 500 && currentBidNum <= 2500) baseIncrement = Math.max(baseIncrement, 5);
    if (currentBidNum > 2500 && currentBidNum <= 10000) baseIncrement = Math.max(baseIncrement, 25);
    if (currentBidNum > 10000) baseIncrement = Math.max(baseIncrement, 100);

    // Strategy multipliers
    if (strategy === "aggressive") {
        baseIncrement = baseIncrement * 3;
    }

    return currentBidNum + baseIncrement;
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

    const lockedAgent = await SmartAutoBidAgent.findOneAndUpdate(
        { _id: setting._id, isProcessing: false, isEnabled: true },
        { isProcessing: true },
        { new: true }
    );

    if (!lockedAgent) return;

    try {
        const freshSetting = lockedAgent;

        const wonCount = await Auction.countDocuments({
            winnerId: freshSetting.userId,
            category: freshSetting.category,
            status: "completed",
        });

        const targetWinCount = Number(freshSetting.targetWinCount) || 1;

        if (wonCount >= targetWinCount) {
            freshSetting.isEnabled = false;
            await freshSetting.save();
            await BotActivityLog.create({
                userId: freshSetting.userId,
                category: freshSetting.category,
                action: "paused",
                message: `Smart auto-bidding stopped because you reached your target win count (${targetWinCount}).`
            });
            notifyUser(io, freshSetting.userId, "smart-agent:won", {
                message: `Smart auto-bidding stopped because you reached your target win count (${targetWinCount}).`,
            });
            return;
        }

        let keepRunning = true;
        let safetyCount = 0;
        const outbidNotified = new Set();

        while (keepRunning && safetyCount < 30) {
            safetyCount += 1;

            const query = {
                status: "active",
                category: freshSetting.category,
            };

            if (freshSetting.filters && freshSetting.filters.dynamicFields) {
                const dynamicFields = freshSetting.filters.dynamicFields;
                if (dynamicFields instanceof Map) {
                    dynamicFields.forEach((val, key) => {
                        if (val) query[`details.${key}`] = new RegExp(val, "i");
                    });
                } else if (typeof dynamicFields === 'object') {
                    for (const [key, val] of Object.entries(dynamicFields)) {
                        if (val) query[`details.${key}`] = new RegExp(val, "i");
                    }
                }
            }

            const activeAuctions = await Auction.find(query);

            if (!activeAuctions.length) break;

            const { committedBudget } = calculateCommittedFromAuctions(activeAuctions, freshSetting.userId);
            const remainingBudget = Number(freshSetting.maxBudget) - committedBudget;

            if (remainingBudget <= 0) {
                freshSetting.isEnabled = false;
                freshSetting.lastBudgetReachedAt = new Date();
                await freshSetting.save();
                await BotActivityLog.create({
                    userId: freshSetting.userId,
                    category: freshSetting.category,
                    action: "budget_reached",
                    message: "Smart auto-bidding stopped because your budget is fully committed."
                });
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
            const now = new Date();

            for (const auction of prioritized) {
                if (!isAuctionEligibleForUserBidding(auction, userId)) continue;

                const latestBid = getLatestBid(auction);
                const leaderId = latestBid?.bidderId?.toString() || null;
                const userHasBid = auction.bids?.some((b) => b.bidderId?.toString() === userId);

                if (leaderId === userId) continue;

                // CHAIN CHECK: If user's last bid on THIS auction was manual, the Smart Agent skips it.
                const userBids = auction.bids.filter(b => b.bidderId?.toString() === userId);
                const lastUserBid = userBids.length > 0 ? userBids[userBids.length - 1] : null;
                if (lastUserBid && !lastUserBid.isAutoBid) {
                    console.log(`[SMART-AGENT] Skipping ${auction.title} for ${userId}: Last bid was MANUAL. Chain broken.`);
                    continue;
                }

                const strategy = freshSetting.strategy || "standard";
                if (strategy === "sniper") {
                    const timeLeft = auction.endTime ? new Date(auction.endTime).getTime() - now.getTime() : 0;
                    if (timeLeft > 180000) {
                        continue;
                    }
                }

                if (userHasBid && !outbidNotified.has(auction._id.toString())) {
                    outbidNotified.add(auction._id.toString());
                    notifyUser(io, freshSetting.userId, "smart-agent:outbid", {
                        auctionId: auction._id,
                        title: auction.title,
                        currentBid: Number(auction.currentBid),
                        message: `You were outbid on ${auction.title}.`,
                    });
                }

                const isFirstBid = !auction.bids || auction.bids.length === 0;
                const nextBid = calculateNextBid(auction.currentBid, freshSetting.bidIncrement, freshSetting.strategy, isFirstBid);

                let finalBid = nextBid;
                if (finalBid > Number(freshSetting.maxBudget)) {
                    // Try bidding exactly the max budget if it's higher than current
                    finalBid = Number(freshSetting.maxBudget);
                    if (finalBid <= Number(auction.currentBid)) {
                        console.log(`[SMART-AGENT] Skipping ${auction.title}: Max budget $${finalBid} is not higher than current bid $${auction.currentBid}`);
                        continue;
                    }
                    console.log(`[SMART-AGENT] Capping bid at max budget $${finalBid} for ${auction.title}`);
                }

                if (finalBid > remainingBudget) {
                    console.log(`[SMART-AGENT] Skipping ${auction.title}: Bid $${finalBid} exceeds remaining category budget $${remainingBudget}`);
                    await BotActivityLog.create({
                        userId: freshSetting.userId,
                        category: freshSetting.category,
                        auctionId: auction._id,
                        action: "skipped",
                        message: `Skipped ${auction.title}: next bid $${finalBid} exceeds remaining budget $${remainingBudget}.`
                    }).catch(() => null);
                    continue;
                }

                candidates.push({ auction, nextBid: finalBid });
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

                    await BotActivityLog.create({
                        userId: freshSetting.userId,
                        category: freshSetting.category,
                        auctionId: candidate.auction._id,
                        action: "bid_placed",
                        message: `Placed $${candidate.nextBid} on ${candidate.auction.title}.`
                    });

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
                    await BotActivityLog.create({
                        userId: freshSetting.userId,
                        category: freshSetting.category,
                        auctionId: candidate.auction._id,
                        action: "error",
                        message: `Failed to place bid: ${err.message}`
                    }).catch(() => null);
                    console.warn(`[SmartAutoBid] Failed for ${freshSetting.userId} on ${candidate.auction._id}: ${err.message}`);
                }
            }

            if (!placed) {
                keepRunning = false;
            }
        }
    } finally {
        await SmartAutoBidAgent.findByIdAndUpdate(setting._id, { isProcessing: false });
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
        // Skip if user is not online
        if (!isUserOnline(io, setting.userId)) continue;
        await processSmartAgentBySetting(setting, io);
    }
}

async function processAllSmartAgents(io) {
    const enabledSettings = await SmartAutoBidAgent.find({ isEnabled: true });
    for (const setting of enabledSettings) {
        // Skip if user is not online
        if (!isUserOnline(io, setting.userId)) continue;
        await processSmartAgentBySetting(setting, io);
    }
}

async function getSmartAgentOverviewForUser(userId) {
    const settings = await SmartAutoBidAgent.find({ userId }).sort({ updatedAt: -1 });
    const output = [];

    for (const setting of settings) {
        const query = {
            status: "active",
            category: setting.category,
        };

        if (setting.filters && setting.filters.dynamicFields) {
            const dynamicFields = setting.filters.dynamicFields;
            if (dynamicFields instanceof Map) {
                dynamicFields.forEach((val, key) => {
                    if (val) query[`details.${key}`] = new RegExp(val, "i");
                });
            } else if (typeof dynamicFields === 'object') {
                for (const [key, val] of Object.entries(dynamicFields)) {
                    if (val) query[`details.${key}`] = new RegExp(val, "i");
                }
            }
        }

        const activeAuctions = await Auction.find(query).sort({ endTime: 1 });

        const { committedBudget, committedAuctions } = calculateCommittedFromAuctions(activeAuctions, setting.userId);
        const remainingBudget = Math.max(0, Number(setting.maxBudget) - committedBudget);
        const prioritized = prioritizeAuctions(activeAuctions);
        const dynamicFields = setting.filters?.dynamicFields;
        const normalizedDynamicFields =
            dynamicFields instanceof Map
                ? Object.fromEntries(dynamicFields.entries())
                : dynamicFields && typeof dynamicFields === "object"
                    ? dynamicFields
                    : undefined;

        const targets = prioritized
            .map((auction) => {
                const latestBid = getLatestBid(auction);
                const leaderId = latestBid?.bidderId?.toString();
                const isLeading = leaderId === setting.userId.toString();
                const isFirstBid = !auction.bids || auction.bids.length === 0;
                const nextBid = calculateNextBid(auction.currentBid, setting.bidIncrement, setting.strategy, isFirstBid);

                // For overview, we return all active auctions the user is either leading or could bid on
                const isEligible = isAuctionEligibleForUserBidding(auction, setting.userId);
                const canAfford = nextBid <= Number(setting.maxBudget) && nextBid <= remainingBudget;

                if (!isEligible) return null;
                if (!isLeading && !canAfford) return null;

                return {
                    auctionId: auction._id,
                    title: auction.title,
                    imageUrl: auction.imageUrl,
                    currentBid: Number(auction.currentBid),
                    auctionType: auction.auctionType,
                    endTime: auction.endTime,
                    nextBid: isLeading ? 0 : nextBid,
                    isLeading,
                };
            })
            .filter(t => t !== null)
            .slice(0, Math.max(5, Number(setting.maxConcurrentAuctions) || 3));

        output.push({
            _id: setting._id,
            category: setting.category,
            maxBudget: Number(setting.maxBudget),
            bidIncrement: Number(setting.bidIncrement),
            maxConcurrentAuctions: Number(setting.maxConcurrentAuctions),
            isEnabled: setting.isEnabled,
            strategy: setting.strategy || "standard",
            targetWinCount: Math.max(1, Number(setting.targetWinCount) || 1),
            filters: {
                priceMin: setting.filters?.priceMin,
                priceMax: setting.filters?.priceMax,
                dynamicFields: normalizedDynamicFields,
            },
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
    console.log(`[BACKEND-BID] Processing bid request: Auction:${auctionId}, Bidder:${bidderId}, Amount:${bidAmount}, isAuto:${isAutoBid}`);
    
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

    const currentBidNum = Number(auction.currentBid) || 0;
    const isFirstBid = auction.bids.length === 0;

    if (isFirstBid) {
        if (numericBid < auction.startPrice) {
            const err = new Error(`First bid must be at least the start price of $${auction.startPrice}`);
            err.statusCode = 400;
            throw err;
        }
    } else {
        if (numericBid <= currentBidNum) {
            const err = new Error(`Bid must be higher than current bid of $${auction.currentBid}`);
            err.statusCode = 400;
            throw err;
        }
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

    console.log(`[BACKEND-BID] Bid SUCCESS: $${numericBid} on Auction:${auctionId} by User:${bidderId}`);
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
                    const lockedBot = await AutoBidSetting.findOneAndUpdate(
                        { _id: bot._id, isProcessing: false, isActive: true },
                        { isProcessing: true },
                        { new: true }
                    );
                    if (!lockedBot) continue;

                    try {
                        const botUserId = lockedBot.userId?.toString();
                        if (!botUserId) continue;

                        if (!isUserOnline(io, botUserId)) continue;

                        if (currentLeaderId && botUserId === currentLeaderId) {
                            continue;
                        }

                        // CHAIN CHECK: Only trigger auto-bids if the user's last bid was an auto-bid (or no bid yet)
                        const userBids = auction.bids.filter(b => b.bidderId?.toString() === botUserId);
                        const lastUserBid = userBids.length > 0 ? userBids[userBids.length - 1] : null;
                        if (lastUserBid && !lastUserBid.isAutoBid) {
                            console.log(`[AUTO-BID] Skipping ${botUserId} on ${auction._id}: Last bid was MANUAL. Chain broken.`);
                            continue;
                        }

                        const isFirstBid = auction.bids.length === 0;
                        const nextBid = calculateNextBid(auction.currentBid, lockedBot.increment, "standard", isFirstBid);

                        let finalBid = nextBid;
                        if (finalBid > Number(lockedBot.maxBid)) {
                            finalBid = Number(lockedBot.maxBid);
                            if (finalBid <= Number(auction.currentBid)) {
                                console.log(`[AUTO-BID] Max reached for ${botUserId} on ${auction._id}`);
                                if (!maxReachedNotifiedUsers.has(botUserId)) {
                                    maxReachedNotifiedUsers.add(botUserId);
                                    notifyUser(io, botUserId, "auto-bid:max-reached", {
                                        auctionId: auction._id,
                                        currentBid: Number(auction.currentBid),
                                        maxBid: Number(lockedBot.maxBid),
                                        message: "Auto-bid paused because your maximum bid was reached.",
                                    });
                                }
                                continue;
                            }
                        }

                        const botUser = await User.findById(lockedBot.userId);
                        if (!botUser) continue;

                        console.log(`[AUTO-BID] Executing for ${botUserId}: $${finalBid} on ${auction.title}`);

                        const updated = await placeBid({
                            auctionId: auction._id,
                            bidderId: botUserId,
                            bidAmount: finalBid,
                            user: botUser,
                            isAutoBid: true,
                        });

                        if (io) {
                            io.to(`auction:${auction._id}`).emit("auction:update", updated);
                        }

                        notifyUser(io, botUserId, "auto-bid:placed", {
                            auctionId: auction._id,
                            bidAmount: finalBid,
                            currentBid: updated.currentBid,
                            message: `Your auto-bid placed $${finalBid}.`,
                        });

                        const cooldown = getAutoBidCooldownMs(auction.auctionType);
                        if (cooldown > 0) await wait(cooldown);

                        placedInRound = true;
                        didPlaceBidInCycle = true;
                        break;
                    } catch (err) {
                        console.warn(`[AutoBid] Failed for ${lockedBot.userId}: ${err.message}`);
                    } finally {
                        await AutoBidSetting.findByIdAndUpdate(lockedBot._id, { isProcessing: false });
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

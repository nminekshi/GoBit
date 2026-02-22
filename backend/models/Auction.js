const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            required: true,
            enum: ["watches", "vehicles", "electronics", "realestate", "art", "computers"],
        },
        startPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        currentBid: {
            type: Number,
            default: function () {
                return this.startPrice;
            },
        },
        bidsCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active",
        },
        auctionType: {
            type: String,
            enum: ["normal", "live"],
            default: "normal",
        },
        liveDurationSeconds: {
            type: Number,
            default: 60,
        },
        liveAutoExtendSeconds: {
            type: Number,
            default: 15,
        },
        liveExtendThresholdSeconds: {
            type: Number,
            default: 10,
        },
        liveStartTime: {
            type: Date,
        },
        liveEndedAt: {
            type: Date,
        },
        startTime: {
            type: Date,
            default: Date.now,
        },
        endTime: {
            type: Date,
            required: true,
        },
        imageUrl: {
            type: String,
            default: "https://images.unsplash.com/photo-1550259114-ad7188f0a967?auto=format&fit=crop&q=80&w=260&h=200",
        },
        views: {
            type: Number,
            default: 0,
        },
        watchers: {
            type: Number,
            default: 0,
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        bids: [
            {
                bidderId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                bidAmount: {
                    type: Number,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        winnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        winnerNotified: {
            type: Boolean,
            default: false,
        },
        paymentNotified: {
            type: Boolean,
            default: false,
        },
        saleStatus: {
            type: String,
            enum: ["pending", "claim-initiated", "paid"],
            default: "pending",
        },
        paymentOrderId: {
            type: String,
        },
        winnerClaimedAt: {
            type: Date,
        },
        winnerPaidAt: {
            type: Date,
        },
        lastBidAt: {
            type: Date,
        },
        details: {
            type: Map,
            of: String,
            default: {},
        },
        commission: {
            type: Number,
            default: 0,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster category queries
auctionSchema.index({ category: 1, status: 1 });

// Index for seller queries
auctionSchema.index({ sellerId: 1 });

module.exports = mongoose.model("Auction", auctionSchema);

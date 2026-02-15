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
        details: {
            type: Map,
            of: String,
            default: {},
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

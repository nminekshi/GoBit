const mongoose = require("mongoose");

const autoBidSettingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        auctionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
        },
        category: {
            type: String, // Optional: if category-level bots are used
        },
        maxBid: {
            type: Number,
            required: true,
            min: 1,
        },
        increment: {
            type: Number,
            default: 10, // Default increment
            min: 1,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Ensure a user can only have one auto-bid per auction
autoBidSettingSchema.index({ userId: 1, auctionId: 1 }, { unique: true });
autoBidSettingSchema.index({ auctionId: 1, isActive: 1, updatedAt: 1 });

module.exports = mongoose.model("AutoBidSetting", autoBidSettingSchema);

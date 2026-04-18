const mongoose = require("mongoose");

const botActivityLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        category: {
            type: String,
            required: true,
            index: true,
        },
        auctionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
        },
        action: {
            type: String,
            enum: ["bid_placed", "skipped", "paused", "error", "won", "budget_reached"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Optional: Index to easily find logs for a user + category
botActivityLogSchema.index({ userId: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model("BotActivityLog", botActivityLogSchema);

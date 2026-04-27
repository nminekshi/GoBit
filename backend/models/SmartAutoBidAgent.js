const mongoose = require("mongoose");

const smartAutoBidAgentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        category: {
            type: String,
            enum: ["watches", "vehicles", "electronics", "realestate", "art", "computers"],
            required: true,
            index: true,
        },
        maxBudget: {
            type: Number,
            required: true,
            min: 1,
        },
        bidIncrement: {
            type: Number,
            default: 10,
            min: 1,
        },
        maxConcurrentAuctions: {
            type: Number,
            default: 3,
            min: 1,
            max: 10,
        },
        isEnabled: {
            type: Boolean,
            default: true,
            index: true,
        },
        strategy: {
            type: String,
            enum: ["standard", "sniper", "aggressive"],
            default: "standard",
        },
        targetWinCount: {
            type: Number,
            default: 10,
            min: 1,
        },
        currentWinCount: {
            type: Number,
            default: 0,
        },
        isProcessing: {
            type: Boolean,
            default: false,
        },
        lastBudgetReachedAt: {
            type: Date,
        },
        filters: {
            priceMin: { type: Number, min: 0 },
            priceMax: { type: Number, min: 0 },
            dynamicFields: {
                type: Map,
                of: String
            }
        },
    },
    { timestamps: true }
);

smartAutoBidAgentSchema.index({ userId: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("SmartAutoBidAgent", smartAutoBidAgentSchema);

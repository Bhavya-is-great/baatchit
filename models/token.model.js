import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
    {
        value: {
            type: String,
            required: true,
            index: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["verification", "reset"],
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

// 🕒 Auto-delete token after expiration (TTL index)
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);
export default Token
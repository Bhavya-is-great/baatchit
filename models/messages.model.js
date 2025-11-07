import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        conversation_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        role: {
            type: String,
            enum: ["assistant", "user"],
            required: true,
        },

        IndexNum: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const Messages = mongoose.models.Messages || mongoose.model("Messages", MessageSchema);
export default Messages
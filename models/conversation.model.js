import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        title : {
            type: String,
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        aiModel: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);


const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
export default Conversation
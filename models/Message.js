import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    type : {
        type: String,
        required: "Type is required",
    },
    message: {
        type: String,
        required: "Message is required",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const model = mongoose.model("Message", MessageSchema);
export default model;
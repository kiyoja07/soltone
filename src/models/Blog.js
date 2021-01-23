import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    bloggername: String,
    bloggerlink: String,
    postdate: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const model = mongoose.model("Blog", BlogSchema);
export default model;
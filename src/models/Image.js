import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    type : {
        type: String,
        required: "Type is required",
    },
    fileUrl: {
        type: String,
        required: "File Url is required",
    },
    title: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const model = mongoose.model("Image", ImageSchema);
export default model;
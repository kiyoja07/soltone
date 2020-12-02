import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    avatarUrl: String,
    kakaotalkId: Number,
    naverId: Number,
    githubId: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const model = mongoose.model("User", UserSchema);
export default model;
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  landingUrl: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const model = mongoose.model("Post", PostSchema);
export default model;

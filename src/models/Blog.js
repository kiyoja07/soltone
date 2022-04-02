import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  // id: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  record_id: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image1: {
    type: String,
  },
  description1: {
    type: String,
  },
  image2: {
    type: String,
  },
  description2: {
    type: String,
  },
  image3: {
    type: String,
  },
  description3: {
    type: String,
  },
  image4: {
    type: String,
  },
  description4: {
    type: String,
  },
  image5: {
    type: String,
  },
  description5: {
    type: String,
  },
  outlink: {
    type: String,
  },
  postdate: {
    type: Date,
    required: true,
  },
  tags: {
    type: String,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const model = mongoose.model("Blog", BlogSchema);
export default model;

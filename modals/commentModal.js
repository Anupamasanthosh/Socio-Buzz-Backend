const mongoose = require("mongoose");
const User = require("./userModal");
const Post = require("./postModal");
const Comments = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Post,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  { collection: "Comments" }
);

const model = mongoose.model("Comments", Comments);

module.exports = model;

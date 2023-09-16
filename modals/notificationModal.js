const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModal");
const Post = require('./postModal');

const NotificationsSchema = new Schema(
  {
    type: {
      type: String,
      required: true
    },
    message: {
      type: String, 
      required: true
    },
    timestamp: {
      type: Date, 
      default: Date.now
    },
    user: {
      type: Schema.Types.ObjectId, 
      ref: User, 
      required: true
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: Post
    }
  },
  { collection: "Notifications" }
);

const NotificationsModel = mongoose.model("Notifications", NotificationsSchema);

module.exports = NotificationsModel;

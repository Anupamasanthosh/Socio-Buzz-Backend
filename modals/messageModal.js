const mongoose = require("mongoose");
const User = require("./userModal");

const Messages = new mongoose.Schema(
  {
    message: {
      text: {
        type: String,
        required: true,
      },
    },

    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
  },

  { collection: "Message-Data" }
);

const model = mongoose.model("MessageData", Messages);

module.exports = model;

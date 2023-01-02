const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    thumnail: {
      type: String,
      required: true,
    },
    des: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("News", newsSchema);

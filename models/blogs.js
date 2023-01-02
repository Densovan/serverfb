const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema(
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
      ref: "user",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Blogs", blogsSchema);

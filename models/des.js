const mongoose = require("mongoose");

const desSchema = new mongoose.Schema({
  des: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("des", desSchema);

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, maxlength: 1000 },
    hearts: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = mongoose.model("Post", PostSchema);

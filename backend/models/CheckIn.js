const mongoose = require("mongoose");

const CheckInSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    values: {
      sleep: { type: Number, min: 1, max: 5, required: true },
      stress: { type: Number, min: 1, max: 5, required: true },
      mood: { type: Number, min: 1, max: 5, required: true },
      energy: { type: Number, min: 1, max: 5, required: true },
      connection: { type: Number, min: 1, max: 5, required: true },
    },
    note: { type: String, maxlength: 2000, default: "" },
    avg: { type: Number, required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

CheckInSchema.index({ clientId: 1, createdAt: -1 });

module.exports = mongoose.model("CheckIn", CheckInSchema);

const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    counsellor: { type: String, required: true },
    slot: { type: String, required: true },
    concern: { type: String, maxlength: 2000, default: "" },
    studentName: { type: String, default: "Anonymous student" },
    anonymous: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

BookingSchema.index({ clientId: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", BookingSchema);

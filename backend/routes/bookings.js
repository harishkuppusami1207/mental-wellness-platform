const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// POST /api/bookings -> create a booking
router.post("/", async (req, res) => {
  try {
    const { clientId, counsellor, slot, concern, studentName, anonymous } = req.body;
    if (!clientId || !counsellor || !slot) {
      return res.status(400).json({ error: "clientId, counsellor and slot are required" });
    }
    const entry = await Booking.create({
      clientId,
      counsellor,
      slot,
      concern: concern || "",
      studentName: anonymous ? "Anonymous student" : studentName || "Anonymous student",
      anonymous: !!anonymous,
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/:clientId -> this client's bookings
router.get("/:clientId", async (req, res) => {
  try {
    const list = await Booking.find({ clientId: req.params.clientId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

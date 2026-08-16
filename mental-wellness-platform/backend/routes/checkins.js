const express = require("express");
const router = express.Router();
const CheckIn = require("../models/CheckIn");

// POST /api/checkins  -> save a new check-in
router.post("/", async (req, res) => {
  try {
    const { clientId, values, note } = req.body;
    if (!clientId || !values) {
      return res.status(400).json({ error: "clientId and values are required" });
    }
    const nums = Object.values(values);
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;

    const entry = await CheckIn.create({
      clientId,
      values,
      note: note || "",
      avg: Number(avg.toFixed(2)),
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/checkins/:clientId -> recent history for this anonymous client
router.get("/:clientId", async (req, res) => {
  try {
    const history = await CheckIn.find({ clientId: req.params.clientId })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

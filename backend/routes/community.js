const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// GET /api/community/posts -> most recent 100 posts, newest first
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(100);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/community/posts -> create an anonymous post
router.post("/posts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }
    const post = await Post.create({ text: text.trim() });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/community/posts/:id/heart -> send strength (+1 heart)
router.post("/posts/:id/heart", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

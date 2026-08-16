require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const checkinsRouter = require("./routes/checkins");
const bookingsRouter = require("./routes/bookings");
const communityRouter = require("./routes/community");
const contentRouter = require("./routes/content");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "here-now-backend" }));

app.use("/api/checkins", checkinsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/community", communityRouter);
app.use("/api/content", contentRouter);

// 404 fallback for unknown API routes
app.use("/api", (req, res) => res.status(404).json({ error: "not found" }));

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
});

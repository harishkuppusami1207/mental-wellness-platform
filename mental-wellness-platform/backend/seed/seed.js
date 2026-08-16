require("dotenv").config();
const connectDB = require("../config/db");
const Post = require("../models/Post");

const SAMPLE_POSTS = [
  { text: "First week of placements and I feel like everyone else has it figured out. Trying to remember that's probably not true.", hearts: 4 },
  { text: "Went to the counselling office for the first time today. Honestly wasn't as scary as I built it up to be.", hearts: 11 },
  { text: "Missing home a lot this week but also actually enjoying my classes for once, which feels confusing.", hearts: 6 },
];

(async () => {
  await connectDB();
  await Post.deleteMany({});
  await Post.insertMany(SAMPLE_POSTS);
  console.log(`[seed] inserted ${SAMPLE_POSTS.length} community posts`);
  process.exit(0);
})();

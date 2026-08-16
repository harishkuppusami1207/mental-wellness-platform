const express = require("express");
const router = express.Router();

// Static/reference content. In a larger system these would live in their own
// collections too (Article, Counsellor, Helpline) — kept inline here since
// they change rarely and are seeded once (see seed/seed.js for the DB-backed version).

const ARTICLES = [
  { id: "exam-stress", tag: "Exam stress", title: "The night before doesn't decide the outcome", body: "Cramming past midnight feels productive but sleep consolidates memory more than one extra hour of re-reading does. A short revision pass plus real sleep tends to outperform an all-nighter on recall the next morning.", image: "https://picsum.photos/seed/exam-stress/640/420" },
  { id: "sleep", tag: "Sleep", title: "Fixing sleep without fixing everything at once", body: "Pick one consistent wake time and hold it, even on weekends — it does more for your rhythm than an early bedtime you can't keep. The rest of the schedule tends to follow.", image: "https://picsum.photos/seed/sleep-routine/640/420" },
  { id: "belonging", tag: "Belonging", title: "Loneliness in a full room", body: "Feeling alone on a crowded campus is common in the first year and usually eases as familiar faces accumulate. Joining one small recurring group — a club, a study pair — builds that faster than large events do.", image: "https://picsum.photos/seed/belonging/640/420" },
  { id: "anxiety", tag: "Anxiety", title: "What a racing mind is actually doing", body: "Anxious thinking is the mind rehearsing worst cases to feel prepared, not a sign that something is truly wrong right now. Naming the pattern ('this is rehearsal') can loosen its grip faster than arguing with the content.", image: "https://picsum.photos/seed/anxiety-calm/640/420" },
  { id: "home", tag: "Home", title: "Missing home without wanting to leave", body: "Homesickness and enjoying college aren't contradictions — both can be true in the same week. Short, scheduled calls home tend to help more than long irregular ones.", image: "https://picsum.photos/seed/missing-home/640/420" },
  { id: "routine", tag: "Routine", title: "A routine that survives a bad week", body: "A schedule that only works when everything goes right will fail you exactly when you need it. Build in a minimum version of each habit — five minutes counts — so a bad week bends the routine instead of breaking it.", image: "https://picsum.photos/seed/routine-week/640/420" },
];

const COUNSELLORS = [
  { name: "Mrs. S. Vigneshwari", focus: "Academic stress, exam anxiety", photo: "https://picsum.photos/seed/counsellor-vigneshwari/200/200" },
  { name: "Mrs. R. Vaishnavi Karthika", focus: "Adjustment, homesickness", photo: "https://picsum.photos/seed/counsellor-vaishnavi/200/200" },
  { name: "Dr. B. Annapoorani", focus: "Mood, motivation, general wellbeing", photo: "https://picsum.photos/seed/counsellor-annapoorani/200/200" },
];

const SLOTS = ["Mon 3:00 PM", "Tue 11:00 AM", "Wed 4:30 PM", "Thu 10:00 AM", "Fri 2:00 PM"];

const HELPLINES = [
  { name: "Tele-MANAS", number: "14416", note: "Govt. of India · 24/7 · free · 20+ languages", href: "tel:14416" },
  { name: "Tele-MANAS (toll-free)", number: "1-800-891-4416", note: "Same service, toll-free landline number", href: "tel:18008914416" },
  { name: "KIRAN Mental Health Helpline", number: "1800-599-0019", note: "Govt. of India · 24/7", href: "tel:18005990019" },
  { name: "Emergency services", number: "112", note: "Immediate physical danger to yourself or someone else", href: "tel:112" },
];

router.get("/articles", (req, res) => res.json(ARTICLES));
router.get("/counsellors", (req, res) => res.json(COUNSELLORS));
router.get("/slots", (req, res) => res.json(SLOTS));
router.get("/helplines", (req, res) => res.json(HELPLINES));

module.exports = router;

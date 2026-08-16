# Here, Now — Student Mental Wellness Platform

Full-stack version of the mental wellness platform: React frontend (with images),
Node.js/Express backend, and MongoDB database.

```
mental-wellness-platform/
├── backend/            Express API + Mongoose models (MongoDB)
│   ├── models/          CheckIn, Booking, Post
│   ├── routes/          checkins, bookings, community, content (articles/counsellors/helplines)
│   ├── seed/             sample data for the community wall
│   └── server.js
├── frontend/           Vite + React app (ported from the original artifact)
│   └── src/
│       ├── App.jsx      all screens: Home, Check-in, Learn, Talk, Community, Crisis
│       └── api.js       fetch client that talks to the backend
└── docker-compose.yml  one-command Mongo + backend
```

## Quick start (Docker for backend + DB, Vite for frontend)

```bash
# 1. Start MongoDB + the API
docker compose up -d

# 2. Start the frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173 — the app talks to the API at http://localhost:4000/api.

## Quick start (fully manual, no Docker)

You need MongoDB running locally (or a free Atlas cluster — just swap the
connection string).

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env      # edit MONGODB_URI if not using local Mongo
npm install
npm run seed               # optional: adds a few sample community posts
npm run dev                 # http://localhost:4000

# Terminal 2 — frontend
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

## API reference

| Method | Path                              | Purpose                                  |
|--------|------------------------------------|-------------------------------------------|
| GET    | /api/health                       | health check                              |
| GET    | /api/content/articles             | Learn articles (with images)              |
| GET    | /api/content/counsellors          | counsellor list (with photos)             |
| GET    | /api/content/slots                | bookable time slots                       |
| GET    | /api/content/helplines            | crisis helplines                          |
| POST   | /api/checkins                     | save a check-in `{clientId, values, note}`|
| GET    | /api/checkins/:clientId           | a client's check-in history               |
| POST   | /api/bookings                     | create a counsellor booking               |
| GET    | /api/bookings/:clientId           | a client's bookings                       |
| GET    | /api/community/posts              | all community wall posts                  |
| POST   | /api/community/posts              | create an anonymous post `{text}`         |
| POST   | /api/community/posts/:id/heart    | send strength (+1 heart) to a post        |

## Data model (MongoDB / Mongoose)

- **CheckIn** — `clientId`, `values` (sleep/stress/mood/energy/connection 1–5), `note`, `avg`, `createdAt`
- **Booking** — `clientId`, `counsellor`, `slot`, `concern`, `studentName`, `anonymous`, `createdAt`
- **Post** — `text`, `hearts`, `createdAt`

Check-ins and bookings are private per anonymous browser (`clientId`, a random
UUID generated client-side and stored in `localStorage` — no login required).
Community posts are shared and public to everyone using the app.

## Images

Article thumbnails, the home-page hero image, and counsellor photos are pulled
from Lorem Picsum (`picsum.photos`), a free placeholder image service, keyed by
a stable seed so each one stays consistent across reloads. Swap these URLs for
your own photography/illustrations by editing `backend/routes/content.js`
(`image` / `photo` fields) — the frontend just renders whatever URL the API
returns, so no frontend changes are needed.

## Notes

- This is a support tool, not a clinical or emergency service — the "Get help
  now" tab and the disclaimers throughout are intentional and should stay.
- CORS is restricted to `CLIENT_ORIGIN` in production; update `.env` accordingly.

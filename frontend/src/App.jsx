import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Wind, Heart, BookOpen, MessageCircle, Users, PhoneCall,
  Moon, Sun, Sunrise, Sunset, Send, ChevronRight, X,
  CalendarCheck, Clock, ShieldCheck, Sparkles, ArrowLeft,
} from "lucide-react";
import { api, getClientId } from "./api";

/* ============================================================
   Digital Mental Health & Psychological Support System
   for Students in Higher Education

   Design tokens
   -------------
   Color   ink #1F2A20 · paper #F1EFE6 · sage #6E8F6B · sage-deep #4C6B4A
           lavender #8B80A8 · amber #E2A64B · rescue #B4574F · line #DAD6C6
   Type    Display: Fraunces (warm serif, used with restraint)
           Body: Work Sans (humanist sans)
           Utility: IBM Plex Mono (timestamps, tags, counters)
   Signature: the "breathing companion" — a slow, physically accurate
   4-4-6 breathing circle that anchors the home screen and doubles as
   a real grounding tool inside Get Help Now.
   ============================================================ */

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --ink: #1F2A20;
  --paper: #F1EFE6;
  --paper-raised: #FBFAF4;
  --sage: #5B8AA6;
  --sage-deep: #3E6B85;
  --sage-tint: #E1EBF0;
  --lavender: #8B80A8;
  --lavender-tint: #EBE8F3;
  --amber: #E2A64B;
  --amber-tint: #FBEEDA;
  --rescue: #B4574F;
  --rescue-tint: #F5E4E2;
  --line: #DAD6C6;
}

.font-display { font-family: 'Fraunces', serif; }
.font-body { font-family: 'Work Sans', sans-serif; }
.font-mono { font-family: 'IBM Plex Mono', monospace; }

.mwp-root { background: var(--paper); color: var(--ink); font-family: 'Work Sans', sans-serif; }
.mwp-card { background: var(--paper-raised); border: 1px solid var(--line); }
.mwp-btn-primary { background: var(--sage-deep); color: var(--paper-raised); }
.mwp-btn-primary:hover { background: var(--ink); }
.mwp-btn-ghost { background: transparent; border: 1px solid var(--line); color: var(--ink); }
.mwp-btn-ghost:hover { border-color: var(--sage-deep); color: var(--sage-deep); }
.mwp-pill-rescue { background: var(--rescue); color: var(--paper-raised); }
.mwp-pill-rescue:hover { background: #963E37; }
.mwp-nav-item { color: #6B6656; }
.mwp-nav-item.active { color: var(--ink); }
.mwp-nav-item.active .mwp-nav-underline { opacity: 1; transform: scaleX(1); }
.mwp-nav-underline { opacity: 0; transform: scaleX(0.4); transition: all 0.25s ease; background: var(--sage-deep); }

@keyframes breatheIn { from { transform: scale(0.62); } to { transform: scale(1); } }
@keyframes breatheOut { from { transform: scale(1); } to { transform: scale(0.62); } }

.mwp-scroll::-webkit-scrollbar { width: 6px; }
.mwp-scroll::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }

@media (prefers-reduced-motion: reduce) {
  .mwp-breath-circle { transition: none !important; animation: none !important; }
}
`;

/* ---------------- small UI atoms ---------------- */
function Pill({ children, style }) {
  return (
    <span
      className="font-mono text-[11px] tracking-wide uppercase px-2 py-1 rounded-full"
      style={{ background: "var(--sage-tint)", color: "var(--sage-deep)", ...style }}
    >
      {children}
    </span>
  );
}

function SectionEyebrow({ children }) {
  return (
    <div className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: "#8A8471" }}>
      {children}
    </div>
  );
}

/* ---------------- Breathing companion (signature element) ---------------- */
function BreathingCompanion({ size = 220, autoLabel = true }) {
  const [phase, setPhase] = useState("rest"); // rest | in | hold | out
  const [running, setRunning] = useState(false);
  const timeouts = useRef([]);

  const clearAll = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  const cycle = useCallback(() => {
    setPhase("in");
    timeouts.current.push(setTimeout(() => setPhase("hold"), 4000));
    timeouts.current.push(setTimeout(() => setPhase("out"), 8000));
    timeouts.current.push(setTimeout(() => {
      setPhase("rest");
      timeouts.current.push(setTimeout(cycle, 600));
    }, 14000));
  }, []);

  useEffect(() => {
    if (running) cycle();
    else { clearAll(); setPhase("rest"); }
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const scale = phase === "in" ? 1 : phase === "hold" ? 1 : phase === "out" ? 0.62 : 0.62;
  const duration = phase === "in" ? "4s" : phase === "out" ? "6s" : "0.4s";
  const label = { rest: "Tap to begin", in: "Breathe in", hold: "Hold", out: "Breathe out" }[phase];

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => setRunning((r) => !r)}
        aria-label={running ? "Stop breathing exercise" : "Start breathing exercise"}
        className="relative flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
        style={{ width: size, height: size, focusRingColor: "var(--sage-deep)" }}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--sage-tint)" }}
        />
        <span
          className="mwp-breath-circle absolute rounded-full"
          style={{
            width: size, height: size,
            background: "linear-gradient(155deg, var(--sage) 0%, var(--sage-deep) 100%)",
            transform: `scale(${scale})`,
            transition: `transform ${duration} ease-in-out`,
          }}
        />
        <span className="relative z-10 font-display text-lg" style={{ color: "var(--paper-raised)" }}>
          {autoLabel ? label : ""}
        </span>
      </button>
      <p className="font-body text-sm text-center max-w-[220px]" style={{ color: "#6B6656" }}>
        {running ? "4 seconds in, 4 hold, 6 out. Follow the circle for a few rounds." : "A slow 4–4–6 count can help settle a racing mind before anything else."}
      </p>
    </div>
  );
}

/* ---------------- Home ---------------- */
function greetingFor(hour) {
  if (hour < 5) return { text: "Still up", Icon: Moon };
  if (hour < 12) return { text: "Good morning", Icon: Sunrise };
  if (hour < 17) return { text: "Good afternoon", Icon: Sun };
  if (hour < 21) return { text: "Good evening", Icon: Sunset };
  return { text: "Good evening", Icon: Moon };
}

function Home({ go, name }) {
  const { text, Icon } = greetingFor(new Date().getHours());
  return (
    <div className="max-w-3xl mx-auto px-5 pt-10 pb-24">
      <div className="flex items-center gap-2 mb-3" style={{ color: "#8A8471" }}>
        <Icon size={16} />
        <span className="font-mono text-[12px] uppercase tracking-wide">{text}{name ? `, ${name}` : ""}</span>
      </div>

      <div className="grid sm:grid-cols-[1.3fr_1fr] gap-6 items-center mb-10">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] mb-4" style={{ color: "var(--ink)" }}>
            A quieter corner of<br />campus, open anytime.
          </h1>
          <p className="font-body text-base max-w-md" style={{ color: "#5B5647" }}>
            Check in with yourself, read something grounding, or talk to a real person —
            whichever fits today. Nothing here replaces a professional, and help is always one tap away.
          </p>
        </div>
        <img
          src="https://picsum.photos/seed/here-now-hero/700/500"
          alt="Calm campus courtyard at golden hour"
          className="w-full h-44 sm:h-56 object-cover rounded-2xl"
          style={{ border: "1px solid var(--line)" }}
        />
      </div>

      <div className="mwp-card rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-8">
        <BreathingCompanion />
        <div className="flex-1">
          <SectionEyebrow>Right now</SectionEyebrow>
          <p className="font-body text-sm mb-4" style={{ color: "#5B5647" }}>
            Exams close, sleep short, group chat loud — whatever brought you here, start
            with one slow breath. Then choose where you'd like to go next.
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => go("checkin")} className="mwp-btn-primary rounded-full px-4 py-2 text-sm font-body font-medium">
              Check in with yourself
            </button>
            <button onClick={() => go("talk")} className="mwp-btn-ghost rounded-full px-4 py-2 text-sm font-body font-medium">
              Talk to a counsellor
            </button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { id: "learn", Icon: BookOpen, title: "Learn", desc: "Short reads on stress, sleep and belonging." },
          { id: "community", Icon: Users, title: "Community wall", desc: "Anonymous, kind, moderated." },
          { id: "crisis", Icon: PhoneCall, title: "Get help now", desc: "Real numbers, staffed 24/7." , rescue: true},
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => go(c.id)}
            className="mwp-card rounded-2xl p-5 text-left hover:-translate-y-0.5 transition-transform"
            style={c.rescue ? { borderColor: "var(--rescue)" } : {}}
          >
            <c.Icon size={20} style={{ color: c.rescue ? "var(--rescue)" : "var(--sage-deep)" }} />
            <div className="font-display text-lg mt-3 mb-1">{c.title}</div>
            <p className="font-body text-sm" style={{ color: "#6B6656" }}>{c.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Check-in (reflective, not diagnostic) ---------------- */
const CHECKIN_DIMENSIONS = [
  { key: "sleep", label: "Sleep", low: "Barely any", high: "Rested" },
  { key: "stress", label: "Pressure you're under", low: "Overwhelming", high: "Manageable" },
  { key: "mood", label: "Overall mood", low: "Heavy", high: "Light" },
  { key: "energy", label: "Energy", low: "Running on empty", high: "Steady" },
  { key: "connection", label: "Feeling connected to people", low: "Isolated", high: "Supported" },
];

function reflectionFor(avg) {
  if (avg >= 4) return { tone: "sage", text: "Today reads fairly steady. Keep doing whatever's working — and it's still worth noting what helped." };
  if (avg >= 2.6) return { tone: "amber", text: "A mixed day. Nothing here needs fixing immediately, but a short break or a walk between tasks might help." };
  return { tone: "rescue", text: "Today sounds genuinely hard. That's worth taking seriously — please consider talking to a counsellor this week, and the helplines below are there for anything more urgent." };
}

function CheckIn({ go }) {
  const [values, setValues] = useState({ sleep: 3, stress: 3, mood: 3, energy: 3, connection: 3 });
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const h = await api.getCheckins(getClientId());
        setHistory(h);
      } catch {
        // backend not reachable yet — fail quietly, form still works
      }
    })();
  }, []);

  const avg = Object.values(values).reduce((a, b) => a + b, 0) / 5;
  const reflection = reflectionFor(avg);

  const submit = async () => {
    setSaving(true);
    try {
      await api.submitCheckin({ clientId: getClientId(), values, note });
      const h = await api.getCheckins(getClientId());
      setHistory(h);
      setSubmitted(true);
    } catch (err) {
      alert(`Couldn't save your check-in: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-5 pt-16 pb-24 text-center">
        <Sparkles size={22} style={{ color: "var(--sage-deep)" }} className="mx-auto mb-4" />
        <h2 className="font-display text-3xl mb-3">Logged. Thank you for pausing.</h2>
        <p
          className="font-body text-sm rounded-xl p-4 mb-6 text-left"
          style={{
            background: reflection.tone === "rescue" ? "var(--rescue-tint)" : reflection.tone === "amber" ? "var(--amber-tint)" : "var(--sage-tint)",
            color: "var(--ink)",
          }}
        >
          {reflection.text}
        </p>
        <p className="font-body text-xs mb-6" style={{ color: "#8A8471" }}>
          This is a private reflection, not a clinical score or diagnosis — only something to notice patterns from over time.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {reflection.tone === "rescue" && (
            <button onClick={() => go("crisis")} className="mwp-pill-rescue rounded-full px-5 py-2.5 text-sm font-body font-medium">
              See support options
            </button>
          )}
          <button onClick={() => go("talk")} className="mwp-btn-ghost rounded-full px-5 py-2.5 text-sm font-body font-medium">
            Book a counsellor
          </button>
          <button onClick={() => { setSubmitted(false); }} className="mwp-btn-ghost rounded-full px-5 py-2.5 text-sm font-body font-medium">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 pt-10 pb-24">
      <SectionEyebrow>Two minutes, private to you</SectionEyebrow>
      <h1 className="font-display text-3xl sm:text-4xl mb-2">How's today, really?</h1>
      <p className="font-body text-sm mb-8" style={{ color: "#6B6656" }}>
        Slide each one honestly. There's no score to pass — it's just a mirror.
      </p>

      <div className="space-y-7">
        {CHECKIN_DIMENSIONS.map((d) => (
          <div key={d.key}>
            <div className="flex justify-between items-baseline mb-2">
              <label className="font-body text-sm font-medium">{d.label}</label>
              <span className="font-mono text-xs" style={{ color: "#8A8471" }}>{values[d.key]}/5</span>
            </div>
            <input
              type="range" min={1} max={5} step={1}
              value={values[d.key]}
              onChange={(e) => setValues((v) => ({ ...v, [d.key]: Number(e.target.value) }))}
              className="w-full accent-[#4C6B4A]"
            />
            <div className="flex justify-between font-body text-[11px] mt-1" style={{ color: "#A6A08D" }}>
              <span>{d.low}</span>
              <span>{d.high}</span>
            </div>
          </div>
        ))}

        <div>
          <label className="font-body text-sm font-medium block mb-2">Anything you want to note? (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Just for you — not shared with anyone."
            className="w-full rounded-xl p-3 font-body text-sm mwp-card focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={submit}
        disabled={saving}
        className="mwp-btn-primary rounded-full px-6 py-3 text-sm font-body font-medium mt-8 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save today's check-in"}
      </button>

      {history.length > 0 && (
        <div className="mt-12">
          <SectionEyebrow>Recent</SectionEyebrow>
          <div className="space-y-2">
            {history.slice(0, 5).map((h) => (
              <div key={h._id} className="mwp-card rounded-lg px-4 py-3 flex justify-between items-center">
                <span className="font-mono text-xs" style={{ color: "#8A8471" }}>
                  {new Date(h.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
                <span className="font-body text-sm">{h.avg.toFixed(1)} / 5 average</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Learn ---------------- */
function Learn() {
  const [articles, setArticles] = useState([]);
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setArticles(await api.getArticles());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-5 pt-10 pb-24">
      <SectionEyebrow>Short reads, five minutes or less</SectionEyebrow>
      <h1 className="font-display text-4xl mb-8">Learn</h1>

      {loading ? (
        <p className="font-mono text-xs" style={{ color: "#8A8471" }}>Loading articles…</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {articles.map((a) => (
            <button key={a.id} onClick={() => setOpen(a)} className="mwp-card rounded-2xl overflow-hidden text-left hover:-translate-y-0.5 transition-transform">
              <img src={a.image} alt={a.title} className="w-full h-32 object-cover" />
              <div className="p-5">
                <Pill>{a.tag}</Pill>
                <div className="font-display text-lg mt-3 mb-1 leading-snug">{a.title}</div>
                <p className="font-body text-sm line-clamp-2" style={{ color: "#6B6656" }}>{a.body}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" style={{ background: "rgba(31,42,32,0.45)" }} onClick={() => setOpen(null)}>
          <div className="mwp-card rounded-t-3xl sm:rounded-3xl max-w-lg w-full overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <img src={open.image} alt={open.title} className="w-full h-40 object-cover" />
            <div className="p-7">
              <button onClick={() => setOpen(null)} className="absolute top-5 right-5" aria-label="Close">
                <X size={18} />
              </button>
              <Pill>{open.tag}</Pill>
              <h2 className="font-display text-2xl mt-3 mb-3">{open.title}</h2>
              <p className="font-body text-sm leading-relaxed" style={{ color: "#5B5647" }}>{open.body}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Talk to someone (booking) ---------------- */
function Talk() {
  const [counsellors, setCounsellors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [counsellor, setCounsellor] = useState("");
  const [slot, setSlot] = useState("");
  const [studentName, setStudentName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [concern, setConcern] = useState("");
  const [booked, setBooked] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, s] = await Promise.all([api.getCounsellors(), api.getSlots()]);
      setCounsellors(c);
      setSlots(s);
      setCounsellor(c[0]?.name || "");
      setSlot(s[0] || "");
    })();
  }, []);

  const submit = async () => {
    setSaving(true);
    try {
      const entry = await api.submitBooking({
        clientId: getClientId(),
        counsellor, slot, concern,
        studentName, anonymous,
      });
      setBooked(entry);
    } catch (err) {
      alert(`Couldn't complete the booking: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (booked) {
    return (
      <div className="max-w-lg mx-auto px-5 pt-16 pb-24 text-center">
        <CalendarCheck size={24} style={{ color: "var(--sage-deep)" }} className="mx-auto mb-4" />
        <h2 className="font-display text-3xl mb-3">You're booked</h2>
        <div className="mwp-card rounded-2xl p-5 text-left font-body text-sm space-y-2 mb-6">
          <div><strong>With:</strong> {booked.counsellor}</div>
          <div><strong>When:</strong> {booked.slot}</div>
          <div><strong>As:</strong> {booked.studentName}</div>
          {booked.concern && <div><strong>Note:</strong> {booked.concern}</div>}
        </div>
        <p className="font-body text-xs mb-6" style={{ color: "#8A8471" }}>
          A confirmation would normally be emailed by the counselling office. If anything feels urgent before this slot, don't wait — see Get Help Now.
        </p>
        <button onClick={() => setBooked(null)} className="mwp-btn-ghost rounded-full px-5 py-2.5 text-sm font-body font-medium">
          Book another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 pt-10 pb-24">
      <SectionEyebrow>Confidential, no explanation required</SectionEyebrow>
      <h1 className="font-display text-4xl mb-8">Talk to someone</h1>

      <div className="space-y-6">
        <div>
          <label className="font-body text-sm font-medium block mb-2">Choose a counsellor</label>
          <div className="space-y-2">
            {counsellors.map((c) => (
              <button
                key={c.name}
                onClick={() => setCounsellor(c.name)}
                className="w-full text-left rounded-xl p-4 flex items-center gap-3 mwp-card"
                style={counsellor === c.name ? { borderColor: "var(--sage-deep)", background: "var(--sage-tint)" } : {}}
              >
                <img src={c.photo} alt={c.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-body text-sm font-medium">{c.name}</div>
                  <div className="font-body text-xs" style={{ color: "#8A8471" }}>{c.focus}</div>
                </div>
                {counsellor === c.name && <ChevronRight size={16} style={{ color: "var(--sage-deep)" }} />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-body text-sm font-medium block mb-2">Pick a slot this week</label>
          <div className="flex flex-wrap gap-2">
            {slots.map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className="font-mono text-xs rounded-full px-3 py-2 mwp-card flex items-center gap-1"
                style={slot === s ? { borderColor: "var(--sage-deep)", background: "var(--sage-tint)" } : {}}
              >
                <Clock size={12} /> {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input id="anon" type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
          <label htmlFor="anon" className="font-body text-sm">Book anonymously</label>
        </div>

        {!anonymous && (
          <div>
            <label className="font-body text-sm font-medium block mb-2">Your name</label>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Harish K"
              className="w-full rounded-xl p-3 font-body text-sm mwp-card focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="font-body text-sm font-medium block mb-2">What's on your mind? (optional)</label>
          <textarea
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            rows={3}
            placeholder="A line or two is plenty — the counsellor will ask more in person."
            className="w-full rounded-xl p-3 font-body text-sm mwp-card focus:outline-none"
          />
        </div>
      </div>

      <button onClick={submit} disabled={saving || !counsellor || !slot} className="mwp-btn-primary rounded-full px-6 py-3 text-sm font-body font-medium mt-8 disabled:opacity-60">
        {saving ? "Booking…" : "Confirm booking"}
      </button>
    </div>
  );
}

/* ---------------- Community wall ---------------- */
function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function Community() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setPosts(await api.getPosts());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const post = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      await api.submitPost(text.trim());
      setText("");
      setPosts(await api.getPosts());
    } catch (err) {
      alert(`Couldn't post: ${err.message}`);
    } finally {
      setPosting(false);
    }
  };

  const sendStrength = async (id) => {
    const updated = await api.heartPost(id);
    setPosts((prev) => prev.map((p) => (p._id === id ? updated : p)));
  };

  return (
    <div className="max-w-2xl mx-auto px-5 pt-10 pb-24">
      <SectionEyebrow>Anonymous · visible to every student here</SectionEyebrow>
      <h1 className="font-display text-4xl mb-2">Community wall</h1>
      <p className="font-body text-sm mb-6" style={{ color: "#6B6656" }}>
        Share what's on your mind, or send strength to someone else's. Posts are anonymous and this space is moderated — no names, no identifying details.
      </p>

      <div className="mwp-card rounded-2xl p-4 mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="What's on your mind today?"
          className="w-full font-body text-sm focus:outline-none resize-none"
        />
        <div className="flex justify-end mt-2">
          <button onClick={post} disabled={posting || !text.trim()} className="mwp-btn-primary rounded-full px-4 py-2 text-sm font-body font-medium flex items-center gap-2 disabled:opacity-50">
            <Send size={14} /> Post anonymously
          </button>
        </div>
      </div>

      {loading ? (
        <p className="font-mono text-xs" style={{ color: "#8A8471" }}>Loading wall…</p>
      ) : posts.length === 0 ? (
        <p className="font-body text-sm" style={{ color: "#8A8471" }}>Nobody's posted yet — be the first.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p._id} className="mwp-card rounded-xl p-4">
              <p className="font-body text-sm mb-3">{p.text}</p>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[11px]" style={{ color: "#A6A08D" }}>{timeAgo(p.createdAt)}</span>
                <button onClick={() => sendStrength(p._id)} className="flex items-center gap-1 font-mono text-[11px]" style={{ color: "var(--sage-deep)" }}>
                  <Heart size={13} /> {p.hearts > 0 ? p.hearts : ""} Sending strength
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Crisis / Get help now ---------------- */
function Crisis() {
  const [helplines, setHelplines] = useState([]);

  useEffect(() => {
    (async () => setHelplines(await api.getHelplines()))();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-5 pt-10 pb-24">
      <div className="rounded-2xl p-6 mb-8" style={{ background: "var(--rescue-tint)" }}>
        <div className="flex items-center gap-2 mb-2" style={{ color: "var(--rescue)" }}>
          <ShieldCheck size={18} />
          <span className="font-mono text-xs uppercase tracking-wide">If you are in danger right now</span>
        </div>
        <p className="font-body text-sm mb-4">Call 112, or a helpline below. You don't need the right words — just call.</p>
        <a href="tel:14416" className="mwp-pill-rescue rounded-full px-5 py-2.5 text-sm font-body font-medium inline-flex items-center gap-2">
          <PhoneCall size={15} /> Call Tele-MANAS · 14416
        </a>
      </div>

      <SectionEyebrow>Free, confidential, staffed by trained counsellors</SectionEyebrow>
      <h1 className="font-display text-3xl mb-6">Numbers worth saving</h1>
      <div className="space-y-3 mb-10">
        {helplines.map((h) => (
          <a key={h.number} href={h.href} className="mwp-card rounded-xl p-4 flex justify-between items-center hover:-translate-y-0.5 transition-transform">
            <div>
              <div className="font-body text-sm font-medium">{h.name}</div>
              <div className="font-body text-xs" style={{ color: "#8A8471" }}>{h.note}</div>
            </div>
            <div className="font-mono text-sm font-medium" style={{ color: "var(--sage-deep)" }}>{h.number}</div>
          </a>
        ))}
      </div>

      <SectionEyebrow>While you wait, or in between</SectionEyebrow>
      <div className="mwp-card rounded-2xl p-6 flex flex-col items-center">
        <BreathingCompanion size={180} />
      </div>

      <p className="font-body text-xs mt-8 text-center" style={{ color: "#A6A08D" }}>
        This platform supports students but is not a replacement for emergency or clinical care.
        If you're ever unsure, calling a helpline is always the right call.
      </p>
    </div>
  );
}

/* ---------------- Nav / App shell ---------------- */
const TABS = [
  { id: "home", label: "Home", Icon: Sparkles },
  { id: "checkin", label: "Check in", Icon: Wind },
  { id: "learn", label: "Learn", Icon: BookOpen },
  { id: "talk", label: "Talk", Icon: MessageCircle },
  { id: "community", label: "Community", Icon: Users },
];

export default function App() {
  const [tab, setTab] = useState("home");

  useEffect(() => {
    const el = document.createElement("style");
    el.innerHTML = FONTS_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const go = (id) => { setTab(id); window.scrollTo(0, 0); };

  return (
    <div className="mwp-root min-h-screen">
      {/* top bar */}
      <header className="sticky top-0 z-40 backdrop-blur border-b" style={{ background: "rgba(241,239,230,0.9)", borderColor: "var(--line)" }}>
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={() => go("home")} className="font-display text-lg" style={{ color: "var(--ink)" }}>
            Here, Now
          </button>
          <nav className="hidden sm:flex items-center gap-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`mwp-nav-item ${tab === t.id ? "active" : ""} relative pb-1 font-body text-sm`}
              >
                {t.label}
                <span className="mwp-nav-underline absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full" />
              </button>
            ))}
          </nav>
          <button onClick={() => go("crisis")} className="mwp-pill-rescue rounded-full px-3.5 py-1.5 text-xs font-body font-medium flex items-center gap-1.5">
            <PhoneCall size={13} /> <span className="hidden xs:inline">Get help now</span><span className="xs:hidden">Help</span>
          </button>
        </div>
      </header>

      <main>
        {tab === "home" && <Home go={go} />}
        {tab === "checkin" && <CheckIn go={go} />}
        {tab === "learn" && <Learn />}
        {tab === "talk" && <Talk />}
        {tab === "community" && <Community />}
        {tab === "crisis" && (
          <div className="max-w-2xl mx-auto px-5 pt-4">
            <button onClick={() => go("home")} className="flex items-center gap-1 font-body text-xs mb-2" style={{ color: "#8A8471" }}>
              <ArrowLeft size={13} /> Back
            </button>
            <Crisis />
          </div>
        )}
      </main>

      {/* mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex justify-around py-2" style={{ background: "rgba(251,250,244,0.96)", borderColor: "var(--line)" }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => go(t.id)} className="flex flex-col items-center gap-0.5 px-2 py-1">
            <t.Icon size={18} style={{ color: tab === t.id ? "var(--sage-deep)" : "#A6A08D" }} />
            <span className="font-mono text-[10px]" style={{ color: tab === t.id ? "var(--sage-deep)" : "#A6A08D" }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

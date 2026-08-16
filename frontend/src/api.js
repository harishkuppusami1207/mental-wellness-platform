const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

/* Anonymous per-browser identity, used only so a student can see their own
   private check-in and booking history. No name, email, or account required. */
export function getClientId() {
  let id = localStorage.getItem("hn:clientId");
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem("hn:clientId", id);
  }
  return id;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // static/reference content
  getArticles: () => request("/content/articles"),
  getCounsellors: () => request("/content/counsellors"),
  getSlots: () => request("/content/slots"),
  getHelplines: () => request("/content/helplines"),

  // check-ins (private to this anonymous client)
  getCheckins: (clientId) => request(`/checkins/${clientId}`),
  submitCheckin: (payload) =>
    request("/checkins", { method: "POST", body: JSON.stringify(payload) }),

  // bookings
  submitBooking: (payload) =>
    request("/bookings", { method: "POST", body: JSON.stringify(payload) }),

  // community wall (shared)
  getPosts: () => request("/community/posts"),
  submitPost: (text) =>
    request("/community/posts", { method: "POST", body: JSON.stringify({ text }) }),
  heartPost: (id) => request(`/community/posts/${id}/heart`, { method: "POST" }),
};

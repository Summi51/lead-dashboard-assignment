
const API_BASE = "https://lead-dashboard-assignment.onrender.com/api";

const Auth = {
  getToken() {
    return localStorage.getItem("fute_token");
  },
  setSession(token, user) {
    localStorage.setItem("fute_token", token);
    localStorage.setItem("fute_user", JSON.stringify(user));
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem("fute_user"));
    } catch {
      return null;
    }
  },
  clear() {
    localStorage.removeItem("fute_token");
    localStorage.removeItem("fute_user");
  },
  isLoggedIn() {
    return !!this.getToken();
  },
};

async function apiRequest(path, { method = "GET", body, isCsv = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = Auth.getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    Auth.clear();
    window.location.href = "index.html";
    throw new Error("Session expired. Please log in again.");
  }

  if (isCsv) {
    return res.blob();
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.message || (data.errors && data.errors.join(" ")) || "Request failed.";
    throw new Error(message);
  }
  return data;
}

const Api = {
  login: (email, password) => apiRequest("/login", { method: "POST", body: { email, password } }),
  getLeads: (params = "") => apiRequest(`/leads${params}`),
  getLead: (id) => apiRequest(`/leads/${id}`),
  createLead: (payload) => apiRequest("/leads", { method: "POST", body: payload }),
  updateLead: (id, payload) => apiRequest(`/leads/${id}`, { method: "PUT", body: payload }),
  deleteLead: (id) => apiRequest(`/leads/${id}`, { method: "DELETE" }),
  getSummary: () => apiRequest("/leads/summary/stats"),
  exportCsv: () => apiRequest("/leads/export/csv", { isCsv: true }),
};

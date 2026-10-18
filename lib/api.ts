export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

function setCookie(name: string, value: string) {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=${value}; path=/; SameSite=Lax; Max-Age=604800`;
}

function clearCookie(name: string) {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=/; Max-Age=0`;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  setCookie("access_token", access);
  setCookie("refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  clearCookie("access_token");
  clearCookie("refresh_token");
}

export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    if (data.access) {
      localStorage.setItem("access_token", data.access);
      setCookie("access_token", data.access);
      return data.access;
    }
    return null;
  } catch {
    return null;
  }
}

let isRefreshing = false;

export async function api(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // If 401 and not already refreshing, try to refresh the access token once
  if (res.status === 401 && !isRefreshing) {
    isRefreshing = true;
    const newToken = await refreshAccessToken();
    isRefreshing = false;

    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } else {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = typeof data === "string" ? data : JSON.stringify(data);
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const auth = {
  register: (payload: any) => api("/api/auth/register/", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: any) => api("/api/auth/login/", { method: "POST", body: JSON.stringify(payload) }),
  logout: (refresh: string) => api("/api/auth/logout/", { method: "POST", body: JSON.stringify({ refresh }) }),
};

export const wallet = { overview: () => api("/api/wallet/") };

export const transactions = {
  list: () => api("/api/transactions/"),
  byRef: (ref: string) => api(`/api/transactions/${ref}/`),
  transfer: (payload: any) => api("/api/transfers/", { method: "POST", body: JSON.stringify(payload) }),
};

export const requests = {
  list: () => api("/api/payment-requests/"),
  create: (payload: any) => api("/api/payment-requests/", { method: "POST", body: JSON.stringify(payload) }),
  pay: (ref: string) => api(`/api/payment-requests/${ref}/pay/`, { method: "POST", body: JSON.stringify({}) }),
};

export const users = { lookup: (q: string) => api(`/api/users/lookup/?q=${encodeURIComponent(q)}`) };

export const reports = { create: (payload: any) => api("/api/reports/", { method: "POST", body: JSON.stringify(payload) }) };

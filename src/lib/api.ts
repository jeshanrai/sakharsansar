const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Only redirect on 401 for authenticated routes, not login itself
  if (res.status === 401 && !path.includes("/auth/login")) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/portfolio";
    }
    throw new Error("Unauthorized");
  }

  return res;
}

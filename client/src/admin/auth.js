const KEY = "admintoken";

export function setAdminToken(t) {
  localStorage.setItem(KEY, t);
}
export function getAdminToken() {
  return localStorage.getItem(KEY) || "";
}
export function clearAdminToken() {
  localStorage.removeItem(KEY);
}

export async function adminFetch(path, opts = {}) {
  const token = getAdminToken();
  const headers = { ...(opts.headers || {}), Authorization: `Bearer ${token}` };
  const res = await fetch(path, { ...opts, headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Request failed");
    throw new Error(msg);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.blob();
}

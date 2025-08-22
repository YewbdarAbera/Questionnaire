// client/src/lib/api.js
import { getToken } from "./auth";

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Read the stream ONCE
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const raw = await res.text(); // single read

  if (!res.ok) {
    // try to pull a helpful message from JSON or text
    let msg = "Request failed";
    if (isJson && raw) {
      try {
        const j = JSON.parse(raw);
        msg = j.error || j.message || msg;
      } catch {
        /* ignore parse error */
      }
    } else if (raw) {
      msg = raw;
    }
    throw new Error(msg);
  }

  // success
  return isJson && raw ? JSON.parse(raw) : raw;
}

export function submitSurvey(data) {
  return request("/api/surveys", { method: "POST", body: data });
}

export function adminLoginApi(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function adminGoogleLogin(credential) {
  return request("/api/auth/google", { method: "POST", body: { credential } });
}

export function getSubmissions() {
  return request("/api/surveys", { auth: true });
}

export async function downloadExcel() {
  const token = getToken();
  const res = await fetch("/api/admin/export", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to download");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `survey_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

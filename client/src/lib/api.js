const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("socratia_token");

  const headers = {
    ...(options.headers || {}),
  };

  // If body is a plain object, send JSON automatically
  const hasBody = options.body !== undefined;
  const isFormData = hasBody && options.body instanceof FormData;
  const isStringBody = hasBody && typeof options.body === "string";

  let body = options.body;

  if (hasBody && !isFormData && !isStringBody) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    body = JSON.stringify(body);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Normalize error so UI can show it
    const msg = data?.error || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

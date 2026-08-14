// Server-side helper for talking to the TapAway backend API.
// The browser never calls the backend directly - Next.js route handlers and
// server components use these helpers, so auth cookies stay same-origin.

export function backendBase() {
  const base = process.env.BACKEND_API_URL;
  if (!base) {
    throw new Error(
      "BACKEND_API_URL is not set. Point it at your Railway backend (see .env.example)."
    );
  }
  return base.replace(/\/$/, "");
}

export function backendUrl(path: string) {
  return `${backendBase()}${path.startsWith("/") ? path : `/${path}`}`;
}

type ApiOptions = {
  method?: string;
  token?: string | null;
  body?: unknown;
  /** cache behaviour for server components; defaults to no-store */
  cache?: RequestCache;
};

/** Fetch JSON from the backend. Returns { ok, status, data }. */
export async function apiFetch(path: string, opts: ApiOptions = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(backendUrl(path), {
    method: opts.method || "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: opts.cache || "no-store",
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

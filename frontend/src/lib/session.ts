import { cookies } from "next/headers";

// The frontend does not mint or verify JWTs — the backend does. The frontend
// only stores the backend-issued token in an httpOnly cookie and forwards it.

export const SESSION_COOKIE = "tapaway_session";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

/** Read the raw session token (server components / route handlers). */
export function getToken(): string | null {
  return cookies().get(SESSION_COOKIE)?.value ?? null;
}

export function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

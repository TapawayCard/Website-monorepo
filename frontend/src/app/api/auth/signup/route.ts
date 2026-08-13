import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { setSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { ok, status, data } = await apiFetch("/auth/signup", {
    method: "POST",
    body,
  });

  if (!ok) {
    return NextResponse.json(
      { error: data?.error || "Sign up failed" },
      { status }
    );
  }

  setSessionCookie(data.token);
  return NextResponse.json({ ok: true, username: data.username });
}

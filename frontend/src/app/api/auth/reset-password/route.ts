import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { setSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { ok, status, data } = await apiFetch("/auth/reset-password", {
    method: "POST",
    body,
  });

  if (!ok) {
    return NextResponse.json(
      { error: data?.error || "Could not reset your password" },
      { status }
    );
  }

  setSessionCookie(data.token);
  return NextResponse.json({ ok: true });
}

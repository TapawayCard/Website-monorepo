import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/session";

export async function PUT(req: Request) {
  const token = getToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { ok, status, data } = await apiFetch("/me/links", {
    method: "PUT",
    token,
    body,
  });
  return NextResponse.json(ok ? data : { error: data?.error || "Error" }, { status });
}

import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { ok, status, data } = await apiFetch("/contact", {
    method: "POST",
    body,
  });
  return NextResponse.json(ok ? { ok: true } : { error: data?.error || "Error" }, {
    status,
  });
}

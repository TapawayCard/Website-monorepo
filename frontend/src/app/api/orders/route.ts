import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = getToken(); // optional: links order to a logged-in user
  const { ok, status, data } = await apiFetch("/orders", {
    method: "POST",
    token,
    body,
  });
  return NextResponse.json(ok ? data : { error: data?.error || "Could not create order" }, {
    status,
  });
}

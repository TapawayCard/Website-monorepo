import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { ok, status, data } = await apiFetch("/orders/payment-proof", {
    method: "POST",
    body,
  });
  return NextResponse.json(ok ? data : { error: data?.error || "Could not submit payment proof" }, {
    status,
  });
}

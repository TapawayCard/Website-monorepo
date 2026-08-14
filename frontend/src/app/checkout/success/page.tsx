"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import StoreNav from "@/components/store/StoreNav";

function SuccessInner() {
  const params = useSearchParams();
  const order = params.get("order") || "";
  const ref = order ? order.slice(-8).toUpperCase() : "";

  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-sky/15 text-brand-sky">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Order received!</h1>
      <p className="mt-3 text-white/60">
        Thanks — we've got your order and payment screenshot. Our team is verifying the
        payment now and will email you a confirmation shortly. Production starts right
        after, with estimated delivery in 5 to 10 business days.
      </p>
      {ref && (
        <p className="mt-4 inline-block rounded-full border border-white/15 px-4 py-2 text-sm">
          Order reference <span className="font-semibold text-brand-sky">#{ref}</span>
        </p>
      )}
      <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
        <Link href="/signup" className="btn-primary">Set up your profile</Link>
        <Link href="/" className="btn-ghost !text-white">Back to home</Link>
      </div>
      <p className="mt-6 text-xs text-white/40">
        Create your TapAway account to build the digital profile your card will open to.
      </p>
      <p className="mt-4 text-xs text-white/40">
        Don't see the confirmation email? Please check your spam folder too. For any
        issues with your order or payment, write to us at{" "}
        <a href="mailto:tapawaycard@gmail.com" className="text-brand-sky hover:underline">
          tapawaycard@gmail.com
        </a>
        .
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <StoreNav />
      <Suspense fallback={null}>
        <SuccessInner />
      </Suspense>
    </div>
  );
}

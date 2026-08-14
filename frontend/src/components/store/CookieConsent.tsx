"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "tapaway_cookie_consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  function decide(value: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <div className="glass-strong flex w-full max-w-3xl flex-col items-start gap-4 rounded-2xl p-5 text-white sm:flex-row sm:items-center sm:justify-between"
        style={{ ["--glass-border" as string]: "rgba(255,255,255,0.14)" }}
      >
        <p className="text-sm text-white/75">
          We use cookies and local storage to keep your cart and remember your
          preferences. See our{" "}
          <Link href="/privacy" className="font-medium text-brand-sky hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => decide("declined")}
            className="rounded-full px-4 py-2 text-sm font-medium text-white/70 hover:text-white"
          >
            Decline
          </button>
          <button onClick={() => decide("accepted")} className="btn-primary !px-5 !py-2.5 !text-sm">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

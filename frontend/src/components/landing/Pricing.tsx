"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";
import { CARDS, rupees } from "@/lib/catalog";

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Cards & pricing</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose your{" "}
            <span className="accent-serif">TapAway</span> card.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Every card comes with NFC technology and a personal digital profile.
            Pick the package that fits you.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {CARDS.map((c, i) => {
            const highlight = c.key === "business";
            return (
              <Reveal key={c.key} delay={i * 0.08}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-8 ${
                    highlight ? "glass-strong" : "glass"
                  }`}
                  style={
                    highlight
                      ? { boxShadow: "0 20px 60px -20px rgba(84,179,230,0.5)", border: "1px solid rgba(84,179,230,0.4)" }
                      : undefined
                  }
                >
                  {highlight && (
                    <span className="absolute -top-3 right-8 rounded-full bg-brand-sky px-3 py-1 text-xs font-semibold text-navy-950">
                      Best value
                    </span>
                  )}
                  <h3 className="text-2xl font-semibold">{c.name}</h3>
                  <p className="mt-2 text-sm text-muted">{c.tagline}</p>
                  <p className="mt-4 text-4xl font-bold">
                    {rupees(c.pricePaise)}
                    <span className="ml-1 align-middle text-base font-normal text-faint">/ card</span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {c.features.map((f) => (
                      <li key={f} className="flex gap-3 text-sm">
                        <Check />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/product"
                    className={`mt-8 w-full ${highlight ? "btn-primary" : "btn-ghost"}`}
                  >
                    Get this card
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

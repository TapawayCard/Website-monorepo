"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";

const tiers = [
  {
    name: "Standard NFC Card",
    price: "₹XXX",
    highlight: false,
    features: [
      "NFC Enabled",
      "Digital Profile",
      "Unlimited Profile Updates",
      "QR Code Backup",
      "Social Media Links",
      "Contact Information",
    ],
  },
  {
    name: "Premium NFC Card",
    price: "₹XXX",
    highlight: true,
    features: [
      "Premium Material",
      "NFC Enabled",
      "Enhanced Finish",
      "Custom Design Options",
      "Digital Profile",
      "Priority Manufacturing",
    ],
  },
];

const addons = [
  { label: "Name Printing", price: "₹XX" },
  { label: "Company Name Printing", price: "₹XX" },
  { label: "Designation Printing", price: "₹XX" },
  { label: "Custom Logo Placement", price: "₹XX" },
  { label: "Premium Finish · Matte / Gloss / Metallic", price: "₹XX" },
  { label: "Priority Manufacturing", price: "₹XX" },
];

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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            Cards & pricing
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose your{" "}
            <span className="accent-serif">TapAway</span> card.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Every card comes with NFC technology and a personal digital profile.
            Make it truly yours with add-ons.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div
                className={`relative h-full rounded-3xl p-8 ${
                  t.highlight ? "glass-strong" : "glass"
                }`}
                style={
                  t.highlight
                    ? { boxShadow: "0 20px 60px -20px rgba(84,179,230,0.5)", border: "1px solid rgba(84,179,230,0.4)" }
                    : undefined
                }
              >
                {t.highlight && (
                  <span className="absolute -top-3 right-8 rounded-full bg-brand-sky px-3 py-1 text-xs font-semibold text-navy-950">
                    Best value
                  </span>
                )}
                <h3 className="text-2xl font-semibold">{t.name}</h3>
                <p className="mt-2 text-sm text-muted">Starting at</p>
                <p className="mt-1 text-4xl font-bold">
                  {t.price}
                  <span className="ml-1 align-middle text-base font-normal text-faint">/ card</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm">
                      <Check />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-8 w-full ${t.highlight ? "btn-primary" : "btn-ghost"}`}
                >
                  Get this card
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        {/* customizations */}
        <Reveal delay={0.05}>
          <div className="glass mt-6 rounded-3xl p-8">
            <h3 className="text-xl font-semibold">
              Customize your card <span className="text-faint">· optional add-ons</span>
            </h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {addons.map((a) => (
                <div
                  key={a.label}
                  className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
                  style={{ border: "1px solid var(--glass-border)" }}
                >
                  <span className="text-sm">{a.label}</span>
                  <span className="shrink-0 text-sm font-semibold text-brand-blue">
                    +{a.price}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-faint">
              Prices shown are placeholders — set your real pricing in the code
              (see <code>Pricing.tsx</code>) or wire it to your database.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

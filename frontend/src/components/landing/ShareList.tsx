"use client";

import { Reveal } from "./Reveal";

const items = [
  "Name", "Profile Picture", "Phone Number", "Email", "Website", "WhatsApp",
  "LinkedIn", "Instagram", "Facebook", "X (Twitter)", "YouTube", "Portfolio",
  "Google Maps Location", "Payment Links", "Custom Links",
];

export default function ShareList() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div>
              <p className="eyebrow">What can you share?</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Your card stays the same.{" "}
                <span className="accent-serif">Your info</span> evolves.
              </h2>
              <p className="mt-5 max-w-lg text-lg text-muted">
                Unlike traditional business cards, TapAway lets you update your
                information anytime. One card for years.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-3">
              {items.map((item, i) => (
                <span
                  key={item}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5 ${
                    i % 4 === 0 ? "glass-strong" : "glass"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

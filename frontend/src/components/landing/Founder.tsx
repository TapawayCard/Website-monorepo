"use client";

import { Reveal } from "./Reveal";

export default function Founder() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-sky/20 blur-3xl" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Meet the founder
            </p>
            <blockquote className="mx-auto mt-6 max-w-2xl text-2xl font-medium leading-snug sm:text-3xl">
              TapAway was created with a vision to eliminate paper business cards
              and bring networking into the{" "}
              <span className="accent-serif gradient-text">digital era.</span>
            </blockquote>
            <p className="mx-auto mt-6 max-w-xl text-muted">
              We believe every professional deserves a smart, sustainable and
              instantly shareable identity.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { Reveal } from "./Reveal";

const steps = [
  { n: "01", title: "Choose your card", desc: "Pick the TapAway card that fits you — Standard, Premium or Corporate." },
  { n: "02", title: "Create your profile", desc: "Sign up and build your digital profile with links, socials and a bio." },
  { n: "03", title: "Customize everything", desc: "Add your name, logo, finish and all the links you want to share." },
  { n: "04", title: "Tap & connect", desc: "Receive your card and start networking instantly — anywhere, anytime." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            How it works
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Four steps to a{" "}
            <span className="accent-serif">smarter</span> introduction.
          </h2>
        </Reveal>

        <div className="relative mt-16">
          {/* connecting line */}
          <div
            className="absolute left-0 right-0 top-9 hidden h-px lg:block"
            style={{ background: "linear-gradient(90deg,transparent,var(--glass-border),transparent)" }}
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="relative">
                  <div className="glass-strong mb-6 inline-flex items-center justify-center rounded-2xl px-5 py-4 text-2xl font-bold text-brand-sky">
                    {s.n}
                  </div>
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Reveal } from "./Reveal";
import {
  NfcWave,
  Leaf,
  Refresh,
  QrIcon,
  IdCard,
  Phone,
  Bolt,
} from "@/components/ui/icons";

const benefits = [
  { icon: NfcWave, title: "NFC Technology", desc: "Tap your card to any modern phone and your profile opens instantly — no app required." },
  { icon: Leaf, title: "Paperless & Eco-Friendly", desc: "One card for years. Skip the stacks of paper cards that get lost or thrown away." },
  { icon: Refresh, title: "Real-Time Updates", desc: "Change a job, number or link anytime. Your card stays the same, your info evolves." },
  { icon: IdCard, title: "Professional Identity", desc: "A polished digital profile that makes a memorable first impression, every time." },
  { icon: QrIcon, title: "QR Code Backup", desc: "Every profile ships with a QR code, so you can share even without NFC." },
  { icon: Phone, title: "Works On Most Phones", desc: "Compatible with the vast majority of NFC-enabled iPhone and Android devices." },
];

export default function Benefits() {
  return (
    <section id="why" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            Why TapAway
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Paper cards get lost.{" "}
            <span className="accent-serif">Yours</span> never goes out of date.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Traditional business cards are often lost, thrown away, or become
            outdated. TapAway is a smarter way to connect — with a single tap
            your clients and connections access your live digital profile.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div className="glass group h-full rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1">
                <div
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: "rgba(84,179,230,0.16)", color: "#54b3e6" }}
                >
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="glass mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-7">
            <div className="flex items-center gap-4">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: "rgba(231,226,201,0.2)", color: "#c9b96e" }}
              >
                <Bolt className="h-6 w-6" />
              </div>
              <p className="text-lg font-medium">
                Instant sharing, zero friction — your whole identity in one tap.
              </p>
            </div>
            <a href="#cards" className="btn-ghost !py-2.5 !text-sm">
              See the cards
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

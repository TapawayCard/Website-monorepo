"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import TapCard from "@/components/ui/TapCard";
import { NfcWave } from "@/components/ui/icons";

const trust = [
  "No app required",
  "Works on iPhone & Android",
  "Update your details anytime",
];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-32">
      {/* restrained ambient light */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-brand-blue/15 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent 75%)",
          }}
        />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-muted"
          >
            <NfcWave className="h-4 w-4 text-accent" />
            NFC-powered digital visiting cards
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.25rem]"
          >
            Your <span className="accent-serif text-accent">Identity,</span>
            <br />
            one tap away.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            Share your contact details, socials, portfolio and payment links
            with a single tap. No paper, no reprinting, no outdated cards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link href="/product" className="btn-primary">
              Get your card
            </Link>
            <a href="#cards" className="btn-ghost">
              Explore designs
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted"
          >
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7" />
                </svg>
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* card on a lit stage */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          {/* spotlight behind the card so the navy stock reads against the dark bg */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(88,178,230,0.28),rgba(88,178,230,0.05)_45%,transparent_70%)]" />

          {/* concentric NFC rings, subtle */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {[0, 1].map((i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-sky/20 animate-pulseRing"
                style={{ animationDelay: `${i * 1.5}s` }}
              />
            ))}
          </div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ perspective: 1200 }}
            className="relative"
          >
            <div style={{ transform: "rotate(-4deg)" }}>
              <TapCard variant="premium" />
            </div>
          </motion.div>

          {/* soft floor glow */}
          <div className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-[100%] bg-black/40 blur-2xl" />
        </motion.div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-xs text-faint">
        <div className="flex flex-col items-center gap-2">
          <span>Scroll to explore</span>
          <span className="h-7 w-px animate-pulse bg-current" />
        </div>
      </div>
    </section>
  );
}

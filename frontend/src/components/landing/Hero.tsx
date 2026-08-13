"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import TapCard from "@/components/ui/TapCard";
import { NfcWave } from "@/components/ui/icons";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-blue/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand-sky/15 blur-[130px]" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide"
          >
            <NfcWave className="h-4 w-4 text-brand-sky" />
            NFC-powered digital visiting cards
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Your{" "}
            <span className="accent-serif gradient-text font-medium">Identity.</span>
            <br />
            One <span className="accent-serif font-medium">Tap</span> Away.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            Transform the way you network. Share your contact info, social
            profiles, business details and portfolio with a single tap.
            No paper. No reprinting. No outdated information.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link href="/signup" className="btn-primary">
              Get Your Card
            </Link>
            <a href="#cards" className="btn-ghost">
              Explore Designs
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold"
          >
            {["Smart.", "Sustainable.", "Professional."].map((w, i) => (
              <span key={w} className={i === 1 ? "accent-serif text-brand-sky" : ""}>
                {w}
              </span>
            ))}
          </motion.div>
        </div>

        {/* floating card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -18 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
          style={{ perspective: 1200 }}
        >
          {/* pulse rings behind card */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-sky/30 animate-pulseRing"
                style={{ animationDelay: `${i}s` }}
              />
            ))}
          </div>

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative"
          >
            <TapCard variant="premium" className="glow-blue" />
          </motion.div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-faint">
        <div className="flex flex-col items-center gap-2">
          <span>Scroll to explore</span>
          <span className="h-8 w-px animate-pulse bg-current" />
        </div>
      </div>
    </section>
  );
}

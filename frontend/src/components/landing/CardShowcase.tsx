"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import TapCard from "@/components/ui/TapCard";
import { NfcWave, Refresh, QrIcon, IdCard, LinkIcon, Leaf } from "@/components/ui/icons";

const features = [
  { icon: NfcWave, title: "One-tap sharing", desc: "Programmed NFC chip opens your profile instantly.", side: "left", at: 0.12 },
  { icon: Refresh, title: "Always up to date", desc: "Edit once — every card you've ever shared updates.", side: "right", at: 0.3 },
  { icon: LinkIcon, title: "All your links", desc: "Socials, portfolio, payments and custom links in one place.", side: "left", at: 0.48 },
  { icon: QrIcon, title: "QR backup", desc: "A scannable code for phones without NFC.", side: "right", at: 0.62 },
  { icon: IdCard, title: "vCard save", desc: "Contacts save your details straight to their phone.", side: "left", at: 0.78 },
  { icon: Leaf, title: "Built to last", desc: "Premium, sustainable materials. One card for years.", side: "right", at: 0.9 },
];

function FeatureCard({
  progress,
  feature,
}: {
  progress: MotionValue<number>;
  feature: (typeof features)[number];
}) {
  const from = feature.side === "left" ? -60 : 60;
  const opacity = useTransform(
    progress,
    [feature.at - 0.12, feature.at, feature.at + 0.16, feature.at + 0.24],
    [0, 1, 1, 0.25]
  );
  const x = useTransform(progress, [feature.at - 0.12, feature.at], [from, 0]);

  return (
    <motion.div
      style={{ opacity, x }}
      className={`glass pointer-events-none absolute z-20 w-64 rounded-2xl p-5 ${
        feature.side === "left"
          ? "left-4 md:left-10 lg:left-20"
          : "right-4 md:right-10 lg:right-20"
      }`}
    >
      <div
        className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: "rgba(84,179,230,0.16)", color: "#54b3e6" }}
      >
        <feature.icon className="h-5 w-5" />
      </div>
      <h4 className="text-base font-semibold">{feature.title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-muted">{feature.desc}</p>
    </motion.div>
  );
}

export default function CardShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.9]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0.3]);

  // left/right features alternate; place them vertically staggered
  const leftFeatures = features.filter((f) => f.side === "left");
  const rightFeatures = features.filter((f) => f.side === "right");

  return (
    <section ref={ref} className="relative h-[360vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute h-[36rem] w-[36rem] rounded-full bg-brand-blue/10 blur-[130px]" />

        {/* heading */}
        <div className="absolute top-16 left-1/2 z-20 w-full max-w-2xl -translate-x-1/2 px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            One card.{" "}
            <span className="accent-serif gradient-text">Everything</span> you are.
          </h2>
          <p className="mt-3 text-muted">Keep scrolling — watch it come to life.</p>
        </div>

        {/* rotating card */}
        <motion.div
          style={{ scale, opacity: cardOpacity, perspective: 1400 }}
          className="relative z-10 w-full max-w-sm"
        >
          <motion.div style={{ rotateY, transformStyle: "preserve-3d" }}>
            <TapCard variant="premium" className="glow-blue" />
          </motion.div>
        </motion.div>

        {/* feature callouts, stacked with vertical offsets */}
        <div className="absolute inset-0 hidden md:block">
          {leftFeatures.map((f, i) => (
            <div key={f.title} style={{ top: `${26 + i * 20}%` }} className="absolute inset-x-0">
              <FeatureCard progress={scrollYProgress} feature={f} />
            </div>
          ))}
          {rightFeatures.map((f, i) => (
            <div key={f.title} style={{ top: `${30 + i * 20}%` }} className="absolute inset-x-0">
              <FeatureCard progress={scrollYProgress} feature={f} />
            </div>
          ))}
        </div>

        {/* mobile: simple stacked reveal below card */}
        <div className="absolute bottom-10 left-1/2 z-20 w-[90%] max-w-sm -translate-x-1/2 md:hidden">
          <div className="glass rounded-2xl p-4 text-center text-sm text-muted">
            Tap-to-share · Live updates · QR backup · vCard save
          </div>
        </div>
      </div>
    </section>
  );
}

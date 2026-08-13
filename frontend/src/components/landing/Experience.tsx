"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useState, type ReactNode } from "react";

/**
 * Scroll-driven theme engine.
 * The page starts DARK (hero), smoothly transitions to LIGHT through the
 * middle sections, then returns to DARK as the footer approaches.
 * Background + foreground colours are interpolated continuously; the glass
 * tint set is swapped via a `data-light` attribute (see globals.css).
 */
export default function Experience({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const [light, setLight] = useState(false);

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.22, 0.34, 0.66, 0.82, 1],
    ["#050914", "#0a1024", "#f5f2e8", "#efead9", "#0a1024", "#050914"]
  );

  const color = useTransform(
    scrollYProgress,
    [0, 0.28, 0.36, 0.7, 0.8, 1],
    ["#ffffff", "#eaf2ff", "#0a1730", "#0a1730", "#eaf2ff", "#ffffff"]
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const isLight = v > 0.33 && v < 0.74;
    if (isLight !== light) setLight(isLight);
  });

  return (
    <motion.main
      data-light={light}
      style={{ backgroundColor, color }}
      className="relative min-h-screen w-full overflow-x-clip transition-colors"
    >
      {children}
    </motion.main>
  );
}

"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useState, type ReactNode } from "react";

/*
  Scroll-driven theme engine.
  The page opens dark (hero), eases into a warm light for the middle
  sections, then returns to dark for the footer. Colours interpolate
  continuously; the surface token set is swapped with a data-light flag.
*/
export default function Experience({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const [light, setLight] = useState(false);

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.34, 0.66, 0.82, 1],
    ["#0a1122", "#0b1428", "#f4f1e8", "#f0ebdd", "#0b1428", "#0a1122"]
  );

  const color = useTransform(
    scrollYProgress,
    [0, 0.26, 0.36, 0.7, 0.8, 1],
    ["#e9eef7", "#e9eef7", "#111a2b", "#111a2b", "#e9eef7", "#e9eef7"]
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const isLight = v > 0.33 && v < 0.74;
    if (isLight !== light) setLight(isLight);
  });

  return (
    <motion.main
      data-light={light}
      style={{ backgroundColor, color }}
      className="relative min-h-screen w-full overflow-x-clip"
    >
      {children}
    </motion.main>
  );
}

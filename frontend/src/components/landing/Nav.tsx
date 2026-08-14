"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

const links = [
  { href: "#why", label: "Why TapAway" },
  { href: "#how", label: "How it works" },
  { href: "#cards", label: "Cards" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      const goingDown = y > lastY.current;
      const delta = Math.abs(y - lastY.current);

      // Ignore tiny jitters; never hide near the very top.
      if (delta > 6) {
        setHidden(goingDown && y > 120);
        lastY.current = y;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the bar visible whenever the mobile menu is open.
  const isHidden = hidden && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 transition-transform duration-300 ease-out ${
        isHidden ? "-translate-y-[140%]" : "translate-y-0"
      }`}
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-6 ${
          scrolled ? "glass-strong" : "glass"
        }`}
        style={{ color: "inherit" }}
      >
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium opacity-80 transition-opacity hover:opacity-100 sm:inline-flex"
          >
            Log in
          </Link>
          <Link href="/product" className="btn-primary !px-5 !py-2.5 !text-sm">
            Get your card
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full md:hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            <span className="flex flex-col gap-1">
              <span className="h-0.5 w-4 bg-current" />
              <span className="h-0.5 w-4 bg-current" />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-strong absolute top-20 w-[calc(100%-2rem)] max-w-6xl rounded-3xl p-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium opacity-90"
              >
                {l.label}
              </a>
            ))}
            <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-medium opacity-90">
              Log in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useCart } from "./CartProvider";

export default function StoreNav() {
  const { count, ready } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-navy-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/">
          <Logo className="text-white" />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/product"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/75 hover:text-white sm:inline-flex"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/85 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M6 6 5 3H2" />
            </svg>
            Cart
            {ready && count > 0 && (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-sky px-1.5 text-xs font-bold text-navy-950">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

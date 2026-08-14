"use client";

import Link from "next/link";
import StoreNav from "@/components/store/StoreNav";
import CookieConsent from "@/components/store/CookieConsent";
import TapCard from "@/components/ui/TapCard";
import { useCart } from "@/components/store/CartProvider";
import {
  CARDS,
  priceItemPaise,
  rupees,
  summarize,
  variantForConfig,
} from "@/lib/catalog";

export default function CartPage() {
  const { items, ready, remove, setQty, subtotalPaise } = useCart();

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <StoreNav />
      <CookieConsent />

      <div className="mx-auto max-w-4xl px-5 py-8">
        <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>

        {!ready ? null : items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-white/60">Your cart is empty.</p>
            <Link href="/product" className="btn-primary mt-6 inline-flex">
              Design your card
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4">
              {items.map((it) => (
                <div key={it.id} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="w-28 shrink-0">
                    <TapCard variant={variantForConfig(it)} shine={false} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{CARDS.find((c) => c.key === it.cardType)?.name}</h3>
                        <p className="mt-0.5 text-xs text-white/50">{summarize(it) || "Standard configuration"}</p>
                      </div>
                      <button onClick={() => remove(it.id)} className="text-white/40 hover:text-red-300" aria-label="Remove">✕</button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-white/15">
                        <button onClick={() => setQty(it.id, it.qty - 1)} className="px-2.5 py-1 text-white/70 hover:text-white">−</button>
                        <span className="w-8 text-center text-sm">{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.qty + 1)} className="px-2.5 py-1 text-white/70 hover:text-white">+</button>
                      </div>
                      <span className="font-semibold">{rupees(priceItemPaise(it))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>Subtotal</span>
                  <span>{rupees(subtotalPaise)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-white/60">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span>{rupees(subtotalPaise)}</span>
                </div>
                <Link href="/checkout" className="btn-primary mt-6 w-full">
                  Proceed to checkout
                </Link>
                <Link href="/product" className="mt-2 block text-center text-sm text-white/55 hover:text-white">
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Reveal } from "./Reveal";
import TapCard from "@/components/ui/TapCard";
import { CARDS, rupees } from "@/lib/catalog";

const tags: Record<string, string> = {
  classic: "Most popular",
  business: "For professionals",
  custom: "Luxury",
};

export default function Products() {
  return (
    <section id="cards" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Product range</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            A card for{" "}
            <span className="accent-serif">every</span> kind of professional.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.08}>
              <div className="glass group h-full overflow-hidden rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1.5">
                <div className="mb-6 [perspective:1000px]">
                  <div className="transition-transform duration-500 group-hover:[transform:rotateY(-10deg)_rotateX(4deg)]">
                    <TapCard variant={c.variant} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold">{c.name}</h3>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium text-accent"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                  >
                    {tags[c.key]}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.tagline}</p>
                <p className="mt-4 text-lg font-bold text-brand-sky">{rupees(c.pricePaise)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

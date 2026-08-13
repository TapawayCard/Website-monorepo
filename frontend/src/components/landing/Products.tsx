"use client";

import { Reveal } from "./Reveal";
import TapCard from "@/components/ui/TapCard";

const products = [
  {
    variant: "standard" as const,
    name: "Personal",
    who: "Freelancers, students, creators, consultants & professionals.",
    tag: "Most popular",
  },
  {
    variant: "premium" as const,
    name: "Business",
    who: "Employees and corporate teams who network as one brand.",
    tag: "For teams",
  },
  {
    variant: "black" as const,
    name: "Premium",
    who: "Luxury cards for founders, executives & premium professionals.",
    tag: "Luxury",
  },
];

export default function Products() {
  return (
    <section id="cards" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            Product range
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            A card for{" "}
            <span className="accent-serif">every</span> kind of professional.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div className="glass group h-full overflow-hidden rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1.5">
                <div className="mb-6 [perspective:1000px]">
                  <div className="transition-transform duration-500 group-hover:[transform:rotateY(-10deg)_rotateX(4deg)]">
                    <TapCard variant={p.variant} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold">{p.name}</h3>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{ background: "rgba(84,179,230,0.16)", color: "#54b3e6" }}
                  >
                    {p.tag}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.who}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

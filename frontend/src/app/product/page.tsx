"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StoreNav from "@/components/store/StoreNav";
import CookieConsent from "@/components/store/CookieConsent";
import TapCard from "@/components/ui/TapCard";
import { useCart } from "@/components/store/CartProvider";
import {
  CARDS,
  priceItemPaise,
  rupees,
  variantForConfig,
  type CardConfig,
  type CardTypeKey,
} from "@/lib/catalog";

function compressImage(file: File, maxDim = 900, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no canvas"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

const label = "mb-1.5 block text-xs font-medium text-white/55";

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-brand-sky" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export default function ProductPage() {
  const router = useRouter();
  const { add } = useCart();

  const [cardType, setCardType] = useState<CardTypeKey>("classic");
  const [printName, setPrintName] = useState("");
  const [printDesignation, setPrintDesignation] = useState("");
  const [companyLogoData, setCompanyLogoData] = useState<string | undefined>();
  const [customNotes, setCustomNotes] = useState("");
  const [qty, setQty] = useState(1);
  const [uploadErr, setUploadErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const cfg: CardConfig = useMemo(
    () => ({
      cardType,
      printName: cardType === "business" ? printName : undefined,
      printDesignation: cardType === "business" ? printDesignation : undefined,
      companyLogoData: cardType === "business" ? companyLogoData : undefined,
      customNotes: cardType === "custom" ? customNotes : undefined,
      qty,
    }),
    [cardType, printName, printDesignation, companyLogoData, customNotes, qty]
  );

  const card = CARDS.find((c) => c.key === cardType)!;
  const unit = priceItemPaise({ ...cfg, qty: 1 });
  const total = priceItemPaise(cfg);
  const variant = variantForConfig({ cardType });

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadErr("");
    if (!file.type.startsWith("image/")) return setUploadErr("Please choose an image file.");
    if (file.size > 12 * 1024 * 1024) return setUploadErr("Image must be under 12MB.");
    try {
      setCompanyLogoData(await compressImage(file));
    } catch {
      setUploadErr("Could not process that image.");
    }
  }

  function addToCart() {
    add(cfg);
  }
  function buyNow() {
    add(cfg);
    router.push("/checkout");
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <StoreNav />
      <CookieConsent />

      <div className="mx-auto max-w-6xl px-5 py-8">
        <Link href="/" className="text-sm text-white/55 hover:text-white">
          ← Back to home
        </Link>

        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_1fr]">
          {/* left: big image */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-8">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/15 blur-[120px]" />
              <div className="relative mx-auto max-w-sm">
                <TapCard
                  variant={variant}
                  className="glow-blue"
                  printName={cfg.printName}
                  printDesignation={cfg.printDesignation}
                  logoDataUrl={cfg.companyLogoData}
                />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-white/40">
              Preview is representative. Final card uses your selected package.
            </p>
          </div>

          {/* right: configurator */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{card.name}</h1>
            <p className="mt-2 text-white/60">{card.tagline}</p>
            <p className="mt-4 text-3xl font-bold text-brand-sky">
              {rupees(unit)}
              <span className="ml-2 align-middle text-sm font-normal text-white/45">per card</span>
            </p>

            {/* package selector */}
            <div className="mt-8 grid gap-3">
              {CARDS.map((c) => {
                const selected = cardType === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setCardType(c.key)}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      selected ? "border-brand-sky bg-brand-sky/10" : "border-white/12 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="block text-base font-semibold">{c.name}</span>
                        <span className="mt-0.5 block text-xs text-white/50">{c.tagline}</span>
                      </div>
                      <span className="shrink-0 text-lg font-bold text-brand-sky">{rupees(c.pricePaise)}</span>
                    </div>
                    <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                      {c.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-white/60">
                          <Check />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            {/* business tier: personalisation */}
            {cardType === "business" && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className={label}>Personalise your card</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={label}>Your name</label>
                    <input value={printName} onChange={(e) => setPrintName(e.target.value)} className="field" placeholder="Your name" />
                  </div>
                  <div>
                    <label className={label}>Designation</label>
                    <input value={printDesignation} onChange={(e) => setPrintDesignation(e.target.value)} className="field" placeholder="e.g. Product Manager" />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={label}>Company logo</label>
                  <div className="flex flex-wrap items-center gap-3">
                    {companyLogoData && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={companyLogoData} alt="Company logo" className="h-12 w-12 rounded-lg border border-white/10 object-contain bg-white/95 p-1" />
                    )}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/85 hover:text-white"
                    >
                      {companyLogoData ? "Change logo" : "Upload your logo"}
                    </button>
                    {companyLogoData && (
                      <button
                        type="button"
                        onClick={() => setCompanyLogoData(undefined)}
                        className="rounded-full px-3 py-2 text-sm text-white/55 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
                  </div>
                  {uploadErr && <p className="mt-1.5 text-xs text-red-400">{uploadErr}</p>}
                </div>
              </div>
            )}

            {/* custom tier: brief for the design team */}
            {cardType === "custom" && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className={label}>Tell our design team what you have in mind (optional)</span>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="field min-h-[96px] resize-y"
                  placeholder="Colours, style, logo, layout ideas..."
                />
                <p className="mt-2 text-xs text-white/50">
                  After checkout, our team will reach out to you to design and finalise your card together.
                </p>
              </div>
            )}

            {/* quantity */}
            <div className="mt-6 flex items-center gap-4">
              <span className={label + " !mb-0"}>Quantity</span>
              <div className="flex items-center rounded-full border border-white/15">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5 text-lg text-white/70 hover:text-white">−</button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(50, q + 1))} className="px-3 py-1.5 text-lg text-white/70 hover:text-white">+</button>
              </div>
            </div>

            {/* total + actions */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/55">Total</span>
                <span className="text-2xl font-bold">{rupees(total)}</span>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button onClick={addToCart} className="btn-ghost w-full !text-white">
                  Add to cart
                </button>
                <button onClick={buyNow} className="btn-primary w-full">
                  Buy now
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-white/40">
                Your cart is saved on this device even before you sign in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

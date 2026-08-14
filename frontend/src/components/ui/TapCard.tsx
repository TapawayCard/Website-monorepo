/* eslint-disable @next/next/no-img-element */

import { NfcWave } from "./icons";

type Variant = "standard" | "premium" | "black";

// Clean, matte, premium finishes matching the real TapAway cards:
// deep navy with a soft top-left light, or a dark charcoal metallic.
const surfaces: Record<Variant, string> = {
  standard:
    "radial-gradient(125% 125% at 28% 18%, #26375d 0%, #1a2743 46%, #111c33 100%)",
  premium:
    "radial-gradient(125% 125% at 28% 18%, #294066 0%, #182a4c 45%, #0e1a33 100%)",
  black:
    "radial-gradient(125% 125% at 28% 18%, #2b2b32 0%, #17171c 55%, #0a0a0d 100%)",
};

/**
 * A realistic representation of the physical TapAway NFC card -
 * matte deep-navy stock with the official logo centred, nothing else.
 */
export default function TapCard({
  variant = "standard",
  className = "",
  shine = true,
  printName,
  printDesignation,
  logoDataUrl,
}: {
  variant?: Variant;
  className?: string;
  shine?: boolean;
  printName?: string;
  printDesignation?: string;
  logoDataUrl?: string;
}) {
  const personalised = Boolean(printName || printDesignation || logoDataUrl);
  const initials = (printName ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-[26px] ${className}`}
      style={{
        background: surfaces[variant],
        boxShadow:
          "0 45px 90px -35px rgba(0,0,0,0.85), 0 8px 22px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 70px rgba(0,0,0,0.35)",
      }}
    >
      {/* soft top-edge sheen (subtle, not a hard stripe) */}
      {shine && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-70"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, transparent 100%)",
          }}
        />
      )}
      {/* gentle corner glow to hint at the NFC surface */}
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "rgba(84,179,230,0.16)" }}
      />
      {/* fine edge highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[26px]"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
      />

      {/* official logo - centred by default, or smaller top-left once personalised */}
      <div
        className={`absolute flex items-center justify-center ${
          personalised ? "left-6 top-6 h-9 w-9" : "inset-0 p-6"
        }`}
      >
        <img
          src="/logo.png"
          alt="TapAway"
          className={`select-none drop-shadow-[0_4px_18px_rgba(0,0,0,0.4)] ${
            personalised ? "w-full" : "w-[46%] max-w-[210px]"
          }`}
          draggable={false}
        />
      </div>

      {personalised && (
        <>
          {/* huge faint monogram - fills the empty centre and feels personalised, not decorative filler */}
          {initials && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <span
                className="select-none font-bold text-white/[0.06]"
                style={{ fontSize: "8.5rem", letterSpacing: "-0.03em", lineHeight: 1 }}
              >
                {initials}
              </span>
            </div>
          )}

          {/* hairline divider under the header row */}
          <div className="absolute inset-x-6 top-[3.25rem] h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent" />

          {/* company logo badge, top-right */}
          {logoDataUrl && (
            <div className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white/95 p-1 shadow-lg">
              <img src={logoDataUrl} alt="Company logo" className="h-full w-full object-contain" draggable={false} />
            </div>
          )}

          {/* printed name / designation, anchored bottom-left with an accent rule */}
          {(printName || printDesignation) && (
            <div className="absolute inset-x-6 bottom-6 flex items-end gap-3">
              <span className="mb-0.5 h-8 w-[3px] shrink-0 rounded-full bg-brand-sky" />
              <div className="min-w-0">
                {printName && (
                  <p className="truncate text-base font-semibold tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                    {printName}
                  </p>
                )}
                {printDesignation && (
                  <p className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-[0.12em] text-white/60 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                    {printDesignation}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* NFC tap indicator, bottom-right */}
          <div className="absolute bottom-6 right-6 flex items-center gap-1.5 text-white/35">
            <NfcWave className="h-4 w-4" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em]">Tap</span>
          </div>
        </>
      )}
    </div>
  );
}

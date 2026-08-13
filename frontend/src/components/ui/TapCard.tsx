import { NfcWave } from "./icons";

type Variant = "standard" | "premium" | "black";

const surfaces: Record<Variant, string> = {
  standard:
    "linear-gradient(135deg,#17264f 0%,#0e1b3d 45%,#0a1330 100%)",
  premium:
    "linear-gradient(135deg,#1f3468 0%,#122a57 40%,#0b1636 100%)",
  black:
    "linear-gradient(135deg,#1a1a1e 0%,#0d0d10 55%,#050506 100%)",
};

/**
 * A stylised representation of the physical TapAway NFC card.
 * Uses the brand wordmark + cream ring + NFC signal from the logo.
 */
export default function TapCard({
  variant = "standard",
  className = "",
  shine = true,
}: {
  variant?: Variant;
  className?: string;
  shine?: boolean;
}) {
  return (
    <div
      className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-[22px] ${className}`}
      style={{
        background: surfaces[variant],
        boxShadow:
          "0 40px 90px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      {/* soft brand glow */}
      <div
        className="absolute -right-10 -top-16 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "rgba(84,179,230,0.35)" }}
      />
      {/* diagonal sheen */}
      {shine && (
        <div
          className="absolute inset-0 opacity-60 mix-blend-screen"
          style={{
            background:
              "linear-gradient(115deg,transparent 30%,rgba(255,255,255,0.16) 46%,rgba(255,255,255,0.03) 54%,transparent 70%)",
          }}
        />
      )}

      {/* logo cluster */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* cream ring */}
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full sm:h-28 sm:w-28"
            style={{
              border: "2px solid rgba(231,226,201,0.85)",
              boxShadow: "0 0 30px rgba(84,179,230,0.35)",
            }}
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%,#54b3e6,#1f6fa5 70%)",
              }}
            >
              <NfcWave className="h-8 w-8 text-white/90 sm:h-9 sm:w-9" />
            </div>
          </div>
        </div>
        <div
          className="mt-3 text-2xl font-semibold tracking-tight text-brand-cream sm:text-3xl"
          style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic" }}
        >
          tapaway
          <span className="align-super text-[10px] not-italic">®</span>
        </div>
      </div>

      {/* NFC corner + chip */}
      <div className="absolute right-4 top-4 text-brand-cream/70">
        <NfcWave className="h-5 w-5" />
      </div>
      <div
        className="absolute bottom-4 left-4 h-6 w-8 rounded-[5px]"
        style={{
          background:
            "linear-gradient(135deg,#d9c583,#b9992f 60%,#e7d79b)",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
}

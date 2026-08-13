import { NfcWave } from "./icons";

/** Inline TapAway logo — adapts to the current theme colour. */
export default function Logo({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="relative flex h-8 w-8 items-center justify-center rounded-full"
        style={{ border: "1.5px solid rgba(231,226,201,0.9)" }}
      >
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full"
          style={{ background: "radial-gradient(circle at 35% 30%,#54b3e6,#1f6fa5 75%)" }}
        >
          <NfcWave className="h-3.5 w-3.5 text-white" />
        </span>
      </span>
      {showText && (
        <span
          className="text-2xl leading-none"
          style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
        >
          tapaway
        </span>
      )}
    </span>
  );
}

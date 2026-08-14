/* eslint-disable @next/next/no-img-element */

/**
 * TapAway brand logo - the official badge (transparent PNG in /public/logo.png).
 * Sits cleanly on both dark and light sections.
 * `className` controls sizing/spacing; height defaults to 40px.
 */
export default function Logo({
  className = "",
  height = 40,
}: {
  className?: string;
  height?: number;
  /** kept for backwards-compat; the full lockup already includes the wordmark */
  showText?: boolean;
}) {
  return (
    <img
      src="/logo.png"
      alt="TapAway"
      width={Math.round((height * 470) / 361)}
      height={height}
      className={`inline-block w-auto select-none ${className}`}
      style={{ height }}
      draggable={false}
    />
  );
}

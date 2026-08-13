import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/* ── NFC / signal mark ─────────────────────────── */
export const NfcWave = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" {...p}>
    <path d="M6.5 8.5a7 7 0 0 0 0 7" />
    <path d="M9.5 6.5a11 11 0 0 0 0 11" opacity={0.8} />
    <path d="M12.5 4.5a15 15 0 0 0 0 15" opacity={0.6} />
    <circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

/* ── feature / benefit icons ───────────────────── */
export const Bolt = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
);
export const Leaf = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M11 20A7 7 0 0 1 4 13c0-5 4.5-9 16-9 0 9-5 16-9 16Z" />
    <path d="M8 17c2-4 5-6 9-7" />
  </svg>
);
export const Refresh = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);
export const QrIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3M21 14v.01M17 21h4M21 17v4" />
  </svg>
);
export const Phone = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
  </svg>
);
export const IdCard = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="8" cy="12" r="2.2" />
    <path d="M13 10h6M13 14h4" />
  </svg>
);
export const Globe = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
  </svg>
);
export const Mail = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const MapPin = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
export const LinkIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
    <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
  </svg>
);
export const Rupee = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 3h12M6 8h12M6 13l6 8M6 8a5 5 0 0 1 5 5H6" />
  </svg>
);

/* ── social icons (brand-ish, single path) ─────── */
export const Whatsapp = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.6 4.7-1.2A10 10 0 1 0 12 2Zm5.7 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a12 12 0 0 1-5.6-4.9c-.4-.6-.8-1.4-.8-2.2 0-.9.4-1.3.7-1.6.2-.2.4-.2.6-.2h.4c.2 0 .4 0 .6.5l.7 1.7c.1.2 0 .4-.1.5l-.4.5c-.1.1-.2.3-.1.5.4.8 1 1.4 1.6 1.9.5.4 1 .6 1.3.7.2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3.1.2.1.6 0 .9Z" />
  </svg>
);
export const Linkedin = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.6 8.65 22 11 22 14.1V21h-4v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4V9Z" />
  </svg>
);
export const Instagram = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
export const Facebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H17V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H8v3h2.6v8h2.9Z" />
  </svg>
);
export const XTwitter = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18.9 2H22l-7.2 8.3L23 22h-6.6l-5.2-6.8L5.3 22H2l7.7-8.9L1.5 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.1 3.9H5.2L17.7 20Z" />
  </svg>
);
export const Youtube = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12Zm-13 3V9l5.2 3-5.2 3Z" />
  </svg>
);

export const socialIcon: Record<string, (p: P) => JSX.Element> = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  twitter: XTwitter,
  x: XTwitter,
  youtube: Youtube,
  whatsapp: Whatsapp,
  website: Globe,
  payment: Rupee,
};

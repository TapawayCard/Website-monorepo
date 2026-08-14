"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Whatsapp,
  Globe,
  MapPin,
  QrIcon,
  IdCard,
  LinkIcon,
  socialIcon,
} from "@/components/ui/icons";
import Logo from "@/components/ui/Logo";

export type PublicLink = {
  id: string;
  type: "SOCIAL" | "CUSTOM";
  platform: string | null;
  label: string;
  url: string;
};

export type PublicProfileData = {
  username: string;
  fullName: string;
  headline: string | null;
  company: string | null;
  bio: string | null;
  avatarUrl: string | null;
  accent: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  website: string | null;
  location: string | null;
  links: PublicLink[];
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Escape a vCard text value per RFC 2426 (backslash, comma, semicolon, newline).
function esc(v: string) {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

// Fold long lines at 75 octets with a leading space on continuations (RFC 2426).
function fold(line: string) {
  if (line.length <= 75) return line;
  const out: string[] = [line.slice(0, 75)];
  let i = 75;
  while (i < line.length) {
    out.push(" " + line.slice(i, i + 74));
    i += 74;
  }
  return out.join("\r\n");
}

// Map a link platform to an Apple X-SOCIALPROFILE service type when known.
const SOCIAL_SERVICE: Record<string, string> = {
  linkedin: "linkedin",
  instagram: "instagram",
  facebook: "facebook",
  twitter: "twitter",
  x: "twitter",
  youtube: "youtube",
};

function buildVCard(p: PublicProfileData, profileUrl: string) {
  const nameParts = p.fullName.trim().split(/\s+/);
  const given = nameParts.shift() || "";
  const family = nameParts.join(" ");

  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  // Structured + formatted name (both required for correct mapping).
  lines.push(`N:${esc(family)};${esc(given)};;;`);
  lines.push(`FN:${esc(p.fullName)}`);

  if (p.company) lines.push(`ORG:${esc(p.company)}`);
  if (p.headline) lines.push(`TITLE:${esc(p.headline)}`);
  if (p.phone) lines.push(`TEL;TYPE=CELL,VOICE:${esc(p.phone)}`);
  if (p.email) lines.push(`EMAIL;TYPE=INTERNET,PREF:${esc(p.email)}`);
  if (p.website) lines.push(`URL;TYPE=WORK:${esc(p.website)}`);

  // Grouped, labelled links so socials/custom links show up with names.
  let item = 0;
  const addLabelledUrl = (label: string, url: string) => {
    item += 1;
    const g = `item${item}`;
    lines.push(`${g}.URL:${esc(url)}`);
    lines.push(`${g}.X-ABLabel:${esc(label)}`);
  };

  if (p.whatsapp) {
    addLabelledUrl("WhatsApp", `https://wa.me/${p.whatsapp.replace(/\D/g, "")}`);
  }

  for (const l of p.links) {
    if (!l.url) continue;
    const service = l.platform ? SOCIAL_SERVICE[l.platform] : undefined;
    if (service) {
      lines.push(`X-SOCIALPROFILE;TYPE=${service}:${esc(l.url)}`);
    }
    addLabelledUrl(l.label || l.url, l.url);
  }

  if (p.location) {
    if (/^https?:\/\//i.test(p.location)) addLabelledUrl("Location", p.location);
    else lines.push(`ADR;TYPE=WORK:;;${esc(p.location)};;;;`);
  }

  addLabelledUrl("TapAway Profile", profileUrl);

  if (p.bio) lines.push(`NOTE:${esc(p.bio)}`);

  // Embed the profile photo when it is an inline JPEG data URL.
  if (p.avatarUrl && p.avatarUrl.startsWith("data:image/")) {
    const comma = p.avatarUrl.indexOf(",");
    const b64 = comma >= 0 ? p.avatarUrl.slice(comma + 1) : "";
    if (b64) lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${b64}`);
  }

  lines.push("END:VCARD");

  // vCard requires CRLF line endings; fold each line first.
  return lines.map(fold).join("\r\n") + "\r\n";
}

export default function PublicProfile({
  profile,
  profileUrl,
}: {
  profile: PublicProfileData;
  profileUrl: string;
}) {
  const [qr, setQr] = useState<string | null>(null);
  const accent = profile.accent || "#54b3e6";

  const quickActions = [
    profile.phone && { icon: Phone, label: "Call", href: `tel:${profile.phone}` },
    profile.whatsapp && {
      icon: Whatsapp,
      label: "WhatsApp",
      href: `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`,
    },
    profile.email && { icon: Mail, label: "Email", href: `mailto:${profile.email}` },
    profile.website && { icon: Globe, label: "Website", href: profile.website },
    profile.location && { icon: MapPin, label: "Location", href: profile.location },
  ].filter(Boolean) as { icon: (p: any) => JSX.Element; label: string; href: string }[];

  async function showQr() {
    const data = await QRCode.toDataURL(profileUrl, {
      width: 480,
      margin: 2,
      color: { dark: "#0a1024", light: "#ffffff" },
    });
    setQr(data);
  }

  function saveContact() {
    const vcard = buildVCard(profile, profileUrl);
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.username}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="relative min-h-screen bg-navy-950 px-4 py-10 text-white">
      {/* accent glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80"
        style={{ background: `radial-gradient(60% 100% at 50% 0%, ${accent}33, transparent 70%)` }}
      />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* header */}
          <div className="flex flex-col items-center text-center">
            <div
              className="relative h-28 w-28 overflow-hidden rounded-full"
              style={{ boxShadow: `0 0 0 3px ${accent}55, 0 12px 40px ${accent}44` }}
            >
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-3xl font-bold"
                  style={{ background: `linear-gradient(135deg, ${accent}, #1f3468)` }}
                >
                  {initials(profile.fullName)}
                </div>
              )}
            </div>

            <h1 className="mt-5 text-2xl font-bold">{profile.fullName}</h1>
            {profile.headline && (
              <p className="mt-1 text-sm text-white/70">{profile.headline}</p>
            )}
            {profile.company && (
              <p className="text-sm font-medium" style={{ color: accent }}>
                {profile.company}
              </p>
            )}
            {profile.bio && (
              <p className="mt-4 text-sm leading-relaxed text-white/60">{profile.bio}</p>
            )}
          </div>

          {/* primary CTA */}
          <button
            onClick={saveContact}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-navy-950"
            style={{ background: accent, boxShadow: `0 10px 30px ${accent}55` }}
          >
            <IdCard className="h-5 w-5" /> Save contact
          </button>

          {/* quick actions */}
          {quickActions.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {quickActions.slice(0, 4).map((a) => (
                <a
                  key={a.label}
                  href={a.href}
                  target={a.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="glass-strong flex flex-col items-center gap-1.5 rounded-2xl py-3 text-xs text-white/80 transition-transform hover:-translate-y-0.5"
                >
                  <a.icon className="h-5 w-5" style={{ color: accent }} />
                  {a.label}
                </a>
              ))}
            </div>
          )}

          {/* social row */}
          {profile.links.some((l) => l.type === "SOCIAL") && (
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {profile.links
                .filter((l) => l.type === "SOCIAL")
                .map((l) => {
                  const Icon = (l.platform && socialIcon[l.platform]) || LinkIcon;
                  return (
                    <a
                      key={l.id}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={l.label}
                      className="glass flex h-11 w-11 items-center justify-center rounded-full text-white/85 transition-transform hover:-translate-y-0.5"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
            </div>
          )}

          {/* custom links */}
          <div className="mt-6 space-y-3">
            {profile.links
              .filter((l) => l.type === "CUSTOM")
              .map((l) => {
                const Icon = (l.platform && socialIcon[l.platform]) || LinkIcon;
                return (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-strong flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-medium transition-transform hover:-translate-y-0.5"
                  >
                    <Icon className="h-5 w-5" style={{ color: accent }} />
                    <span className="flex-1">{l.label}</span>
                    <span className="text-white/40">↗</span>
                  </a>
                );
              })}
          </div>

          {/* QR */}
          <button
            onClick={showQr}
            className="glass mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-white/80"
          >
            <QrIcon className="h-5 w-5" style={{ color: accent }} /> Show QR code
          </button>

          {/* footer */}
          <div className="mt-10 flex flex-col items-center gap-2 text-center">
            <a href="/" className="opacity-70 transition-opacity hover:opacity-100">
              <Logo className="text-white" />
            </a>
            <p className="text-xs text-white/40">Get your own card at tapaway.in</p>
          </div>
        </motion.div>
      </div>

      {/* QR modal */}
      {qr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setQr(null)}
        >
          <div className="glass-strong rounded-3xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Profile QR code" className="h-60 w-60 rounded-2xl bg-white p-2" />
            <p className="mt-4 text-sm text-white/70">Scan to open this profile</p>
            <button onClick={() => setQr(null)} className="btn-ghost mt-4 !py-2 !text-sm !text-white">
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

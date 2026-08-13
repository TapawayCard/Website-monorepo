import type { Metadata } from "next";
import { Space_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "TapAway — Your Identity. One Tap Away.",
  description:
    "NFC-powered digital visiting cards. Share your contact info, socials, portfolio and more with a single tap. Smart. Sustainable. Professional.",
  keywords: [
    "NFC business card",
    "digital visiting card",
    "TapAway",
    "smart card",
    "digital identity",
  ],
  openGraph: {
    title: "TapAway — Your Identity. One Tap Away.",
    description:
      "NFC-powered digital visiting cards. No paper. No reprinting. No outdated information.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${grotesk.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

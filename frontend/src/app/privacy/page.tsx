import type { Metadata } from "next";
import LegalLayout from "@/components/store/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | TapAway",
  description: "How TapAway collects, uses and protects your personal information.",
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-white">{children}</h2>
);

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="13 August 2026">
      <p>
        This Privacy Policy explains how TapAway collects, uses, shares and protects
        your personal information when you use our website, cards and digital
        profile services.
      </p>

      <H>1. Information we collect</H>
      <p>
        We collect information you provide directly, such as your name, email,
        phone number, shipping address, profile details, social links and any
        images you upload. We also collect limited technical data (such as device
        and usage information) and use cookies and local storage to keep your cart
        and preferences.
      </p>

      <H>2. How we use your information</H>
      <p>
        We use your information to process and deliver orders, create and host your
        digital profile, provide support, send transactional emails (such as order
        confirmations), and improve our Services. We rely on your consent and on the
        performance of our contract with you as the legal bases for processing.
      </p>

      <H>3. Payments</H>
      <p>
        Payments are handled by Razorpay. Your payment card and banking details are
        processed by them under their own privacy terms; TapAway does not store your
        full payment credentials.
      </p>

      <H>4. Your public profile</H>
      <p>
        Information you add to your TapAway profile is intended to be shared publicly
        at your profile URL when someone taps your card or scans your QR code. Only
        add details you are comfortable sharing. You can edit or remove them at any
        time from your dashboard.
      </p>

      <H>5. Cookies and local storage</H>
      <p>
        We use cookies and browser local storage to remember your shopping cart and
        preferences. You can accept or decline non-essential cookies using the banner
        shown on the site, and you can clear them in your browser settings.
      </p>

      <H>6. Sharing</H>
      <p>
        We share information only with service providers who help us operate (such as
        payment, hosting and email providers), when required by law, or to protect
        our rights. We do not sell your personal information.
      </p>

      <H>7. Data retention and security</H>
      <p>
        We keep your information for as long as your account is active or as needed to
        provide the Services and meet legal obligations. We use reasonable technical
        and organisational measures to protect your data, though no method of
        transmission or storage is completely secure.
      </p>

      <H>8. Your rights</H>
      <p>
        You may request access to, correction of, or deletion of your personal
        information, and you may withdraw consent at any time. To exercise these
        rights, email us at support@tapaway.in.
      </p>

      <H>9. Children</H>
      <p>
        Our Services are not directed to children under 18, and we do not knowingly
        collect their personal information.
      </p>

      <H>10. Contact</H>
      <p>
        For any privacy questions or requests, contact support@tapaway.in.
      </p>

      <p className="text-xs text-white/40">
        This document is a general template and not legal advice. Please have it
        reviewed by a qualified professional before you launch.
      </p>
    </LegalLayout>
  );
}

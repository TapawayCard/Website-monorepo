import type { Metadata } from "next";
import LegalLayout from "@/components/store/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | TapAway",
  description: "The terms that govern your use of TapAway products and services.",
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-white">{children}</h2>
);

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updated="13 August 2026">
      <p>
        These Terms &amp; Conditions govern your access to and use of the TapAway
        website, NFC cards and digital profile services (the &quot;Services&quot;). By
        placing an order or creating an account, you agree to these terms. Please
        read them carefully.
      </p>

      <H>1. The products</H>
      <p>
        TapAway sells NFC-enabled visiting cards linked to a digital profile that
        you control. Card designs, colours, finishes and printing are produced to
        the specifications you select at checkout. Product images on the site are
        representative and small variations in colour or finish may occur.
      </p>

      <H>2. Orders and pricing</H>
      <p>
        All prices are listed in Indian Rupees (INR) and are inclusive of
        applicable taxes unless stated otherwise. We reserve the right to correct
        pricing errors and to accept or decline any order. An order is confirmed
        only after successful payment and our acceptance.
      </p>

      <H>3. Payments</H>
      <p>
        Payments are processed by our third-party payment partner (Razorpay). We do
        not store your full card or banking details. By paying, you authorise the
        charge for the total shown at checkout.
      </p>

      <H>4. Manufacturing and delivery</H>
      <p>
        Cards are produced and NFC-programmed after payment is confirmed. Estimated
        delivery is 5 to 10 business days within India and may vary by location and
        courier. Risk passes to you on delivery.
      </p>

      <H>5. Customisation and your content</H>
      <p>
        If you upload a logo, design or other content, you confirm that you own it
        or have the right to use it, and you grant us permission to reproduce it on
        your card. You are responsible for the accuracy of any printed details you
        provide (name, company, designation).
      </p>

      <H>6. Digital profile and acceptable use</H>
      <p>
        Your TapAway profile must not be used for unlawful, misleading or harmful
        content. We may suspend a profile that violates these terms or applicable
        law. You are responsible for keeping your account credentials secure.
      </p>

      <H>7. Returns and refunds</H>
      <p>
        Because cards are personalised, they are generally non-returnable unless the
        product is defective or damaged on arrival. If there is a manufacturing
        defect, contact us within 7 days of delivery and we will repair, replace or
        refund the affected item.
      </p>

      <H>8. Limitation of liability</H>
      <p>
        To the maximum extent permitted by law, TapAway is not liable for indirect
        or consequential losses. Our total liability for any claim is limited to the
        amount you paid for the relevant order.
      </p>

      <H>9. Changes</H>
      <p>
        We may update these terms from time to time. Continued use of the Services
        after changes take effect constitutes acceptance of the revised terms.
      </p>

      <H>10. Contact</H>
      <p>
        Questions about these terms? Email us at support@tapaway.in.
      </p>

      <p className="text-xs text-white/40">
        This document is a general template and not legal advice. Please have it
        reviewed by a qualified professional before you launch.
      </p>
    </LegalLayout>
  );
}

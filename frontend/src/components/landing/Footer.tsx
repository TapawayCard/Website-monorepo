import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="relative px-6 pb-10 pt-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="glass-strong rounded-[2rem] p-10 sm:p-14">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Logo className="text-white" />
              <p className="mt-4 max-w-xs text-sm text-white/60">
                Tap once. Connect instantly. Stay updated forever.
                Smart, sustainable, NFC-powered digital visiting cards.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/signup" className="btn-primary !px-5 !py-2.5 !text-sm">
                  Get Your Card
                </Link>
                <Link href="/login" className="btn-ghost !px-5 !py-2.5 !text-sm !text-white">
                  Log in
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-white/50">
                Explore
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li><a href="#why" className="hover:text-white">Why TapAway</a></li>
                <li><a href="#how" className="hover:text-white">How it works</a></li>
                <li><a href="#cards" className="hover:text-white">Cards</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-white/50">
                Contact
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li><a href="mailto:support@tapaway.in" className="hover:text-white">support@tapaway.in</a></li>
                <li>WhatsApp: +91 XXXXX XXXXX</li>
                <li>Mon – Sat · 10AM – 7PM</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
            <p>© {new Date().getFullYear()} TapAway. All rights reserved.</p>
            <p>Made for a smarter, greener way to network.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

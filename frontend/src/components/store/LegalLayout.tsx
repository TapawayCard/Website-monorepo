import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <header className="border-b border-white/8">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/">
            <Logo className="text-white" />
          </Link>
          <Link href="/" className="text-sm text-white/60 hover:text-white">
            Back to home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-white/45">Last updated: {updated}</p>
        <div className="legal mt-8 space-y-6 text-[15px] leading-relaxed text-white/70">
          {children}
        </div>
      </article>

      <footer className="border-t border-white/8 py-8 text-center text-xs text-white/40">
        <div className="flex justify-center gap-4">
          <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/" className="hover:text-white">Home</Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} TapAway. All rights reserved.</p>
      </footer>
    </div>
  );
}

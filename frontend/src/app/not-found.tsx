import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy-950 px-6 text-center text-white">
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-brand-blue/20 blur-[130px]" />
      <div className="relative z-10">
        <Logo className="mb-8 text-white" />
        <h1 className="text-6xl font-bold">
          4<span className="accent-serif gradient-text">0</span>4
        </h1>
        <p className="mt-4 text-white/60">
          This profile or page doesn't exist. It may have been moved, or the
          username is wrong.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </main>
  );
}

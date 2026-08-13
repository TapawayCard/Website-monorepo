import Link from "next/link";
import Logo from "./Logo";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-6 py-14 text-white">
      {/* ambient background */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-brand-blue/20 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-brand-sky/15 blur-[130px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo className="text-white" />
          </Link>
        </div>

        <div className="glass-strong rounded-[1.75rem] p-8 sm:p-10" style={{ ["--glass-border" as string]: "rgba(255,255,255,0.14)" }}>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-white/60">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-white/55">{footer}</p>
      </div>
    </main>
  );
}

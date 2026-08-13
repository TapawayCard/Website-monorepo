"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/ui/AuthShell";

const field =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-brand-sky";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/60">Email</label>
        <input name="email" type="email" required className={field} placeholder="you@example.com" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/60">Password</label>
        <input name="password" type="password" required className={field} placeholder="••••••••" />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Signing in…" : "Log in"}
      </button>

      <p className="rounded-xl bg-white/5 px-3 py-2 text-center text-xs text-white/40">
        Demo login · demo@tapaway.in / demo1234
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title={
        <>
          Welcome <span className="accent-serif">back.</span>
        </>
      }
      subtitle="Log in to manage your digital identity."
      footer={
        <>
          New to TapAway?{" "}
          <Link href="/signup" className="font-semibold text-brand-sky hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

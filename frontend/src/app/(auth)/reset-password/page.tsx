"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/ui/AuthShell";

const field =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-brand-sky";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    if (password !== confirm) {
      return setError("Passwords don't match.");
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not reset your password");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset your password");
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="rounded-xl bg-white/5 px-4 py-3 text-sm text-white/70">
        This reset link is missing its token. Please request a new one from the{" "}
        <Link href="/forgot-password" className="font-semibold text-brand-sky hover:underline">
          forgot password
        </Link>{" "}
        page.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/60">New password</label>
        <input name="password" type="password" required minLength={8} className={field} placeholder="••••••••" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/60">Confirm password</label>
        <input name="confirm" type="password" required minLength={8} className={field} placeholder="••••••••" />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Resetting…" : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title={
        <>
          Set a new <span className="accent-serif">password.</span>
        </>
      }
      subtitle="Choose a new password for your account."
      footer={
        <>
          Remembered your old password?{" "}
          <Link href="/login" className="font-semibold text-brand-sky hover:underline">
            Back to log in
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}

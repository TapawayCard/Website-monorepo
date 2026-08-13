"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/ui/AuthShell";

const field =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-brand-sky";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "") || "tapaway.in";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          email: form.get("email"),
          phone: form.get("phone"),
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={
        <>
          Create your <span className="accent-serif">identity.</span>
        </>
      }
      subtitle="Set up your account, then claim your TapAway link."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-sky hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">Full name</label>
          <input name="fullName" required className={field} placeholder="Ananya Rao" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Email</label>
            <input name="email" type="email" required className={field} placeholder="you@email.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Mobile</label>
            <input name="phone" className={field} placeholder="+91 …" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">Username</label>
          <input
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            className={field}
            placeholder="yourname"
          />
          <p className="mt-1.5 text-xs text-white/40">
            Your profile: {siteUrl}/u/
            <span className="text-brand-sky">{username || "yourname"}</span>
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">Password</label>
          <input name="password" type="password" required minLength={8} className={field} placeholder="At least 8 characters" />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
}

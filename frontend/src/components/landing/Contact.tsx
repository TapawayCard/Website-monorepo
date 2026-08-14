"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { Mail, Whatsapp, Phone } from "@/components/ui/icons";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      message: String(form.get("message") || ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("sent");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const field =
    "w-full rounded-2xl bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-current placeholder:opacity-40 focus:border-brand-sky";

  return (
    <section id="contact" className="relative px-6 py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div>
            <p className="eyebrow">Contact us</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Have{" "}
              <span className="accent-serif">questions?</span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              We'd love to help you get set up. Reach out any time.
            </p>

            <div className="mt-8 space-y-3">
              <a href="mailto:support@tapaway.in" className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                <Mail className="h-5 w-5 text-brand-sky" />
                support@tapaway.in
              </a>
              <a
                href="https://wa.me/919820117283"
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm"
              >
                <Whatsapp className="h-5 w-5 text-brand-sky" />
                WhatsApp: +91 98201 17283
              </a>
              <a href="tel:+919820117283" className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                <Phone className="h-5 w-5 text-brand-sky" />
                +91 98201 17283 · Mon to Sat · 10:00 AM to 7:00 PM
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="glass-strong rounded-3xl p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-xs font-medium text-muted">Name</label>
                <input name="name" required className={field} style={{ border: "1px solid var(--glass-border)" }} placeholder="Your name" />
              </div>
              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-xs font-medium text-muted">Phone number</label>
                <input name="phone" className={field} style={{ border: "1px solid var(--glass-border)" }} placeholder="+91 …" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-muted">Email</label>
                <input name="email" type="email" required className={field} style={{ border: "1px solid var(--glass-border)" }} placeholder="you@example.com" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-muted">Message</label>
                <textarea name="message" required rows={4} className={field} style={{ border: "1px solid var(--glass-border)" }} placeholder="How can we help?" />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary mt-6 w-full disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : status === "sent" ? "Message sent ✓" : "Submit"}
            </button>
            {status === "error" && <p className="mt-3 text-sm text-red-400">{error}</p>}
            {status === "sent" && (
              <p className="mt-3 text-sm text-brand-sky">Thanks! We'll get back to you soon.</p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import StoreNav from "@/components/store/StoreNav";
import CookieConsent from "@/components/store/CookieConsent";
import { useCart } from "@/components/store/CartProvider";
import { CARDS, UPI_ID, rupees, summarize } from "@/lib/catalog";

function compressImage(file: File, maxDim = 1400, quality = 0.9): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no canvas"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

const label = "mb-1.5 block text-xs font-medium text-white/55";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, ready, subtotalPaise, clear } = useCart();

  const [step, setStep] = useState<"details" | "payment">("details");
  const [f, setF] = useState({
    name: "", email: "", phone: "",
    line1: "", line2: "", city: "", state: "", pincode: "", country: "India",
  });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [orderId, setOrderId] = useState("");
  const [amountPaise, setAmountPaise] = useState(0);
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const [proofData, setProofData] = useState<string | undefined>();
  const [proofErr, setProofErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const upiLink = orderId
    ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent("TapAway")}&am=${(amountPaise / 100).toFixed(2)}&cu=INR&tn=${encodeURIComponent(
        `TapAway order ${orderId.slice(-8).toUpperCase()}`
      )}`
    : "";

  async function createOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!consent) return setError("Please accept the Terms and Privacy Policy.");
    if (items.length === 0) return setError("Your cart is empty.");
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          buyer: { name: f.name, email: f.email, phone: f.phone },
          address: {
            line1: f.line1, line2: f.line2, city: f.city,
            state: f.state, pincode: f.pincode, country: f.country,
          },
          consent: true,
        }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Could not create your order");

      setOrderId(order.orderId);
      setAmountPaise(order.amountPaise);

      const link = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent("TapAway")}&am=${(order.amountPaise / 100).toFixed(2)}&cu=INR&tn=${encodeURIComponent(
        `TapAway order ${order.orderId.slice(-8).toUpperCase()}`
      )}`;
      const qrDataUrl = await QRCode.toDataURL(link, { width: 320, margin: 2, color: { dark: "#0a1024", light: "#ffffff" } });
      setQr(qrDataUrl);

      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function onUploadProof(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setProofErr("");
    if (!file.type.startsWith("image/")) return setProofErr("Please choose an image file.");
    if (file.size > 12 * 1024 * 1024) return setProofErr("Image must be under 12MB.");
    try {
      setProofData(await compressImage(file));
    } catch {
      setProofErr("Could not process that image.");
    }
  }

  function copyUpi() {
    navigator.clipboard?.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  async function submitProof() {
    setError("");
    if (!proofData) return setError("Please upload a screenshot of your payment.");
    setBusy(true);
    try {
      const res = await fetch("/api/orders/payment-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, proofData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit your payment proof");
      clear();
      router.push(`/checkout/success?order=${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  if (ready && items.length === 0 && step === "details") {
    return (
      <div className="min-h-screen bg-navy-950 text-white">
        <StoreNav />
        <div className="mx-auto max-w-md px-5 py-24 text-center">
          <p className="text-white/60">Your cart is empty.</p>
          <Link href="/product" className="btn-primary mt-6 inline-flex">Design your card</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <StoreNav />
      <CookieConsent />

      <div className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

        {step === "details" ? (
          <form onSubmit={createOrder} className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            {/* details */}
            <div className="space-y-6">
              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-sm font-semibold">Your details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={label}>Full name</label>
                    <input required className="field" value={f.name} onChange={set("name")} placeholder="Your name" />
                  </div>
                  <div>
                    <label className={label}>Email</label>
                    <input required type="email" className="field" value={f.email} onChange={set("email")} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className={label}>Phone</label>
                    <input required className="field" value={f.phone} onChange={set("phone")} placeholder="+91 …" />
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-sm font-semibold">Shipping address</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={label}>Address line 1</label>
                    <input required className="field" value={f.line1} onChange={set("line1")} placeholder="House / flat, street" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Address line 2 (optional)</label>
                    <input className="field" value={f.line2} onChange={set("line2")} placeholder="Area, landmark" />
                  </div>
                  <div>
                    <label className={label}>City</label>
                    <input required className="field" value={f.city} onChange={set("city")} />
                  </div>
                  <div>
                    <label className={label}>State</label>
                    <input required className="field" value={f.state} onChange={set("state")} />
                  </div>
                  <div>
                    <label className={label}>PIN code</label>
                    <input required className="field" value={f.pincode} onChange={set("pincode")} />
                  </div>
                  <div>
                    <label className={label}>Country</label>
                    <input required className="field" value={f.country} onChange={set("country")} />
                  </div>
                </div>
              </section>

              <label className="flex items-start gap-3 text-sm text-white/70">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-brand-sky hover:underline">Terms &amp; Conditions</Link> and{" "}
                  <Link href="/privacy" className="text-brand-sky hover:underline">Privacy Policy</Link>.
                </span>
              </label>

              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>

            {/* summary */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-sm font-semibold">Order summary</h2>
                <div className="mt-4 space-y-3">
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between gap-3 text-sm">
                      <span className="text-white/70">
                        {CARDS.find((c) => c.key === it.cardType)?.name.replace(" NFC Card", "")} × {it.qty}
                        <span className="block text-xs text-white/40">{summarize(it)}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span>{rupees(subtotalPaise)}</span>
                </div>
                <button type="submit" disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-60">
                  {busy ? "Please wait…" : "Continue to payment"}
                </button>
                <p className="mt-3 text-center text-xs text-white/40">
                  You'll pay via UPI on the next step and upload your payment screenshot.
                </p>
              </div>
            </div>
          </form>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
            {/* pay */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <h2 className="text-sm font-semibold">Pay via UPI</h2>
              <p className="mt-1 text-3xl font-bold text-brand-sky">{rupees(amountPaise)}</p>

              {qr && (
                <div className="mx-auto mt-4 w-fit rounded-2xl bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qr} alt="UPI QR code" className="h-48 w-48" />
                </div>
              )}
              <p className="mt-3 text-xs text-white/50">Scan with any UPI app, or pay directly to:</p>

              <button
                type="button"
                onClick={copyUpi}
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium hover:border-white/30"
              >
                {UPI_ID}
                <span className="text-brand-sky">{copied ? "Copied ✓" : "Copy"}</span>
              </button>

              <a href={upiLink} className="btn-primary mt-4 w-full sm:hidden">
                Open in UPI app
              </a>

              <p className="mt-4 text-xs text-white/40">
                Order reference: <span className="font-semibold">#{orderId.slice(-8).toUpperCase()}</span> — mention this in the payment note if possible.
              </p>
            </div>

            {/* upload proof */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-sm font-semibold">Upload payment screenshot</h2>
              <p className="mt-1 text-xs text-white/50">
                After paying, upload a screenshot of the successful transaction. Our team will
                verify it and confirm your order by email.
              </p>

              <div className="mt-4">
                {proofData ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={proofData} alt="Payment proof" className="max-h-64 w-full rounded-2xl border border-white/10 object-contain" />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-white/40">
                    No screenshot uploaded yet
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/85 hover:text-white"
                >
                  {proofData ? "Change screenshot" : "Upload screenshot"}
                </button>
                {proofData && (
                  <button
                    type="button"
                    onClick={() => setProofData(undefined)}
                    className="rounded-full px-3 py-2 text-sm text-white/55 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUploadProof} />
              </div>
              {proofErr && <p className="mt-1.5 text-xs text-red-400">{proofErr}</p>}
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

              <button
                type="button"
                onClick={submitProof}
                disabled={busy || !proofData}
                className="btn-primary mt-6 w-full disabled:opacity-60"
              >
                {busy ? "Submitting…" : "I've paid — submit proof"}
              </button>
              <button
                type="button"
                onClick={() => setStep("details")}
                className="mt-2 w-full text-center text-xs text-white/40 hover:text-white/70"
              >
                ← Back to details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

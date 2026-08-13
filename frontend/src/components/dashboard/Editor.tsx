"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import PublicProfile, {
  type PublicProfileData,
} from "@/components/profile/PublicProfile";

type EditLink = {
  id?: string;
  type: "SOCIAL" | "CUSTOM";
  platform: string;
  label: string;
  url: string;
  active: boolean;
};

type State = {
  username: string;
  fullName: string;
  headline: string;
  company: string;
  bio: string;
  avatarUrl: string;
  accent: string;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  location: string;
  views: number;
  links: EditLink[];
};

const SOCIALS = ["linkedin", "instagram", "facebook", "twitter", "youtube", "whatsapp"];

const field =
  "w-full rounded-xl border border-white/12 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-sky";
const labelCls = "mb-1.5 block text-xs font-medium text-white/55";

function Section({ title, children, desc }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="glass-strong rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {desc && <p className="mt-0.5 text-xs text-white/45">{desc}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

export default function Editor({
  initial,
  siteUrl,
  email,
}: {
  initial: State;
  siteUrl: string;
  email: string;
}) {
  const router = useRouter();
  const [s, setS] = useState<State>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const host = siteUrl.replace(/^https?:\/\//, "");
  const profileUrl = `${siteUrl}/u/${s.username}`;

  function set<K extends keyof State>(key: K, value: State[K]) {
    setS((prev) => ({ ...prev, [key]: value }));
  }

  function updateLink(i: number, patch: Partial<EditLink>) {
    setS((prev) => {
      const links = [...prev.links];
      links[i] = { ...links[i], ...patch };
      return { ...prev, links };
    });
  }
  function addLink(type: "SOCIAL" | "CUSTOM") {
    setS((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        {
          type,
          platform: type === "SOCIAL" ? "linkedin" : "",
          label: type === "SOCIAL" ? "LinkedIn" : "",
          url: "",
          active: true,
        },
      ],
    }));
  }
  function removeLink(i: number) {
    setS((prev) => ({ ...prev, links: prev.links.filter((_, idx) => idx !== i) }));
  }
  function move(i: number, dir: -1 | 1) {
    setS((prev) => {
      const links = [...prev.links];
      const j = i + dir;
      if (j < 0 || j >= links.length) return prev;
      [links[i], links[j]] = [links[j], links[i]];
      return { ...prev, links };
    });
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const pRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: s.fullName,
          headline: s.headline,
          company: s.company,
          bio: s.bio,
          avatarUrl: s.avatarUrl,
          accent: s.accent,
          phone: s.phone,
          email: s.email,
          whatsapp: s.whatsapp,
          website: s.website,
          location: s.location,
        }),
      });
      const pData = await pRes.json();
      if (!pRes.ok) throw new Error(pData.error || "Could not save profile");

      const lRes = await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: s.links.map((l) => ({
            type: l.type,
            platform: l.platform,
            label: l.label,
            url: l.url,
            active: l.active,
          })),
        }),
      });
      const lData = await lRes.json();
      if (!lRes.ok) throw new Error(lData.error || "Could not save links");

      setMsg({ kind: "ok", text: "Saved! Your profile is live." });
      router.refresh();
    } catch (err) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const preview: PublicProfileData = useMemo(
    () => ({
      username: s.username,
      fullName: s.fullName || "Your Name",
      headline: s.headline || null,
      company: s.company || null,
      bio: s.bio || null,
      avatarUrl: s.avatarUrl || null,
      accent: s.accent || "#54b3e6",
      phone: s.phone || null,
      email: s.email || null,
      whatsapp: s.whatsapp || null,
      website: s.website || null,
      location: s.location || null,
      links: s.links
        .filter((l) => l.active && l.url)
        .map((l, i) => ({
          id: String(i),
          type: l.type,
          platform: l.platform || null,
          label: l.label || l.url,
          url: l.url,
        })),
    }),
    [s]
  );

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-navy-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link href="/">
            <Logo className="text-white" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`/u/${s.username}`}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:text-white sm:inline-flex"
            >
              View profile ↗
            </a>
            <button onClick={save} disabled={saving} className="btn-primary !px-5 !py-2.5 !text-sm disabled:opacity-60">
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button onClick={logout} className="rounded-full px-3 py-2 text-sm text-white/55 hover:text-white">
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* editor column */}
        <div className="space-y-5">
          <div className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-white/45">Signed in as {email}</p>
                <p className="mt-1 text-sm">
                  Your link:{" "}
                  <a href={`/u/${s.username}`} target="_blank" rel="noreferrer" className="font-medium text-brand-sky">
                    {host}/u/{s.username}
                  </a>
                </p>
              </div>
              <div className="rounded-xl bg-white/5 px-4 py-2 text-center">
                <p className="text-lg font-bold">{s.views}</p>
                <p className="text-[10px] uppercase tracking-wide text-white/45">Profile views</p>
              </div>
            </div>
          </div>

          <Section title="Profile" desc="This is what people see when they tap your card.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Full name</label>
                <input className={field} value={s.fullName} onChange={(e) => set("fullName", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Designation / headline</label>
                <input className={field} value={s.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Product Designer" />
              </div>
              <div>
                <label className={labelCls}>Company</label>
                <input className={field} value={s.company} onChange={(e) => set("company", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Profile photo URL</label>
                <input className={field} value={s.avatarUrl} onChange={(e) => set("avatarUrl", e.target.value)} placeholder="https://…" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Bio</label>
              <textarea className={field} rows={3} value={s.bio} onChange={(e) => set("bio", e.target.value)} maxLength={400} placeholder="A line or two about you." />
            </div>
            <div className="flex items-center gap-3">
              <label className={labelCls + " !mb-0"}>Theme colour</label>
              <input type="color" value={s.accent} onChange={(e) => set("accent", e.target.value)} className="h-9 w-14 cursor-pointer rounded-lg border border-white/15 bg-transparent" />
              <span className="text-xs text-white/45">{s.accent}</span>
            </div>
          </Section>

          <Section title="Contact" desc="Quick-action buttons on your profile.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Phone</label>
                <input className={field} value={s.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 …" />
              </div>
              <div>
                <label className={labelCls}>WhatsApp number</label>
                <input className={field} value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="9198…" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input className={field} value={s.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Website</label>
                <input className={field} value={s.website} onChange={(e) => set("website", e.target.value)} placeholder="https://…" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Location (Google Maps link or address)</label>
                <input className={field} value={s.location} onChange={(e) => set("location", e.target.value)} placeholder="https://maps.google.com/?q=…" />
              </div>
            </div>
          </Section>

          <Section title="Links" desc="Add social profiles and custom links, then drag the order with the arrows.">
            <div className="space-y-3">
              {s.links.map((l, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/60">
                      {l.type === "SOCIAL" ? "Social" : "Custom"}
                    </span>
                    <div className="ml-auto flex items-center gap-1">
                      <button onClick={() => move(i, -1)} className="rounded-md px-2 py-1 text-white/50 hover:bg-white/10" aria-label="Move up">↑</button>
                      <button onClick={() => move(i, 1)} className="rounded-md px-2 py-1 text-white/50 hover:bg-white/10" aria-label="Move down">↓</button>
                      <label className="ml-1 flex cursor-pointer items-center gap-1 text-xs text-white/50">
                        <input type="checkbox" checked={l.active} onChange={(e) => updateLink(i, { active: e.target.checked })} />
                        on
                      </label>
                      <button onClick={() => removeLink(i)} className="rounded-md px-2 py-1 text-red-400/80 hover:bg-red-500/10" aria-label="Delete">✕</button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr]">
                    {l.type === "SOCIAL" ? (
                      <select
                        className={field + " sm:w-36"}
                        value={l.platform}
                        onChange={(e) => {
                          const p = e.target.value;
                          updateLink(i, { platform: p, label: p.charAt(0).toUpperCase() + p.slice(1) });
                        }}
                      >
                        {SOCIALS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    ) : (
                      <input className={field + " sm:w-40"} value={l.label} onChange={(e) => updateLink(i, { label: e.target.value })} placeholder="Label" />
                    )}
                    <input className={field} value={l.url} onChange={(e) => updateLink(i, { url: e.target.value })} placeholder="https://…" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => addLink("SOCIAL")} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:text-white">
                + Social link
              </button>
              <button onClick={() => addLink("CUSTOM")} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:text-white">
                + Custom link
              </button>
            </div>
          </Section>

          {msg && (
            <p className={`text-sm ${msg.kind === "ok" ? "text-brand-sky" : "text-red-400"}`}>
              {msg.text}
            </p>
          )}
        </div>

        {/* live preview */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <p className="mb-3 text-center text-xs uppercase tracking-wide text-white/40">Live preview</p>
          <div className="mx-auto max-w-sm overflow-hidden rounded-[2.2rem] border border-white/10 shadow-2xl">
            <div className="scale-100 origin-top">
              <PublicProfile profile={preview} profileUrl={profileUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

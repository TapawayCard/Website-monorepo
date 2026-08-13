import { redirect } from "next/navigation";
import { getToken } from "@/lib/session";
import { apiFetch } from "@/lib/api";
import Editor from "@/components/dashboard/Editor";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const token = getToken();
  if (!token) redirect("/login");

  const { ok, data } = await apiFetch("/me/profile", { token });
  if (!ok || !data?.profile) redirect("/login");

  const profile = data.profile;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <Editor
      siteUrl={siteUrl}
      email={data.email || ""}
      initial={{
        username: profile.username,
        fullName: profile.fullName,
        headline: profile.headline ?? "",
        company: profile.company ?? "",
        bio: profile.bio ?? "",
        avatarUrl: profile.avatarUrl ?? "",
        accent: profile.accent || "#54b3e6",
        phone: profile.phone ?? "",
        email: profile.email ?? "",
        whatsapp: profile.whatsapp ?? "",
        website: profile.website ?? "",
        location: profile.location ?? "",
        views: profile.views ?? 0,
        links: (profile.links ?? []).map((l: any) => ({
          id: l.id,
          type: l.type,
          platform: l.platform ?? "",
          label: l.label,
          url: l.url,
          active: l.active ?? true,
        })),
      }}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import PublicProfile, {
  type PublicProfileData,
} from "@/components/profile/PublicProfile";

export const dynamic = "force-dynamic";

async function getProfile(username: string): Promise<PublicProfileData | null> {
  const { ok, data } = await apiFetch(`/profiles/${encodeURIComponent(username)}`);
  if (!ok || !data?.profile) return null;
  return data.profile as PublicProfileData;
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const profile = await getProfile(params.username);
  if (!profile) return { title: "Profile not found · TapAway" };
  return {
    title: `${profile.fullName}${profile.headline ? " · " + profile.headline : ""} · TapAway`,
    description: profile.bio || `${profile.fullName}'s TapAway digital card.`,
    openGraph: {
      title: profile.fullName,
      description: profile.bio || "TapAway digital card",
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfile(params.username);
  if (!profile) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const profileUrl = `${siteUrl}/u/${profile.username}`;

  return <PublicProfile profile={profile} profileUrl={profileUrl} />;
}

import { Router } from "express";
import { prisma } from "../lib/prisma";

export const profilesRouter = Router();

// Public profile by username (the NFC card target). Counts a view.
profilesRouter.get("/:username", async (req, res) => {
  const username = String(req.params.username || "").toLowerCase();
  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      links: { where: { active: true }, orderBy: { position: "asc" } },
    },
  });
  if (!profile) return res.status(404).json({ error: "Profile not found" });

  // best-effort view count
  prisma.profile
    .update({ where: { id: profile.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  return res.json({
    profile: {
      username: profile.username,
      fullName: profile.fullName,
      headline: profile.headline,
      company: profile.company,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      accent: profile.accent,
      phone: profile.phone,
      email: profile.email,
      whatsapp: profile.whatsapp,
      website: profile.website,
      location: profile.location,
      links: profile.links.map((l) => ({
        id: l.id,
        type: l.type,
        platform: l.platform,
        label: l.label,
        url: l.url,
      })),
    },
  });
});

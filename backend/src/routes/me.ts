import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { profileSchema, linksPayloadSchema } from "../lib/validators";
import { LinkType } from "@prisma/client";

export const meRouter = Router();

meRouter.use(requireAuth);

// Current user's profile + links
meRouter.get("/profile", async (req, res) => {
  const profile = await prisma.profile.findUnique({
    where: { userId: req.userId! },
    include: { links: { orderBy: { position: "asc" } } },
  });
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  return res.json({ profile, email: req.userEmail });
});

// Update profile fields
meRouter.put("/profile", async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const d = parsed.data;
  const profile = await prisma.profile.update({
    where: { userId: req.userId! },
    data: {
      fullName: d.fullName,
      headline: d.headline || null,
      company: d.company || null,
      bio: d.bio || null,
      avatarUrl: d.avatarUrl || null,
      accent: d.accent || "#54b3e6",
      phone: d.phone || null,
      email: d.email || null,
      whatsapp: d.whatsapp || null,
      website: d.website || null,
      location: d.location || null,
    },
  });
  return res.json({ ok: true, profile });
});

// Replace the full set of links
meRouter.put("/links", async (req, res) => {
  const parsed = linksPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: req.userId! },
    select: { id: true },
  });
  if (!profile) return res.status(404).json({ error: "Profile not found" });

  const links = parsed.data.links;
  await prisma.$transaction([
    prisma.link.deleteMany({ where: { profileId: profile.id } }),
    prisma.link.createMany({
      data: links.map((l, i) => ({
        profileId: profile.id,
        type: l.type === "SOCIAL" ? LinkType.SOCIAL : LinkType.CUSTOM,
        platform: l.platform || null,
        label: l.label,
        url: l.url,
        position: i,
        active: l.active,
      })),
    }),
  ]);

  const fresh = await prisma.link.findMany({
    where: { profileId: profile.id },
    orderBy: { position: "asc" },
  });
  return res.json({ ok: true, links: fresh });
});

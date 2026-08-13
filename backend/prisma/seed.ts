import { PrismaClient, LinkType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@tapaway.in";
  const passwordHash = await bcrypt.hash("demo1234", 10);

  // Clean up any previous demo user so the seed is idempotent.
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      email,
      phone: "+91 90000 00000",
      passwordHash,
      profile: {
        create: {
          username: "ananya",
          fullName: "Ananya Rao",
          headline: "Product Designer & Creative Consultant",
          company: "Studio Nimbus",
          bio: "I design calm, human interfaces for ambitious teams. Tap to connect — let's build something worth remembering.",
          avatarUrl:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
          accent: "#54b3e6",
          phone: "+91 90000 00000",
          email: "ananya@studionimbus.co",
          whatsapp: "919000000000",
          website: "https://studionimbus.co",
          location: "https://maps.google.com/?q=Bengaluru",
          links: {
            create: [
              { type: LinkType.SOCIAL, platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/ananya", position: 0 },
              { type: LinkType.SOCIAL, platform: "instagram", label: "Instagram", url: "https://instagram.com/ananya.designs", position: 1 },
              { type: LinkType.SOCIAL, platform: "twitter", label: "X (Twitter)", url: "https://x.com/ananya", position: 2 },
              { type: LinkType.SOCIAL, platform: "youtube", label: "YouTube", url: "https://youtube.com/@ananya", position: 3 },
              { type: LinkType.CUSTOM, label: "View my portfolio", url: "https://studionimbus.co/work", position: 4 },
              { type: LinkType.CUSTOM, platform: "payment", label: "Pay me via UPI", url: "upi://pay?pa=ananya@upi", position: 5 },
            ],
          },
        },
      },
    },
    include: { profile: true },
  });

  console.log("Seeded demo user:");
  console.log("  login: demo@tapaway.in / demo1234");
  console.log(`  profile: /u/${user.profile?.username}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

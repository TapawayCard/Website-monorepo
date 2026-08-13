import { Router } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";
import { signToken } from "../lib/jwt";
import { signupSchema, loginSchema } from "../lib/validators";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const { fullName, email, phone, username, password } = parsed.data;

  const [emailTaken, usernameTaken] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.profile.findUnique({ where: { username } }),
  ]);
  if (emailTaken) return res.status(409).json({ error: "An account with this email already exists." });
  if (usernameTaken) return res.status(409).json({ error: "That username is already taken." });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      phone: phone || null,
      passwordHash,
      profile: { create: { username, fullName, email, phone: phone || null } },
    },
  });

  const token = await signToken({ uid: user.id, email: user.email });
  return res.status(201).json({ token, username });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const token = await signToken({ uid: user.id, email: user.email });
  return res.json({ token });
});

import { Router } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";
import { signToken } from "../lib/jwt";
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../lib/validators";
import { generateResetToken, hashResetToken, RESET_TOKEN_TTL_MS } from "../lib/resetToken";
import { sendMail } from "../lib/mail";

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
      privacyAcceptedAt: new Date(),
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

authRouter.post("/forgot-password", async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  // Always respond the same way whether or not the account exists, so this
  // endpoint can't be used to check which emails have TapAway accounts.
  if (user) {
    const { token, hash } = generateResetToken();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: hash,
        resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    void sendMail({
      to: user.email,
      subject: "Reset your TapAway password",
      html: `
        <div style="font-family:system-ui,Arial,sans-serif;max-width:480px">
          <h2 style="color:#1e7bb4">Reset your password</h2>
          <p>We received a request to reset your TapAway password. This link expires in 1 hour.</p>
          <p><a href="${resetLink}" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#1e7bb4;color:#fff;border-radius:999px;text-decoration:none">Reset password</a></p>
          <p style="color:#667;font-size:13px">If you didn't request this, you can safely ignore this email - your password won't change.</p>
        </div>`,
    }).catch((e) => console.error("[forgot-password email]", e));
  }

  return res.json({ ok: true });
});

authRouter.post("/reset-password", async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const { token, password } = parsed.data;
  const hash = hashResetToken(token);

  const user = await prisma.user.findFirst({
    where: { resetTokenHash: hash, resetTokenExpiresAt: { gt: new Date() } },
  });
  if (!user) {
    return res.status(400).json({ error: "This reset link is invalid or has expired." });
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
  });

  const authToken = await signToken({ uid: user.id, email: user.email });
  return res.json({ token: authToken });
});

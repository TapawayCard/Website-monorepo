import { Router } from "express";
import { contactSchema } from "../lib/validators";

export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }

  // NOTE: wire this to your email provider (Resend, Postmark, Nodemailer) or CRM.
  console.log("[contact] new enquiry:", parsed.data);

  return res.json({ ok: true });
});

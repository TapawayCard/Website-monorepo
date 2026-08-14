import { Router } from "express";
import { contactSchema } from "../lib/validators";
import { sendMail, notifyEmail } from "../lib/mail";
import { escapeHtml } from "../lib/html";

export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const { name, email, phone, message } = parsed.data;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "-");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  await sendMail({
    to: notifyEmail(),
    subject: `New contact enquiry from ${name}`,
    html: `
      <div style="font-family:system-ui,Arial,sans-serif;max-width:520px">
        <h2>New contact form enquiry</h2>
        <p><strong>Name:</strong> ${safeName}<br/>
           <strong>Email:</strong> ${safeEmail}<br/>
           <strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Message</strong></p>
        <p>${safeMessage}</p>
      </div>`,
  });

  return res.json({ ok: true });
});

import nodemailer from "nodemailer";

/*
  Minimal email helper. If SMTP is not configured, emails are logged instead
  of sent, so the app keeps working end-to-end during development.

  Configure in the backend environment:
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, TAPAWAY_NOTIFY_EMAIL
*/

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
    // Fail fast instead of hanging the request if the SMTP connection stalls.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });
  return transporter;
}

export type MailAttachment = {
  filename: string;
  content: string; // base64-encoded
  encoding: "base64";
};

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  attachments?: MailAttachment[];
}) {
  const t = getTransporter();
  const from = process.env.MAIL_FROM || "TapAway <no-reply@tapaway.in>";
  if (!t) {
    console.log(`[mail:skipped] to=${opts.to} subject="${opts.subject}" (SMTP not configured)`);
    return;
  }
  try {
    await t.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      attachments: opts.attachments,
    });
  } catch (e) {
    console.error("[mail:error]", e);
  }
}

export const notifyEmail = () =>
  process.env.TAPAWAY_NOTIFY_EMAIL || "support@tapaway.in";

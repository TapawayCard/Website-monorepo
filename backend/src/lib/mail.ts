/*
  Minimal email helper backed by the Resend HTTP API. Raw SMTP to Gmail was
  dropped/timing out from Railway's network (cloud IP ranges routinely get
  silently blocked by Google), so mail goes over HTTPS instead - which isn't
  blockable the same way and is what transactional mail providers are for.

  If RESEND_API_KEY is not configured, emails are logged instead of sent, so
  the app keeps working end-to-end during development.

  Configure in the backend environment:
    RESEND_API_KEY, MAIL_FROM (must be on a domain verified in Resend),
    TAPAWAY_NOTIFY_EMAIL
*/

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
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "TapAway <no-reply@tapawaycard.com>";
  if (!apiKey) {
    console.log(`[mail:skipped] to=${opts.to} subject="${opts.subject}" (RESEND_API_KEY not configured)`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        attachments: opts.attachments?.map((a) => ({ filename: a.filename, content: a.content })),
      }),
    });
    if (!res.ok) {
      console.error("[mail:error]", res.status, await res.text());
    }
  } catch (e) {
    console.error("[mail:error]", e);
  }
}

export const notifyEmail = () =>
  process.env.TAPAWAY_NOTIFY_EMAIL || "support@tapaway.in";

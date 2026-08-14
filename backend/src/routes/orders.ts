import { Router } from "express";
import { prisma } from "../lib/prisma";
import { createOrderSchema, paymentProofSchema } from "../lib/validators";
import { priceCartPaise, CATALOG, UPI_ID, type OrderItem } from "../lib/catalog";
import { sendMail, notifyEmail, type MailAttachment } from "../lib/mail";
import { escapeHtml } from "../lib/html";

export const ordersRouter = Router();

const rupees = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Only accept the image types we know how to name/attach - rejects arbitrary
// file types masquerading as a "logo" or "payment screenshot".
function parseImageDataUrl(dataUrl: string): { mime: string; base64: string } | null {
  const m = /^data:([\w/+.-]+);base64,(.+)$/.exec(dataUrl);
  if (!m) return null;
  const mime = m[1].toLowerCase();
  if (!(mime in MIME_EXT)) return null;
  return { mime, base64: m[2] };
}

/* Builds the <li> lines for the order items list, and pulls out any uploaded
   company logos as attachments so they actually show up in the email
   (data: URIs in the HTML body get stripped by most mail clients). */
function buildOrderItems(items: any[]): { linesHtml: string; attachments: MailAttachment[] } {
  const attachments: MailAttachment[] = [];
  const linesHtml = items
    .map((it, i) => {
      const card = CATALOG.cards[it.cardType]?.name ?? it.cardType;
      const bits = [
        it.printName ? `Name: ${escapeHtml(it.printName)}` : null,
        it.printDesignation ? `Designation: ${escapeHtml(it.printDesignation)}` : null,
        it.customNotes ? `Brief: ${escapeHtml(it.customNotes)}` : null,
      ].filter(Boolean);

      const parsed = it.companyLogoData ? parseImageDataUrl(it.companyLogoData) : null;
      if (parsed) {
        const filename = `company-logo-${i + 1}.${MIME_EXT[parsed.mime] || "png"}`;
        attachments.push({ filename, content: parsed.base64, encoding: "base64" });
        bits.push(`Company logo attached (${filename})`);
      } else if (it.companyLogoData) {
        bits.push("Company logo included");
      }

      const bitsText = bits.length ? " (" + bits.join(", ") + ")" : "";
      return `<li>${card} x${it.qty || 1}${bitsText}</li>`;
    })
    .join("");
  return { linesHtml, attachments };
}

/* Create an order (guest or logged-in). Payment is manual UPI: the buyer
   pays UPI_ID directly and then uploads a screenshot as proof. */
ordersRouter.post("/", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const { items, buyer, address } = parsed.data;

  let amountPaise: number;
  try {
    amountPaise = priceCartPaise(items as OrderItem[]);
  } catch {
    return res.status(400).json({ error: "Invalid item in cart" });
  }
  if (amountPaise <= 0) return res.status(400).json({ error: "Cart total is invalid" });

  const order = await prisma.cardOrder.create({
    data: {
      items: items as any,
      amountPaise,
      currency: "INR",
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      buyerPhone: buyer.phone,
      addressLine1: address.line1,
      addressLine2: address.line2 || null,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country || "India",
      privacyConsent: true,
      status: "PENDING",
    },
  });

  return res.json({ orderId: order.id, amountPaise, currency: "INR", upiId: UPI_ID });
});

/* Buyer uploads a screenshot of the UPI payment. We store it and email it to
   our team (with the order details) so they can cross-verify and confirm. */
ordersRouter.post("/payment-proof", async (req, res) => {
  const parsed = paymentProofSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const { orderId, proofData } = parsed.data;
  if (!parseImageDataUrl(proofData)) {
    return res.status(400).json({ error: "Please upload a valid image file" });
  }

  const order = await prisma.cardOrder.findUnique({ where: { id: orderId } });
  if (!order) return res.status(404).json({ error: "Order not found" });

  const updated = await prisma.cardOrder.update({
    where: { id: orderId },
    data: { paymentProofData: proofData, paymentProofSubmittedAt: new Date() },
  });

  // Fire off emails (do not block the response on delivery).
  void sendOrderEmails(updated).catch((e) => console.error("[order emails]", e));

  return res.json({ ok: true, orderId });
});

async function sendOrderEmails(order: any) {
  const items: any[] = Array.isArray(order.items) ? order.items : [];
  const { linesHtml, attachments } = buildOrderItems(items);
  const address = escapeHtml(
    `${order.addressLine1}${order.addressLine2 ? ", " + order.addressLine2 : ""}, ${order.city}, ${order.state} ${order.pincode}, ${order.country}`
  );
  const buyerName = escapeHtml(order.buyerName);
  const buyerEmail = escapeHtml(order.buyerEmail);
  const buyerPhone = escapeHtml(order.buyerPhone);
  const total = rupees(order.amountPaise);
  const ref = order.id.slice(-8).toUpperCase();

  await sendMail({
    to: order.buyerEmail,
    subject: `We've received your TapAway order (#${ref})`,
    html: `
      <div style="font-family:system-ui,Arial,sans-serif;max-width:520px">
        <h2 style="color:#1e7bb4">Thank you, ${buyerName}!</h2>
        <p>We've received your order and payment screenshot. Our team is verifying the
           payment now and will confirm by email shortly - production starts right after.</p>
        <p><strong>Order:</strong> #${ref}<br/>
           <strong>Total:</strong> ${total}</p>
        <p><strong>Items</strong></p>
        <ul>${linesHtml}</ul>
        <p><strong>Shipping to</strong><br/>${address}</p>
        <p style="color:#667">Estimated delivery: 5 to 10 business days after confirmation.</p>
        <p style="color:#99a">Tap once. Connect instantly. Stay updated forever.<br/>TapAway</p>
      </div>`,
    attachments,
  });

  const proof = parseImageDataUrl(order.paymentProofData || "");
  const proofAttachments = [...attachments];
  if (proof) {
    proofAttachments.push({
      filename: `payment-proof.${MIME_EXT[proof.mime] || "jpg"}`,
      content: proof.base64,
      encoding: "base64",
    });
  }

  await sendMail({
    to: notifyEmail(),
    subject: `New order #${ref} from ${order.buyerName} - verify payment`,
    html: `
      <div style="font-family:system-ui,Arial,sans-serif;max-width:560px">
        <h2>New TapAway order - payment proof attached</h2>
        <p>Order <strong>#${ref}</strong> has been placed for <strong>${buyerName}</strong>.
           Please check the attached payment screenshot against the UPI app for <strong>${UPI_ID}</strong>
           before starting production.</p>
        <p><strong>Deliver to:</strong> ${address}</p>
        <p><strong>Contact:</strong> ${buyerEmail} · ${buyerPhone}</p>
        <p><strong>Total:</strong> ${total}</p>
        <p><strong>Items</strong></p>
        <ul>${linesHtml}</ul>
      </div>`,
    attachments: proofAttachments,
  });
}

import { z } from "zod";

const RESERVED = new Set([
  "api", "u", "login", "signup", "dashboard", "admin", "about",
  "cards", "pricing", "contact", "support", "www", "app", "help",
]);

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be 30 characters or fewer")
  .regex(/^[a-z0-9_.-]+$/, "Use only letters, numbers, dot, dash or underscore")
  .refine((v) => !RESERVED.has(v), "That username is reserved");

export const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  username: usernameSchema,
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Privacy Policy and Terms to continue" }),
  }),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(1).max(80),
  headline: z.string().trim().max(120).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  bio: z.string().trim().max(400).optional().or(z.literal("")),
  avatarUrl: z
    .string()
    .trim()
    .max(2_000_000)
    .refine(
      (v) => v === "" || v.startsWith("data:image/") || /^https?:\/\//i.test(v),
      "Invalid image"
    )
    .optional()
    .or(z.literal("")),
  accent: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/).optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  email: z.string().trim().max(120).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  location: z.string().trim().max(300).optional().or(z.literal("")),
});

export const linkSchema = z.object({
  type: z.enum(["SOCIAL", "CUSTOM"]),
  platform: z.string().trim().max(40).optional().or(z.literal("")),
  label: z.string().trim().min(1, "Label required").max(60),
  url: z.string().trim().min(1, "URL required").max(400),
  active: z.boolean().default(true),
});

export const linksPayloadSchema = z.object({
  links: z.array(linkSchema).max(50),
});

// Only accept actual image data URLs - rejects arbitrary file types
// masquerading as an uploaded "logo" or "payment screenshot".
const imageDataUrl = /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i;

export const orderItemSchema = z.object({
  cardType: z.enum(["classic", "business", "custom"]),
  // business tier: printed on the card
  printName: z.string().trim().max(80).optional().or(z.literal("")),
  printDesignation: z.string().trim().max(120).optional().or(z.literal("")),
  // business tier: uploaded company logo (compressed data URL), size-capped
  companyLogoData: z
    .string()
    .max(2_000_000)
    .refine((v) => v === "" || imageDataUrl.test(v), "Logo must be an image file")
    .optional()
    .or(z.literal("")),
  // custom tier: brief for our design team
  customNotes: z.string().trim().max(1000).optional().or(z.literal("")),
  qty: z.number().int().min(1).max(50).default(1),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Your cart is empty").max(20),
  buyer: z.object({
    name: z.string().trim().min(1, "Name is required").max(80),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    phone: z.string().trim().min(6, "Enter a valid phone number").max(20),
  }),
  address: z.object({
    line1: z.string().trim().min(1, "Address is required").max(160),
    line2: z.string().trim().max(160).optional().or(z.literal("")),
    city: z.string().trim().min(1, "City is required").max(80),
    state: z.string().trim().min(1, "State is required").max(80),
    pincode: z.string().trim().min(4, "Enter a valid PIN code").max(12),
    country: z.string().trim().max(60).default("India"),
  }),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please accept the Terms and Privacy Policy" }),
  }),
});

// Manual UPI flow: buyer uploads a screenshot of the payment as proof, and
// our team cross-verifies it against the UPI app before confirming.
export const paymentProofSchema = z.object({
  orderId: z.string().trim().min(1),
  proofData: z
    .string()
    .min(1, "Please upload your payment screenshot")
    .max(6_000_000)
    .refine((v) => imageDataUrl.test(v), "Please upload a valid image file"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
});

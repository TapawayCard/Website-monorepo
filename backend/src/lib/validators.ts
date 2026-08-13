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
  avatarUrl: z.string().trim().url().optional().or(z.literal("")),
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

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
});

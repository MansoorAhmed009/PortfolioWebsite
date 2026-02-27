import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(3)
  .max(96)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case.");

const isoDateSchema = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid ISO date string.");

const portableTextBlockSchema = z.record(z.string(), z.unknown());

export const postCreateSchema = z.object({
  title: z.string().trim().min(8).max(120),
  slug: slugSchema,
  excerpt: z.string().trim().min(40).max(220),
  tags: z.array(z.string().trim().min(1)).default([]),
  websiteUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  publishedAt: isoDateSchema,
  body: z.array(portableTextBlockSchema).default([]),
  coverImage: z.record(z.string(), z.unknown()).optional()
});

export const postUpdateSchema = postCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required for update."
});

export const projectCreateSchema = z.object({
  title: z.string().trim().min(6).max(100),
  slug: slugSchema,
  summary: z.string().trim().min(30).max(240),
  problem: z.string().trim().min(50),
  impact: z.string().trim().max(400).optional(),
  techStack: z.array(z.string().trim().min(1)).min(2),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  publishedAt: isoDateSchema,
  coverImage: z.record(z.string(), z.unknown()).optional()
});

export const projectUpdateSchema = projectCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required for update."
});

export const adminQuickLinkSchema = z.object({
  title: z.string().trim().min(3).max(80),
  description: z.string().trim().min(10).max(220),
  href: z.string().trim().min(1),
  isExternal: z.boolean().default(true),
  category: z.enum(["content", "comments", "contacts", "analytics", "operations"]).optional(),
  order: z.number().int().min(0).max(999).optional(),
  enabled: z.boolean().default(true)
});

export const adminQuickLinksUpdateSchema = z.object({
  quickLinks: z.array(adminQuickLinkSchema).min(1)
});

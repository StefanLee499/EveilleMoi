import { z } from "zod";
import {
  ARTICLE_CATEGORIES,
  PRODUCT_CADENCES,
  SERVICE_CATEGORIES,
} from "@/lib/admin-constants";

const trimmed = (label: string, max = 200) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`);

const optionalText = z.string().trim().optional().or(z.literal("").transform(() => undefined));

const positivePrice = z.coerce
  .number()
  .finite("Price must be a number.")
  .min(0, "Price must be a positive number.")
  .transform((n) => Math.round(n));

const lineList = z
  .union([z.array(z.string()), z.string()])
  .transform((v) =>
    Array.isArray(v)
      ? v.map((s) => String(s).trim()).filter(Boolean)
      : v.split(/\n+/).map((s) => s.trim()).filter(Boolean)
  );

const paragraphList = z
  .union([z.array(z.string()), z.string()])
  .transform((v) =>
    Array.isArray(v)
      ? v.map((s) => String(s).trim()).filter(Boolean)
      : v.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
  )
  .pipe(z.array(z.string().min(1)).min(1, "Body is required."));

/* -------- Articles -------- */

export const articleCreateSchema = z.object({
  title: trimmed("Title", 200),
  excerpt: trimmed("Excerpt", 400),
  category: z.enum(ARTICLE_CATEGORIES, { message: "Invalid category." }),
  body: paragraphList,
  date: z.string().trim().optional().or(z.literal("").transform(() => undefined)),
  slug: z.string().trim().optional().or(z.literal("").transform(() => undefined)),
  read: z.string().optional().default(""),
  published: z.boolean().optional().default(true),
});

export const articleUpdateSchema = z.object({
  title: trimmed("Title", 200).optional(),
  excerpt: trimmed("Excerpt", 400).optional(),
  category: z.enum(ARTICLE_CATEGORIES).optional(),
  body: paragraphList.optional(),
  date: z.string().optional(),
  read: z.string().optional(),
  published: z.boolean().optional(),
});

/* -------- Services -------- */

export const serviceCreateSchema = z.object({
  name: trimmed("Name", 200),
  category: z.enum(SERVICE_CATEGORIES, { message: "Invalid category." }),
  duration: trimmed("Duration", 60),
  price: positivePrice,
  blurb: trimmed("Tagline", 300),
  description: optionalText,
  details: lineList.optional().default([]),
  published: z.boolean().optional().default(true),
});

export const serviceUpdateSchema = z.object({
  name: trimmed("Name", 200).optional(),
  category: z.enum(SERVICE_CATEGORIES).optional(),
  duration: trimmed("Duration", 60).optional(),
  price: positivePrice.optional(),
  blurb: trimmed("Tagline", 300).optional(),
  description: z.string().optional(),
  details: lineList.optional(),
  published: z.boolean().optional(),
});

/* -------- Products -------- */

export const productCreateSchema = z.object({
  name: trimmed("Name", 200),
  tagline: trimmed("Tagline", 300),
  description: trimmed("Description", 2000),
  price: positivePrice,
  cadence: z.enum(PRODUCT_CADENCES, { message: "Invalid cadence." }),
  contents: lineList.optional().default([]),
  badge: optionalText,
  published: z.boolean().optional().default(true),
});

export const productUpdateSchema = z.object({
  name: trimmed("Name", 200).optional(),
  tagline: trimmed("Tagline", 300).optional(),
  description: trimmed("Description", 2000).optional(),
  price: positivePrice.optional(),
  cadence: z.enum(PRODUCT_CADENCES).optional(),
  contents: lineList.optional(),
  badge: z.string().optional(),
  published: z.boolean().optional(),
});

/* -------- Helper: format zod issues into API error response -------- */

export type ApiFieldError = {
  error: string;
  fields: string[];
  issues: { path: string; message: string }[];
};

export function formatZodError(err: z.ZodError): ApiFieldError {
  const issues = err.issues.map((i) => ({
    path: i.path.join(".") || "_",
    message: i.message,
  }));
  const fields = Array.from(new Set(issues.map((i) => i.path).filter((p) => p !== "_")));
  const summary =
    issues.length === 1
      ? issues[0].message
      : `${issues.length} fields need attention: ${fields.join(", ")}.`;
  return { error: summary, fields, issues };
}

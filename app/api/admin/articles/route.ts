import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";
import { articleCreateSchema } from "@/lib/admin-schemas";
import { parseBody } from "@/lib/api-helpers";
import { createArticle, getArticles } from "@/lib/store";

export async function GET() {
  const g = requireAdmin();
  if (g.error) return g.error;
  return NextResponse.json({ articles: await getArticles() });
}

export async function POST(req: Request) {
  const g = requireAdmin();
  if (g.error) return g.error;
  const parsed = await parseBody(req, articleCreateSchema);
  if (parsed.error) return parsed.error;
  const { title, excerpt, category, date, body, slug, read, published } = parsed.data;
  const article = await createArticle({
    title,
    excerpt,
    category,
    date: date ?? new Date().toISOString().slice(0, 10),
    body,
    slug,
    read: read ?? "",
    published,
  });
  return NextResponse.json({ ok: true, article });
}

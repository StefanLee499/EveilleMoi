import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";
import { articleUpdateSchema } from "@/lib/admin-schemas";
import { parseBody } from "@/lib/api-helpers";
import { deleteArticle, updateArticle } from "@/lib/store";

export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  const g = requireAdmin();
  if (g.error) return g.error;
  const parsed = await parseBody(req, articleUpdateSchema);
  if (parsed.error) return parsed.error;
  const updated = await updateArticle(params.slug, parsed.data);
  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, article: updated });
}

export async function DELETE(_: Request, { params }: { params: { slug: string } }) {
  const g = requireAdmin();
  if (g.error) return g.error;
  const ok = await deleteArticle(params.slug);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

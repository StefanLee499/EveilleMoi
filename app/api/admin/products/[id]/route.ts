import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";
import { productUpdateSchema } from "@/lib/admin-schemas";
import { parseBody } from "@/lib/api-helpers";
import { deleteProduct, updateProduct } from "@/lib/store";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = requireAdmin();
  if (g.error) return g.error;
  const parsed = await parseBody(req, productUpdateSchema);
  if (parsed.error) return parsed.error;
  const updated = await updateProduct(params.id, parsed.data);
  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, product: updated });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const g = requireAdmin();
  if (g.error) return g.error;
  const ok = await deleteProduct(params.id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

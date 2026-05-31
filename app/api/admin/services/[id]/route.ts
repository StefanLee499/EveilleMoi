import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";
import { serviceUpdateSchema } from "@/lib/admin-schemas";
import { parseBody } from "@/lib/api-helpers";
import { deleteService, updateService } from "@/lib/store";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = requireAdmin();
  if (g.error) return g.error;
  const parsed = await parseBody(req, serviceUpdateSchema);
  if (parsed.error) return parsed.error;
  const updated = await updateService(params.id, parsed.data);
  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, service: updated });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const g = requireAdmin();
  if (g.error) return g.error;
  const ok = await deleteService(params.id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

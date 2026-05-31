import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";
import { serviceCreateSchema } from "@/lib/admin-schemas";
import { parseBody } from "@/lib/api-helpers";
import { createService, getServices } from "@/lib/store";

export async function GET() {
  const g = requireAdmin();
  if (g.error) return g.error;
  return NextResponse.json({ services: await getServices() });
}

export async function POST(req: Request) {
  const g = requireAdmin();
  if (g.error) return g.error;
  const parsed = await parseBody(req, serviceCreateSchema);
  if (parsed.error) return parsed.error;
  const service = await createService({
    name: parsed.data.name,
    category: parsed.data.category,
    duration: parsed.data.duration,
    price: parsed.data.price,
    blurb: parsed.data.blurb,
    description: parsed.data.description ?? "",
    details: parsed.data.details,
    published: parsed.data.published,
  });
  return NextResponse.json({ ok: true, service });
}

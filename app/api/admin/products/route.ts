import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";
import { productCreateSchema } from "@/lib/admin-schemas";
import { parseBody } from "@/lib/api-helpers";
import { createProduct, getProducts } from "@/lib/store";

export async function GET() {
  const g = requireAdmin();
  if (g.error) return g.error;
  return NextResponse.json({ products: await getProducts() });
}

export async function POST(req: Request) {
  const g = requireAdmin();
  if (g.error) return g.error;
  const parsed = await parseBody(req, productCreateSchema);
  if (parsed.error) return parsed.error;
  const product = await createProduct({
    name: parsed.data.name,
    tagline: parsed.data.tagline,
    description: parsed.data.description,
    price: parsed.data.price,
    cadence: parsed.data.cadence,
    contents: parsed.data.contents,
    badge: parsed.data.badge,
    published: parsed.data.published,
  });
  return NextResponse.json({ ok: true, product });
}

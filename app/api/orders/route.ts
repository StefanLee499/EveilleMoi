import { NextResponse } from "next/server";
import { append } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total } = body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }
    const rec = await append("orders.json", { items, total: Number(total) || 0 });
    return NextResponse.json({ ok: true, id: rec.id });
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}

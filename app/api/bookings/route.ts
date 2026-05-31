import { NextResponse } from "next/server";
import { append } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serviceId, name, email, phone, date, time, notes } = body || {};
    if (!serviceId || !name || !email || !date || !time) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    const rec = await append("bookings.json", {
      serviceId, name, email, phone: phone ?? "", date, time, notes: notes ?? "",
    });
    return NextResponse.json({ ok: true, id: rec.id });
  } catch (e) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}

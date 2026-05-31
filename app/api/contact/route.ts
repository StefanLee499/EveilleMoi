import { NextResponse } from "next/server";
import { append } from "@/lib/storage";

export async function POST(req: Request) {
  let payload: any = {};
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    payload = await req.json().catch(() => ({}));
  } else {
    const fd = await req.formData();
    payload = Object.fromEntries(fd.entries());
  }
  const { email, name, message, kind } = payload;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email))) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }
  const rec = await append("contacts.json", {
    kind: kind || "contact",
    name: name || "",
    email: String(email),
    message: message || "",
  });
  if (!ct.includes("application/json")) {
    return NextResponse.redirect(new URL("/contact?sent=1", req.url));
  }
  return NextResponse.json({ ok: true, id: rec.id });
}

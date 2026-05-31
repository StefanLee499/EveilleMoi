import { NextResponse } from "next/server";
import crypto from "crypto";
import { append } from "@/lib/storage";

export const runtime = "nodejs";

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => p.trim().split("=") as [string, string])
  );
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${t}.${rawBody}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const secret = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  const raw = await req.text();

  if (secret) {
    const ok = verifySignature(raw, req.headers.get("calendly-webhook-signature"), secret);
    if (!ok) return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }

  const event = payload?.event as string | undefined;
  const p = payload?.payload ?? {};

  if (event === "invitee.created" || event === "invitee.canceled") {
    const start: string | undefined = p?.scheduled_event?.start_time;
    const startDate = start ? new Date(start) : null;
    await append("bookings.json", {
      source: "calendly",
      event,
      calendlyEventUri: p?.scheduled_event?.uri ?? null,
      calendlyInviteeUri: p?.uri ?? null,
      name: p?.name ?? "",
      email: p?.email ?? "",
      phone: p?.text_reminder_number ?? "",
      eventName: p?.scheduled_event?.name ?? "",
      date: startDate ? startDate.toISOString().slice(0, 10) : "",
      time: startDate ? startDate.toISOString().slice(11, 16) : "",
      notes: Array.isArray(p?.questions_and_answers)
        ? p.questions_and_answers.map((q: any) => `${q.question}: ${q.answer}`).join("\n")
        : "",
      cancelReason: p?.cancellation?.reason ?? null,
    });
  }

  return NextResponse.json({ ok: true });
}

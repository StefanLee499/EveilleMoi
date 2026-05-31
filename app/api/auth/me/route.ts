import { NextResponse } from "next/server";
import { currentSession } from "@/lib/auth";
import { findUserById, publicUser, updateUser, updatePassword } from "@/lib/store";
import { verifyPassword } from "@/lib/auth";

export async function GET() {
  const sess = currentSession();
  if (!sess) return NextResponse.json({ user: null });
  const u = await findUserById(sess.uid);
  return NextResponse.json({ user: u ? publicUser(u) : null });
}

export async function PATCH(req: Request) {
  const sess = currentSession();
  if (!sess) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const body = await req.json();
  const { name, phone, birthDate, preferences, currentPassword, newPassword } = body || {};

  if (newPassword) {
    const me = await findUserById(sess.uid);
    if (!me) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (!currentPassword || !verifyPassword(String(currentPassword), me.passwordHash)) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    if (String(newPassword).length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }
    await updatePassword(sess.uid, String(newPassword));
  }

  const patch: any = {};
  if (typeof name === "string") patch.name = name;
  if (typeof phone === "string") patch.phone = phone;
  if (typeof birthDate === "string") patch.birthDate = birthDate;
  if (preferences && typeof preferences === "object") {
    patch.preferences = {
      newsletter: !!preferences.newsletter,
      moonReminders: !!preferences.moonReminders,
    };
  }

  const updated = await updateUser(sess.uid, patch);
  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, user: publicUser(updated) });
}

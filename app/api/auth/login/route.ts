import { NextResponse } from "next/server";
import { findUserByEmail, publicUser } from "@/lib/store";
import { makeToken, setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }
    const user = await findUserByEmail(String(email));
    if (!user || !verifyPassword(String(password), user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    setSessionCookie(makeToken({ uid: user.id, role: user.role }));
    return NextResponse.json({ ok: true, user: publicUser(user) });
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}

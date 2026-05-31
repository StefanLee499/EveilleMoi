import { NextResponse } from "next/server";
import { createUser, publicUser } from "@/lib/store";
import { makeToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    if (String(password).length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    const user = await createUser({ email, password, name });
    setSessionCookie(makeToken({ uid: user.id, role: user.role }));
    return NextResponse.json({ ok: true, user: publicUser(user) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Could not register." }, { status: 400 });
  }
}

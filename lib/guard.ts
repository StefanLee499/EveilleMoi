import { NextResponse } from "next/server";
import { currentSession } from "@/lib/auth";

export function requireAdmin() {
  const sess = currentSession();
  if (!sess) return { error: NextResponse.json({ error: "Not authenticated." }, { status: 401 }) };
  if (sess.role !== "admin") return { error: NextResponse.json({ error: "Forbidden." }, { status: 403 }) };
  return { sess };
}

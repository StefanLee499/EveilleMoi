import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE = "eveillemoi_session";
const SECRET =
  process.env.AUTH_SECRET ||
  "dev-secret-change-me-in-production-please-use-a-real-32byte-secret";

export type Role = "customer" | "admin";

export type SessionPayload = {
  uid: string;
  role: Role;
  exp: number; // unix seconds
};

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `s1$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [scheme, saltHex, hashHex] = stored.split("$");
    if (scheme !== "s1") return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = crypto.scryptSync(password, salt, 64);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function makeToken(payload: Omit<SessionPayload, "exp">, ttlSeconds = 60 * 60 * 24 * 30): string {
  const body: SessionPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const b64 = Buffer.from(JSON.stringify(body)).toString("base64url");
  const sig = sign(b64);
  return `${b64}.${sig}`;
}

export function readToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  if (sign(b64) !== sig) return null;
  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE, "", { path: "/", maxAge: 0 });
}

export function currentSession(): SessionPayload | null {
  const token = cookies().get(COOKIE)?.value;
  return readToken(token);
}

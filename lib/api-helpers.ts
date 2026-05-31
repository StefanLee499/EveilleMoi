import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { formatZodError } from "@/lib/admin-schemas";

/** Authorize, parse JSON body, validate with schema; return parsed data or NextResponse error. */
export async function parseBody<T>(
  req: Request,
  schema: { parse: (v: unknown) => T }
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return {
      data: null,
      error: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }),
    };
  }
  try {
    const data = schema.parse(raw);
    return { data, error: null };
  } catch (e) {
    if (e instanceof ZodError) {
      return { data: null, error: NextResponse.json(formatZodError(e), { status: 400 }) };
    }
    return {
      data: null,
      error: NextResponse.json({ error: "Invalid request." }, { status: 400 }),
    };
  }
}

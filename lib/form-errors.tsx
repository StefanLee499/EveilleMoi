"use client";

/** Read structured field errors from a validation API response (zod-shaped). */
export async function parseApiError(
  res: Response
): Promise<{ message: string; fieldErrors: Record<string, string> }> {
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON */
  }
  const message = body?.error || `Request failed (${res.status}).`;
  const fieldErrors: Record<string, string> = {};
  if (Array.isArray(body?.issues)) {
    for (const i of body.issues) {
      if (i?.path && !fieldErrors[i.path]) fieldErrors[i.path] = i.message;
    }
  }
  return { message, fieldErrors };
}

/** Tailwind helpers to mark an input invalid. */
export const invalidInputClass = "border-terracotta-500 focus:border-terracotta-500 focus:ring-terracotta-500/30";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-terracotta-700" role="alert">
      {message}
    </p>
  );
}

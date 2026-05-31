"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useId, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import { useT } from "@/lib/i18n-client";
import { FieldError, invalidInputClass, parseApiError } from "@/lib/form-errors";

function LoginInner() {
  const t = useT();
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp?.get("next") || "/account";
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const emailId = useId();
  const passwordId = useId();
  const formStatusId = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setFieldErrors({});
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const parsed = await parseApiError(res);
        setFieldErrors(parsed.fieldErrors);
        throw new Error(parsed.message || "Could not sign in.");
      }
      const data = await res.json();
      await refresh();
      router.push(data.user?.role === "admin" ? "/admin" : next);
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-x grid min-h-[80vh] place-items-center py-20">
      <div className="card w-full max-w-md p-8 md:p-10">
        <p className="chip mb-5">{t("login.chip")}</p>
        <h1 className="h-display text-4xl">{t("login.title")}</h1>
        <p className="mt-2 text-sm text-ink-soft">{t("login.sub")}</p>

        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <fieldset disabled={loading} className="contents">
            <div>
              <label className="label" htmlFor={emailId}>{t("login.field.email")}</label>
              <input
                id={emailId}
                type="email"
                required
                className={`input ${fieldErrors.email ? invalidInputClass : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? `${emailId}-err` : undefined}
              />
              <FieldError id={`${emailId}-err`} message={fieldErrors.email} />
            </div>
            <div>
              <label className="label" htmlFor={passwordId}>{t("login.field.password")}</label>
              <input
                id={passwordId}
                type="password"
                required
                className={`input ${fieldErrors.password ? invalidInputClass : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? `${passwordId}-err` : undefined}
              />
              <FieldError id={`${passwordId}-err`} message={fieldErrors.password} />
            </div>
            <p
              id={formStatusId}
              role={err ? "alert" : undefined}
              aria-live="polite"
              className={`min-h-[1.25rem] text-sm ${err ? "text-terracotta-700" : "sr-only"}`}
            >
              {err}
            </p>
            <button
              className="btn-primary w-full"
              disabled={loading}
              aria-busy={loading}
              aria-describedby={formStatusId}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : t("login.cta")}
            </button>
          </fieldset>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          {t("login.newHere")}{" "}
          <Link href="/register" className="text-ink underline">
            {t("login.create")}
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-x py-32" />}>
      <LoginInner />
    </Suspense>
  );
}

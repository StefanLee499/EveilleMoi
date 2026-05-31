"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import { useT } from "@/lib/i18n-client";
import { FieldError, invalidInputClass, parseApiError } from "@/lib/form-errors";

export default function RegisterPage() {
  const t = useT();
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const pwId = useId();
  const pwHintId = useId();
  const statusId = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setFieldErrors({});
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const parsed = await parseApiError(res);
        setFieldErrors(parsed.fieldErrors);
        throw new Error(parsed.message || "Could not register.");
      }
      await refresh();
      router.push("/account");
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
        <p className="chip mb-5">{t("register.chip")}</p>
        <h1 className="h-display text-4xl">{t("register.title")}</h1>
        <p className="mt-2 text-sm text-ink-soft">{t("register.sub")}</p>

        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <fieldset disabled={loading} className="contents">
            <div>
              <label className="label" htmlFor={nameId}>{t("register.field.name")}</label>
              <input
                id={nameId}
                required
                className={`input ${fieldErrors.name ? invalidInputClass : ""}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? `${nameId}-err` : undefined}
              />
              <FieldError id={`${nameId}-err`} message={fieldErrors.name} />
            </div>
            <div>
              <label className="label" htmlFor={emailId}>{t("register.field.email")}</label>
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
              <label className="label" htmlFor={pwId}>{t("register.field.password")}</label>
              <input
                id={pwId}
                type="password"
                required
                minLength={8}
                className={`input ${fieldErrors.password ? invalidInputClass : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={`${pwHintId} ${fieldErrors.password ? `${pwId}-err` : ""}`.trim()}
              />
              <p id={pwHintId} className="mt-1 text-xs text-ink-mute">{t("register.pwHint")}</p>
              <FieldError id={`${pwId}-err`} message={fieldErrors.password} />
            </div>
            <p
              id={statusId}
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
              aria-describedby={statusId}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : t("register.cta")}
            </button>
          </fieldset>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          {t("register.have")}{" "}
          <Link href="/login" className="text-ink underline">
            {t("register.signIn")}
          </Link>
        </p>
      </div>
    </section>
  );
}

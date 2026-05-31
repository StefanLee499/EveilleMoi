"use client";

import { useId, useState } from "react";
import { Loader2, Mail, MapPin, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { motion } from "framer-motion";
import type { Service } from "@/lib/content";
import { useT } from "@/lib/i18n-client";
import { FieldError, invalidInputClass, parseApiError } from "@/lib/form-errors";

export default function ContactClient({ services, calendlyUrl }: { services: Service[]; calendlyUrl: string }) {
  const t = useT();
  const sp = useSearchParams();
  const initialService = sp?.get("service") || undefined;
  const selectedService = services.find((s) => s.id === initialService);
  const sent = sp?.get("sent");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    sent ? "done" : "idle"
  );
  const [err, setErr] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const nameId = useId();
  const emailId = useId();
  const kindId = useId();
  const messageId = useId();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setFieldErrors({});
    setErr("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const parsed = await parseApiError(res);
        setFieldErrors(parsed.fieldErrors);
        throw new Error(parsed.message || "Something went wrong.");
      }
      setStatus("done");
      form.reset();
    } catch (e: any) {
      setErr(e.message);
      setStatus("error");
    }
  }

  return (
    <>
      <section className="container-x pt-20 pb-12 md:pt-28">
        <p className="chip mb-6">{t("contact.chip")}</p>
        <h1 className="h-display text-5xl md:text-7xl">
          {t("contact.title1")} <span className="italic text-terracotta-700">{t("contact.title2")}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">{t("contact.lead")}</p>
      </section>

      <section className="container-x pb-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4 md:col-span-1">
            <div className="card p-6">
              <Mail className="h-5 w-5 text-sage-700" />
              <p className="mt-3 font-serif text-xl">{t("contact.email")}</p>
              <a href="mailto:hello@eveillemoi.com" className="text-ink-soft hover:underline">
                hello@eveillemoi.com
              </a>
            </div>
            <div className="card p-6">
              <MapPin className="h-5 w-5 text-sage-700" />
              <p className="mt-3 font-serif text-xl">{t("contact.studio")}</p>
              <p className="text-ink-soft whitespace-pre-line">{t("contact.studioAddress")}</p>
              <p className="mt-2 text-xs text-ink-mute">{t("contact.byAppt")}</p>
            </div>
            <div className="card p-6">
              <p className="font-serif text-xl">{t("contact.hours")}</p>
              <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                <li className="flex justify-between"><span>{t("contact.hours.weekdays")}</span><span>10:00 – 19:00</span></li>
                <li className="flex justify-between"><span>{t("contact.hours.saturday")}</span><span>10:00 – 16:00</span></li>
                <li className="flex justify-between"><span>{t("contact.hours.sunmon")}</span><span>{t("contact.hours.rest")}</span></li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <form onSubmit={submit} className="card p-6 md:p-10" noValidate>
              <h3 className="font-serif text-2xl">{t("contact.writeTitle")}</h3>
              <p className="mt-1 text-sm text-ink-soft">{t("contact.writeBody")}</p>

              <fieldset disabled={status === "sending"} className="contents">
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="label" htmlFor={nameId}>{t("contact.field.name")}</label>
                    <input
                      id={nameId}
                      name="name"
                      required
                      className={`input ${fieldErrors.name ? invalidInputClass : ""}`}
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? `${nameId}-err` : undefined}
                    />
                    <FieldError id={`${nameId}-err`} message={fieldErrors.name} />
                  </div>
                  <div>
                    <label className="label" htmlFor={emailId}>{t("contact.field.email")}</label>
                    <input
                      id={emailId}
                      name="email"
                      type="email"
                      required
                      className={`input ${fieldErrors.email ? invalidInputClass : ""}`}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? `${emailId}-err` : undefined}
                    />
                    <FieldError id={`${emailId}-err`} message={fieldErrors.email} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label" htmlFor={kindId}>{t("contact.field.kind")}</label>
                    <select id={kindId} name="kind" className="input" defaultValue="general">
                      <option value="general">{t("contact.kind.general")}</option>
                      <option value="massage">{t("contact.kind.massage")}</option>
                      <option value="astrology">{t("contact.kind.astrology")}</option>
                      <option value="box">{t("contact.kind.box")}</option>
                      <option value="press">{t("contact.kind.press")}</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="label" htmlFor={messageId}>{t("contact.field.message")}</label>
                    <textarea
                      id={messageId}
                      name="message"
                      required
                      className={`input min-h-[140px] ${fieldErrors.message ? invalidInputClass : ""}`}
                      aria-invalid={!!fieldErrors.message}
                      aria-describedby={fieldErrors.message ? `${messageId}-err` : undefined}
                    />
                    <FieldError id={`${messageId}-err`} message={fieldErrors.message} />
                  </div>
                </div>

                {status === "done" ? (
                  <motion.p
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 rounded-2xl bg-sage-100 px-4 py-3 text-sm text-sage-900"
                  >
                    ✓ {t("contact.thanks")}
                  </motion.p>
                ) : (
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p
                      role={status === "error" ? "alert" : undefined}
                      aria-live="polite"
                      className={`text-sm ${status === "error" ? "text-terracotta-700" : "text-ink-mute text-xs"}`}
                    >
                      {status === "error" ? err : t("contact.noSpam")}
                    </p>
                    <button
                      className="btn-primary"
                      disabled={status === "sending"}
                      aria-busy={status === "sending"}
                    >
                      {status === "sending" ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <>
                          {t("common.send")} <Send className="h-4 w-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </fieldset>
            </form>
          </div>
        </div>
      </section>

      <section id="booking" className="container-x scroll-mt-24 pb-24">
        <div className="mb-10">
          <p className="chip mb-4">{t("contact.bookingChip")}</p>
          <h2 className="h-display text-4xl md:text-5xl">{t("contact.bookingTitle")}</h2>
          <p className="mt-3 max-w-xl text-ink-soft">{t("contact.bookingLead")}</p>
        </div>
        {calendlyUrl ? (
          <CalendlyEmbed
            url={calendlyUrl}
            prefill={selectedService ? { customAnswers: { a1: selectedService.name } } : undefined}
            utm={selectedService ? { utmContent: selectedService.id } : undefined}
          />
        ) : (
          <div className="card p-8 text-sm text-ink-soft">
            Calendly is not configured. Set <code>NEXT_PUBLIC_CALENDLY_URL</code> in <code>.env</code>.
          </div>
        )}
      </section>
    </>
  );
}

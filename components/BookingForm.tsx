"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { Service } from "@/lib/content";
import { useT } from "@/lib/i18n-client";
import { FieldError, invalidInputClass, parseApiError } from "@/lib/form-errors";

const times = ["09:30", "11:00", "13:30", "15:00", "16:30", "18:00"];

export default function BookingForm({
  services,
  initialService,
}: {
  services: Service[];
  initialService?: string;
}) {
  const t = useT();
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(initialService || services[0]?.id || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const dateId = useId();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const notesId = useId();
  const statusId = useId();

  const service = services.find((s) => s.id === serviceId)!;
  const today = new Date().toISOString().split("T")[0];

  function next() {
    if (step === 1 && !serviceId) return;
    if (step === 2 && (!date || !time)) return;
    setStep((s) => Math.min(3, s + 1));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    setFieldErrors({});
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, name, email, phone, date, time, notes }),
      });
      if (!res.ok) {
        const parsed = await parseApiError(res);
        setFieldErrors(parsed.fieldErrors);
        throw new Error(parsed.message || "Something went wrong.");
      }
      const data = await res.json();
      setReference(data.id);
      setStatus("done");
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-10 text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage-100 text-sage-700">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="mt-5 font-serif text-3xl">{t("booking.done.title")}</h3>
        <p className="mt-2 text-ink-soft">
          {t("booking.done.body1")} <code className="text-ink">#{reference}</code> {t("booking.done.bodyFor")}{" "}
          <strong>{service.name}</strong> {t("booking.done.bodyOn")} <strong>{date}</strong> {t("booking.done.bodyAt")}{" "}
          <strong>{time}</strong> {t("booking.done.bodyReceived")}
        </p>
        <p className="mt-2 text-sm text-ink-mute">{t("booking.done.sub")}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 md:p-10" noValidate>
      <fieldset disabled={status === "sending"} className="contents">
      <div className="mb-8 flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span
              className={`grid h-8 w-8 place-items-center rounded-full text-xs font-medium transition ${
                step >= n ? "bg-ink text-cream" : "bg-ink/10 text-ink-mute"
              }`}
            >
              {n}
            </span>
            {n < 3 && <span className={`h-px flex-1 ${step > n ? "bg-ink" : "bg-ink/10"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
          >
            <h3 className="font-serif text-2xl">{t("booking.step1.title")}</h3>
            <p className="mt-1 text-sm text-ink-soft">{t("booking.step1.sub")}</p>
            <div className="mt-6 grid gap-3">
              {services.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                    serviceId === s.id
                      ? "border-ink bg-ink/[0.03]"
                      : "border-ink/15 bg-white/60 hover:border-ink/40"
                  }`}
                >
                  <div>
                    <p className="font-serif text-lg">{s.name}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-ink-mute">
                      {t(`cat.${s.category}`)} · {s.duration}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-xl">€{s.price}</span>
                    <input
                      type="radio"
                      name="service"
                      value={s.id}
                      checked={serviceId === s.id}
                      onChange={() => setServiceId(s.id)}
                      className="h-4 w-4 accent-ink"
                    />
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
          >
            <h3 className="font-serif text-2xl">{t("booking.step2.title")}</h3>
            <p className="mt-1 text-sm text-ink-soft">{t("booking.step2.sub")}</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="label" htmlFor={dateId}>{t("booking.step2.date")}</label>
                <input
                  id={dateId}
                  type="date"
                  className={`input ${fieldErrors.date ? invalidInputClass : ""}`}
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  aria-invalid={!!fieldErrors.date}
                  aria-describedby={fieldErrors.date ? `${dateId}-err` : undefined}
                />
                <FieldError id={`${dateId}-err`} message={fieldErrors.date} />
              </div>
              <div>
                <span className="label" id={`${dateId}-time-label`}>{t("booking.step2.time")}</span>
                <div
                  role="radiogroup"
                  aria-labelledby={`${dateId}-time-label`}
                  aria-invalid={!!fieldErrors.time}
                  className="grid grid-cols-3 gap-2"
                >
                  {times.map((tm) => (
                    <button
                      type="button"
                      key={tm}
                      role="radio"
                      aria-checked={time === tm}
                      onClick={() => setTime(tm)}
                      className={`rounded-xl border px-3 py-2 text-sm transition ${
                        time === tm
                          ? "border-ink bg-ink text-cream"
                          : "border-ink/15 bg-white/60 hover:border-ink/40"
                      }`}
                    >
                      {tm}
                    </button>
                  ))}
                </div>
                <FieldError id={`${dateId}-time-err`} message={fieldErrors.time} />
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
          >
            <h3 className="font-serif text-2xl">{t("booking.step3.title")}</h3>
            <p className="mt-1 text-sm text-ink-soft">
              {service.name} · {date} · {time}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="label" htmlFor={nameId}>{t("booking.step3.name")}</label>
                <input
                  id={nameId}
                  className={`input ${fieldErrors.name ? invalidInputClass : ""}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? `${nameId}-err` : undefined}
                />
                <FieldError id={`${nameId}-err`} message={fieldErrors.name} />
              </div>
              <div>
                <label className="label" htmlFor={emailId}>{t("booking.step3.email")}</label>
                <input
                  id={emailId}
                  type="email"
                  className={`input ${fieldErrors.email ? invalidInputClass : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? `${emailId}-err` : undefined}
                />
                <FieldError id={`${emailId}-err`} message={fieldErrors.email} />
              </div>
              <div className="md:col-span-2">
                <label className="label" htmlFor={phoneId}>{t("booking.step3.phone")}</label>
                <input
                  id={phoneId}
                  className={`input ${fieldErrors.phone ? invalidInputClass : ""}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby={fieldErrors.phone ? `${phoneId}-err` : undefined}
                />
                <FieldError id={`${phoneId}-err`} message={fieldErrors.phone} />
              </div>
              <div className="md:col-span-2">
                <label className="label" htmlFor={notesId}>{t("booking.step3.notes")}</label>
                <textarea
                  id={notesId}
                  className="input min-h-[110px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("booking.step3.notesPlaceholder")}
                />
              </div>
            </div>
            <p
              id={statusId}
              role={error ? "alert" : undefined}
              aria-live="polite"
              className={`mt-4 min-h-[1.25rem] text-sm ${error ? "text-terracotta-700" : "sr-only"}`}
            >
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className={`btn-ghost ${step === 1 ? "invisible" : ""}`}
        >
          {t("common.back")}
        </button>
        {step < 3 ? (
          <button type="button" onClick={next} className="btn-primary">
            {t("common.continue")}
          </button>
        ) : (
          <button
            type="submit"
            className="btn-primary"
            disabled={status === "sending"}
            aria-busy={status === "sending"}
            aria-describedby={statusId}
          >
            {status === "sending" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              t("booking.confirm")
            )}
          </button>
        )}
      </div>
      </fieldset>
    </form>
  );
}

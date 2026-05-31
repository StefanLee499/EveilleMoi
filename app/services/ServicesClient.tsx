"use client";

import Link from "next/link";
import { Check, Clock, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Motion";
import type { Service } from "@/lib/content";
import { useT } from "@/lib/i18n-client";

export default function ServicesClient({ services }: { services: Service[] }) {
  const t = useT();
  const massages = services.filter((s) => s.category === "Massage");
  const astrology = services.filter((s) => s.category === "Astrology");

  const steps: [string, string][] = [
    [t("services.how.1.t"), t("services.how.1.d")],
    [t("services.how.2.t"), t("services.how.2.d")],
    [t("services.how.3.t"), t("services.how.3.d")],
    [t("services.how.4.t"), t("services.how.4.d")],
  ];
  const faqs: [string, string][] = [
    [t("services.faq.1.q"), t("services.faq.1.a")],
    [t("services.faq.2.q"), t("services.faq.2.a")],
    [t("services.faq.3.q"), t("services.faq.3.a")],
    [t("services.faq.4.q"), t("services.faq.4.a")],
  ];

  return (
    <>
      <section className="container-x pt-20 pb-12 md:pt-28">
        <p className="chip mb-6">{t("services.chip")}</p>
        <h1 className="h-display text-5xl md:text-7xl">
          {t("services.title1")} <span className="italic text-sage-700">{t("services.title2")}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">{t("services.lead")}</p>
      </section>

      <section id="massage" className="container-x scroll-mt-24 py-16">
        <div className="mb-10 flex items-center gap-4">
          <span className="h-px flex-1 bg-ink/15" />
          <h2 className="h-display text-3xl md:text-4xl">{t("cat.Massage")}</h2>
          <span className="h-px flex-1 bg-ink/15" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {massages.map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} accent="terracotta" />
          ))}
        </div>
      </section>

      <section id="astrology" className="container-x scroll-mt-24 py-16">
        <div className="mb-10 flex items-center gap-4">
          <span className="h-px flex-1 bg-ink/15" />
          <h2 className="h-display text-3xl md:text-4xl">{t("cat.Astrology")}</h2>
          <span className="h-px flex-1 bg-ink/15" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {astrology.map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} accent="sage" />
          ))}
        </div>
      </section>

      <section className="container-x py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="chip mb-4">{t("services.howChip")}</p>
            <h2 className="h-display text-4xl">{t("services.howTitle")}</h2>
            <ol className="mt-8 space-y-6">
              {steps.map(([title, desc], i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-cream font-serif">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-serif text-2xl">{title}</p>
                    <p className="text-ink-soft">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="chip mb-4">{t("services.faqChip")}</p>
            <h2 className="h-display text-4xl">{t("services.faqTitle")}</h2>
            <div className="mt-8 space-y-3">
              {faqs.map(([q, a], i) => (
                <details key={i} className="group rounded-2xl bg-white/70 p-5 shadow-soft ring-1 ring-ink/5">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-lg">
                    {q}
                    <span className="text-2xl text-ink-mute transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-ink-soft">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="rounded-3xl bg-sage-900 p-10 text-cream md:p-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <Sparkles className="h-7 w-7" />
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t("services.ready")}</h2>
              <p className="mt-4 text-cream/80">{t("services.readyBody")}</p>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <Link href="/contact#booking" className="btn-secondary w-full md:w-fit">
                {t("services.openBooking")}
              </Link>
              <Link href="/contact" className="text-sm text-cream/70 underline">
                {t("services.orNote")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceCard({
  s,
  i,
  accent,
}: {
  s: Service;
  i: number;
  accent: "sage" | "terracotta";
}) {
  const t = useT();
  const accentBg = accent === "sage" ? "bg-sage-100" : "bg-terracotta-300/30";
  const accentText = accent === "sage" ? "text-sage-700" : "text-terracotta-700";
  return (
    <Reveal delay={i * 0.08}>
      <article className="card flex h-full flex-col overflow-hidden p-7 transition hover:-translate-y-1">
        <div className={`mb-5 flex items-center justify-between rounded-2xl ${accentBg} px-4 py-2`}>
          <span className={`text-xs uppercase tracking-[0.2em] ${accentText}`}>{t(`cat.${s.category}`)}</span>
          <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
            <Clock className="h-3 w-3" /> {s.duration}
          </span>
        </div>
        <h3 className="font-serif text-2xl">{s.name}</h3>
        <p className="mt-2 text-sm text-ink-soft">{s.blurb}</p>
        {s.description && (
          <p className="mt-3 text-sm leading-relaxed text-ink-soft/90">{s.description}</p>
        )}
        <ul className="mt-5 space-y-2 text-sm">
          {s.details.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-sage-700" /> <span>{d}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between pt-6">
          <p className="font-serif text-3xl">€{s.price}</p>
          <Link href={`/contact?service=${s.id}#booking`} className="btn-primary">
            {t("common.book")}
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

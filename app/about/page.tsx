"use client";

import Link from "next/link";
import { Reveal } from "@/components/Motion";
import { HandIllustration, LeafIllustration } from "@/components/Illustrations";
import { useT } from "@/lib/i18n-client";

export default function AboutPage() {
  const t = useT();
  const values: [string, string][] = [
    [t("about.values.1.t"), t("about.values.1.d")],
    [t("about.values.2.t"), t("about.values.2.d")],
    [t("about.values.3.t"), t("about.values.3.d")],
    [t("about.values.4.t"), t("about.values.4.d")],
  ];
  return (
    <>
      <section className="container-x pt-20 pb-16 md:pt-28">
        <div className="grid items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="chip mb-6">{t("about.chip")}</p>
            <h1 className="h-display text-5xl md:text-7xl">
              {t("about.title1")} <span className="italic text-sage-700">{t("about.title2")}</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft">{t("about.lead")}</p>
          </div>
          <div className="md:col-span-5">
            <div className="card relative aspect-[4/5] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta-300/40 via-sand to-sage-100" />
              <HandIllustration className="absolute inset-0 m-auto h-64" />
              <p className="absolute bottom-4 left-4 right-4 rounded-2xl bg-cream/80 px-4 py-3 text-center text-sm text-ink-soft backdrop-blur">
                {t("about.portraitCaption")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="divider mb-20" />
        <div className="grid gap-16 md:grid-cols-2">
          <Reveal>
            <h2 className="h-display text-3xl md:text-4xl">{t("about.storyTitle")}</h2>
            <div className="mt-6 space-y-5 text-ink-soft">
              <p>{t("about.story.p1")}</p>
              <p>{t("about.story.p2")}</p>
              <p>{t("about.story.p3")}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="h-display text-3xl md:text-4xl">{t("about.valuesTitle")}</h2>
            <ul className="mt-6 space-y-5">
              {values.map(([title, desc]) => (
                <li key={title} className="rounded-2xl bg-white/60 p-5 shadow-soft ring-1 ring-ink/5">
                  <p className="font-serif text-2xl">{title}</p>
                  <p className="mt-1 text-ink-soft">{desc}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-sage-900 text-cream">
        <div className="container-x relative py-24 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <LeafIllustration className="mx-auto h-72 text-cream md:h-96" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cream/60">{t("about.why")}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">
                {t("about.whyTitle1")}{" "}
                <em className="text-terracotta-300">{t("about.whyTitle2")}</em>
                {t("about.whyTitle3")}
              </h2>
              <p className="mt-5 max-w-lg text-cream/80">{t("about.whyBody")}</p>
              <div className="mt-8 flex gap-3">
                <Link href="/services" className="btn-secondary">{t("about.cta.services")}</Link>
                <Link href="/contact" className="btn-ghost border-cream/30 text-cream hover:bg-cream hover:text-ink">{t("about.cta.hello")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

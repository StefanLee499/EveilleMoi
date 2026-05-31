"use client";

import { Check, Quote, Sparkles } from "lucide-react";
import type { Product } from "@/lib/content";
import { useCart } from "@/lib/cart-store";
import { Reveal } from "@/components/Motion";
import { LeafIllustration } from "@/components/Illustrations";
import { useT } from "@/lib/i18n-client";

export default function ShopClient({ products }: { products: Product[] }) {
  const add = useCart((s) => s.add);
  const t = useT();

  const steps: [string, string][] = [
    [t("shop.how.1.t"), t("shop.how.1.d")],
    [t("shop.how.2.t"), t("shop.how.2.d")],
    [t("shop.how.3.t"), t("shop.how.3.d")],
    [t("shop.how.4.t"), t("shop.how.4.d")],
  ];
  const testimonials: [string, string][] = [
    [t("shop.t.1.text"), t("shop.t.1.by")],
    [t("shop.t.2.text"), t("shop.t.2.by")],
    [t("shop.t.3.text"), t("shop.t.3.by")],
  ];

  const unitKey = (cadence: string) =>
    cadence === "Monthly" ? "cadence.month" : cadence === "Quarterly" ? "cadence.quarter" : "cadence.oneoff";

  return (
    <>
      <section className="container-x pt-20 pb-12 md:pt-28">
        <p className="chip mb-6">{t("shop.chip")}</p>
        <h1 className="h-display text-5xl md:text-7xl">
          {t("shop.title1")} <span className="italic text-terracotta-700">{t("shop.title2")}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">{t("shop.lead")}</p>
      </section>

      <section className="container-x py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <article className="card relative flex h-full flex-col overflow-hidden p-7">
                {p.badge && (
                  <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-terracotta-500 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-cream">
                    <Sparkles className="h-3 w-3" /> {p.badge}
                  </span>
                )}
                <div className="mb-6 grid aspect-[4/3] place-items-center rounded-2xl bg-gradient-to-br from-sand via-cream to-sage-100">
                  <LeafIllustration className="h-32" />
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-ink-mute">{t(`cadence.${p.cadence}`)}</span>
                <h3 className="mt-2 font-serif text-3xl">{p.name}</h3>
                <p className="mt-1 italic text-ink-soft">{p.tagline}</p>
                <p className="mt-3 text-sm text-ink-soft">{p.description}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.contents.map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-sage-700" /> {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-end justify-between pt-6">
                  <p className="font-serif text-3xl">
                    €{p.price}
                    <span className="ml-1 text-sm text-ink-mute">/ {t(unitKey(p.cadence))}</span>
                  </p>
                  <button
                    onClick={() =>
                      add({ id: p.id, name: p.name, price: p.price, cadence: p.cadence })
                    }
                    className="btn-primary"
                  >
                    {t("shop.addToBox")}
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="chip mb-4">{t("shop.howChip")}</p>
            <h2 className="h-display text-4xl">{t("shop.howTitle")}</h2>
            <ol className="mt-8 space-y-5">
              {steps.map(([title, desc], i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-terracotta-500 text-cream">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-serif text-xl">{title}</p>
                    <p className="text-ink-soft">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="chip mb-4">{t("shop.kindChip")}</p>
            <h2 className="h-display text-4xl">{t("shop.kindTitle")}</h2>
            <div className="mt-8 space-y-4">
              {testimonials.map(([text, by]) => (
                <figure key={by} className="rounded-2xl bg-white/70 p-6 shadow-soft ring-1 ring-ink/5">
                  <Quote className="h-5 w-5 text-terracotta-500" />
                  <blockquote className="mt-3 font-serif text-xl italic">&ldquo;{text}&rdquo;</blockquote>
                  <figcaption className="mt-3 text-sm text-ink-mute">— {by}</figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

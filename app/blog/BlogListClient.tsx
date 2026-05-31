"use client";

import Link from "next/link";
import { Reveal } from "@/components/Motion";
import { useT } from "@/lib/i18n-client";
import type { Article } from "@/lib/content";

const categories = ["All", "Wellness", "Astrology", "Lifestyle", "Reflections"] as const;

export default function BlogListClient({
  articles,
  active,
}: {
  articles: Article[];
  active: (typeof categories)[number];
}) {
  const t = useT();
  const list = active === "All" ? articles : articles.filter((a) => a.category === active);

  return (
    <>
      <section className="container-x pt-20 pb-12 md:pt-28">
        <p className="chip mb-6">{t("blog.chip")}</p>
        <h1 className="h-display text-5xl md:text-7xl">
          {t("blog.title1")} <span className="italic text-sage-700">{t("blog.title2")}</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">{t("blog.lead")}</p>

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              href={c === "All" ? "/blog" : `/blog?c=${c}`}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.18em] transition ${
                active === c
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/15 bg-white/70 text-ink-soft hover:text-ink"
              }`}
            >
              {t(`cat.${c}`)}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {list.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.08}>
              <Link href={`/blog/${a.slug}`} className="card group block overflow-hidden">
                <div className="relative aspect-[5/3] overflow-hidden bg-gradient-to-br from-sage-100 via-sand to-terracotta-300/40">
                  <div className="absolute inset-0 grid place-items-center font-serif text-7xl italic text-ink/15">
                    {a.category[0]}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-ink-mute">
                    <span>{t(`cat.${a.category}`)}</span>
                    <span>
                      {new Date(a.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl group-hover:text-sage-700 transition-colors">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">{a.excerpt}</p>
                  <p className="mt-4 text-xs text-ink-mute">
                    {a.read} {t("common.minRead")}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

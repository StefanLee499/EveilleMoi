"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Article } from "@/lib/content";
import { useT } from "@/lib/i18n-client";

export default function ArticleClient({
  article,
  related,
}: {
  article: Article;
  related: Article[];
}) {
  const t = useT();
  const a = article;
  return (
    <article className="container-x pt-20 pb-24 md:pt-28">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> {t("blog.back")}
      </Link>

      <header className="mt-8 max-w-3xl">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-ink-mute">
          <span>{t(`cat.${a.category}`)}</span>
          <span>·</span>
          <span>
            {new Date(a.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>·</span>
          <span>{a.read}</span>
        </div>
        <h1 className="h-display mt-4 text-4xl md:text-6xl">{a.title}</h1>
        <p className="mt-5 text-lg italic text-ink-soft">{a.excerpt}</p>
      </header>

      <div className="my-12 aspect-[5/2] w-full rounded-3xl bg-gradient-to-br from-sage-100 via-sand to-terracotta-300/40" />

      <div className="prose mx-auto max-w-2xl space-y-6 font-serif text-xl leading-relaxed text-ink-soft">
        {a.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="divider my-16" />

      <div>
        <h3 className="font-serif text-2xl">{t("blog.keepReading")}</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {related.map((r) => (
            <Link key={r.slug} href={`/blog/${r.slug}`} className="card group block p-6">
              <span className="text-xs uppercase tracking-[0.2em] text-ink-mute">{t(`cat.${r.category}`)}</span>
              <p className="mt-2 font-serif text-2xl group-hover:text-sage-700">{r.title}</p>
              <p className="mt-2 text-sm text-ink-soft">{r.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

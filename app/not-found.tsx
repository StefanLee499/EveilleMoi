"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n-client";

export default function NotFound() {
  const t = useT();
  return (
    <section className="container-x grid min-h-[70vh] place-items-center text-center">
      <div>
        <p className="font-serif text-8xl italic text-sage-700">{t("nf.404")}</p>
        <h1 className="h-display mt-4 text-4xl">{t("nf.title")}</h1>
        <p className="mt-3 text-ink-soft">{t("nf.body")}</p>
        <Link href="/" className="btn-primary mt-6">{t("nf.home")}</Link>
      </div>
    </section>
  );
}

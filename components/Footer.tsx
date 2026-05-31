"use client";

import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useT } from "@/lib/i18n-client";

export default function Footer() {
  const t = useT();
  return (
    <footer className="relative z-[2] mt-32 border-t border-ink/10 bg-sage-50/60">
      <div className="container-x grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <Logo className="h-9 w-9 text-ink" />
            <span className="font-serif text-2xl text-ink">EveilleMoi</span>
          </div>
          <p className="mt-4 max-w-md text-ink-soft">{t("footer.about")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink/15 bg-white/70 p-2.5 text-ink-soft transition hover:bg-ink hover:text-cream"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@eveillemoi.com"
              className="rounded-full border border-ink/15 bg-white/70 p-2.5 text-ink-soft transition hover:bg-ink hover:text-cream"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
            <LanguageSwitcher />
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-ink-soft">{t("footer.explore")}</h4>
          <ul className="mt-4 space-y-2 text-ink">
            <li><Link href="/about" className="hover:underline">{t("nav.about")}</Link></li>
            <li><Link href="/services" className="hover:underline">{t("nav.services")}</Link></li>
            <li><Link href="/shop" className="hover:underline">{t("nav.shop")}</Link></li>
            <li><Link href="/blog" className="hover:underline">{t("nav.journal")}</Link></li>
            <li><Link href="/contact" className="hover:underline">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-ink-soft">{t("footer.letter")}</h4>
          <p className="mt-4 text-ink-soft">{t("footer.letterCopy")}</p>
          <form className="mt-4 flex gap-2" action="/api/contact" method="post">
            <input type="email" name="email" placeholder="you@calm.co" required className="input" />
            <input type="hidden" name="kind" value="newsletter" />
            <button className="btn-primary">{t("footer.join")}</button>
          </form>
        </div>
      </div>
      <div className="container-x flex flex-col items-center justify-between gap-3 border-t border-ink/10 py-6 text-xs text-ink-mute md:flex-row">
        <p>© {new Date().getFullYear()} EveilleMoi — {t("footer.rights")}</p>
        <p>Crafted with Next.js · Tailwind · Framer Motion</p>
      </div>
    </footer>
  );
}

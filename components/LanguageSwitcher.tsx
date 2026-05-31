"use client";

import { useRouter } from "next/navigation";
import { LOCALES } from "@/lib/i18n";
import { useLocaleStore } from "@/lib/i18n-client";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  return (
    <div
      className={`inline-flex items-center rounded-full border border-ink/15 bg-white/70 p-0.5 text-[11px] uppercase tracking-[0.18em] ${className}`}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map(({ code, label }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => {
              setLocale(code);
              router.refresh();
            }}
            className={`rounded-full px-2.5 py-1 transition ${
              active ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
            }`}
            aria-pressed={active}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

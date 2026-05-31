"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LOCALE, LOCALES, type Locale, tr } from "./i18n";

export const LOCALE_COOKIE = "em_locale";

function writeCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  // 1 year, lax, path=/
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && LOCALES.some((l) => l.code === v);
}

type State = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

export const useLocaleStore = create<State>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => {
        writeCookie(locale);
        set({ locale });
      },
    }),
    { name: "eveillemoi_locale" }
  )
);

export function useT() {
  const locale = useLocaleStore((s) => s.locale);
  return (key: string) => tr(locale, key);
}

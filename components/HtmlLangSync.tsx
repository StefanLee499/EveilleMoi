"use client";

import { useEffect } from "react";
import { useLocaleStore } from "@/lib/i18n-client";

/**
 * Keeps the <html lang> attribute in sync with the active locale on the client.
 * Server-rendered HTML uses a sensible default; this hook updates it after
 * hydration when the persisted store value differs.
 */
export default function HtmlLangSync() {
  const locale = useLocaleStore((s) => s.locale);
  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}

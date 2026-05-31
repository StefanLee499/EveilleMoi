"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocaleStore } from "@/lib/i18n-client";

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const STYLE_HREF = "https://assets.calendly.com/assets/external/widget.css";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget?: (o: { url: string; parentElement: HTMLElement }) => void;
      initInlineWidgets?: () => void;
    };
  }
}

function ensureAssets(onReady: () => void) {
  if (typeof document === "undefined") return;
  if (!document.querySelector(`link[href="${STYLE_HREF}"]`)) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = STYLE_HREF;
    document.head.appendChild(l);
  }
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    if (window.Calendly) onReady();
    else existing.addEventListener("load", onReady);
    return;
  }
  const s = document.createElement("script");
  s.src = SCRIPT_SRC;
  s.async = true;
  s.onload = onReady;
  document.head.appendChild(s);
}

export default function CalendlyEmbed({
  url,
  prefill,
  utm,
}: {
  url: string;
  prefill?: { name?: string; email?: string; customAnswers?: Record<string, string> };
  utm?: { utmContent?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; utmTerm?: string };
}) {
  const [mounted, setMounted] = useState(false);
  const locale = useLocaleStore((s) => s.locale);

  const dataUrl = useMemo(() => {
    if (!url) return "";
    const u = new URL(url);
    u.searchParams.set("locale", locale);
    if (prefill?.name) u.searchParams.set("name", prefill.name);
    if (prefill?.email) u.searchParams.set("email", prefill.email);
    if (prefill?.customAnswers) {
      for (const [k, v] of Object.entries(prefill.customAnswers)) {
        u.searchParams.set(k, v);
      }
    }
    if (utm?.utmContent) u.searchParams.set("utm_content", utm.utmContent);
    if (utm?.utmSource) u.searchParams.set("utm_source", utm.utmSource);
    if (utm?.utmMedium) u.searchParams.set("utm_medium", utm.utmMedium);
    if (utm?.utmCampaign) u.searchParams.set("utm_campaign", utm.utmCampaign);
    if (utm?.utmTerm) u.searchParams.set("utm_term", utm.utmTerm);
    return u.toString();
  }, [url, locale, prefill, utm]);

  useEffect(() => {
    ensureAssets(() => {
      window.Calendly?.initInlineWidgets?.();
    });
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && window.Calendly?.initInlineWidgets) {
      window.Calendly.initInlineWidgets();
    }
  }, [mounted, dataUrl]);

  if (!url) {
    return (
      <div className="card p-8 text-sm text-ink-soft">
        Calendly URL missing. Set <code>NEXT_PUBLIC_CALENDLY_URL</code> in <code>.env</code>.
      </div>
    );
  }

  if (!mounted) {
    return (
      <div
        className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5"
        style={{ minWidth: 320, height: 720 }}
      />
    );
  }

  return (
    <div
      key={dataUrl}
      className="calendly-inline-widget overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5"
      data-url={dataUrl}
      style={{ minWidth: 320, height: 720 }}
    />
  );
}

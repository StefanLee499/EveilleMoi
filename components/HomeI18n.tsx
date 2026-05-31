"use client";

import { useT } from "@/lib/i18n-client";
import { FadeWord } from "./Motion";

export function T({ k }: { k: string }) {
  const t = useT();
  return <>{t(k)}</>;
}

export function FadeWordT({ k, className = "" }: { k: string; className?: string }) {
  const t = useT();
  return <FadeWord text={t(k)} className={className} />;
}

export function TCategory({ value }: { value: string }) {
  const t = useT();
  return <>{t(`cat.${value}`)}</>;
}

export function TCadence({ value }: { value: string }) {
  const t = useT();
  return <>{t(`cadence.${value}`)}</>;
}

export function TCadenceUnit({ cadence }: { cadence: string }) {
  const t = useT();
  const key =
    cadence === "Monthly" ? "cadence.month" : cadence === "Quarterly" ? "cadence.quarter" : "cadence.oneoff";
  return <>{t(key)}</>;
}

export function MarqueeStrip() {
  const t = useT();
  const items = [t("marquee.1"), t("marquee.2"), t("marquee.3"), t("marquee.4"), t("marquee.5")];
  return (
    <div className="marquee relative overflow-hidden border-y border-ink/10 bg-sage-50/60 py-4">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-serif text-2xl text-ink-soft">
        {Array.from({ length: 2 }).map((_, k) => (
          <div key={k} className="flex shrink-0 items-center gap-12 px-6">
            {items.map((label, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-12">
                <span className="italic">{label}</span>
                <span className="text-terracotta-500">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroChip() {
  const t = useT();
  return <>{t("home.chip")}</>;
}

export function HeroLead() {
  const t = useT();
  return <>{t("home.lead")}</>;
}

export function HeroCtaServices() {
  const t = useT();
  return <>{t("home.cta.services")}</>;
}

export function HeroCtaShop() {
  const t = useT();
  return <>{t("home.cta.shop")}</>;
}

export function HeroLoved() {
  const t = useT();
  return <>{t("home.loved")}</>;
}

import Link from "next/link";
import { ArrowRight, Heart, Moon, Sparkles } from "lucide-react";
import { FadeWord, Parallax, Reveal } from "@/components/Motion";
import { HandIllustration, LeafIllustration, MoonIllustration, StarsField } from "@/components/Illustrations";
import { getPublishedArticles, getPublishedProducts } from "@/lib/store";
import {
  FadeWordT,
  HeroChip,
  HeroCtaServices,
  HeroCtaShop,
  HeroLead,
  HeroLoved,
  MarqueeStrip,
  T,
  TCategory,
  TCadence,
  TCadenceUnit,
} from "@/components/HomeI18n";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [articles, products] = await Promise.all([getPublishedArticles(), getPublishedProducts()]);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <StarsField className="absolute inset-0 h-full w-full opacity-40" />
          <div className="absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-sage-100/60 blur-3xl" />
          <div className="absolute -left-24 bottom-10 h-[420px] w-[420px] rounded-full bg-terracotta-300/30 blur-3xl" />
        </div>

        <div className="container-x relative grid items-center gap-12 pt-16 pb-24 md:grid-cols-2 md:pt-24 md:pb-32">
          <div>
            <div className="chip mb-6">
              <Sparkles className="h-3 w-3" /> <HeroChip />
            </div>
            <h1 className="h-display text-5xl md:text-7xl">
              <FadeWordT k="home.title1" />
              <span className="block italic text-sage-700">
                <FadeWordT k="home.title2" />
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              <HeroLead />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="btn-primary">
                <HeroCtaServices /> <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/shop" className="btn-ghost">
                <HeroCtaShop />
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm text-ink-mute">
              <div className="flex -space-x-2">
                {["#A8B89A", "#E2A58A", "#56654A"].map((c) => (
                  <span
                    key={c}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-cream text-cream"
                    style={{ background: c }}
                  >
                    <Heart className="h-4 w-4" />
                  </span>
                ))}
              </div>
              <span><HeroLoved /></span>
            </div>
          </div>

          <div className="relative">
            <Parallax amount={30}>
              <MoonIllustration className="mx-auto h-[420px] w-[420px] animate-float" />
            </Parallax>
            <LeafIllustration className="absolute -left-6 bottom-0 hidden h-56 md:block" />
            <HandIllustration className="absolute -right-6 -top-4 hidden h-40 md:block" />
          </div>
        </div>

        {/* marquee */}
        <MarqueeStrip />
      </section>

      {/* THREE PILLARS */}
      <section className="container-x py-24 md:py-32">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="chip mb-4"><T k="home.pillars.chip" /></p>
            <h2 className="h-display text-4xl md:text-5xl"><T k="home.pillars.title" /></h2>
          </div>
          <Link href="/services" className="hidden text-sm text-ink-soft hover:text-ink md:inline-flex">
            <T k="common.allServices" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: <HandIllustration className="h-28" />, tagK: "home.pillars.body.tag", titleK: "home.pillars.body.title", textK: "home.pillars.body.text", href: "/services#massage", color: "bg-terracotta-300/30" },
            { icon: <MoonIllustration className="h-28" />, tagK: "home.pillars.stars.tag", titleK: "home.pillars.stars.title", textK: "home.pillars.stars.text", href: "/services#astrology", color: "bg-sage-100" },
            { icon: <LeafIllustration className="h-28" />, tagK: "home.pillars.home.tag", titleK: "home.pillars.home.title", textK: "home.pillars.home.text", href: "/shop", color: "bg-sand" },
          ].map((p, i) => (
            <Reveal key={p.titleK} delay={i * 0.1}>
              <Link href={p.href} className="card group block overflow-hidden p-8 transition hover:-translate-y-1">
                <div className={`mb-6 grid h-40 place-items-center rounded-2xl ${p.color}`}>{p.icon}</div>
                <span className="text-xs uppercase tracking-[0.2em] text-ink-mute"><T k={p.tagK} /></span>
                <h3 className="mt-2 font-serif text-3xl"><T k={p.titleK} /></h3>
                <p className="mt-3 text-ink-soft"><T k={p.textK} /></p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-ink group-hover:gap-3 transition-all">
                  <T k="common.learnMore" /> <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section className="relative overflow-hidden bg-sage-900 text-cream">
        <StarsField className="absolute inset-0 h-full w-full opacity-30 text-cream" />
        <div className="container-x relative py-24 text-center md:py-32">
          <Moon className="mx-auto h-8 w-8 opacity-60" />
          <Reveal>
            <p className="mx-auto mt-6 max-w-3xl font-serif text-3xl italic leading-snug md:text-5xl">
              <T k="home.quote" />
            </p>
          </Reveal>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-cream/60">— EveilleMoi</p>
        </div>
      </section>

      {/* BOX TEASER */}
      <section className="container-x py-24 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-sage-100 to-terracotta-300/40 blur-2xl" />
            <div className="card aspect-[4/5] overflow-hidden p-10">
              <div className="flex h-full flex-col justify-between rounded-2xl bg-sand p-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-terracotta-700"><T k="home.box.label" /></p>
                  <h3 className="mt-3 font-serif text-4xl"><T k="home.box.boxName" /></h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square rounded-xl bg-cream/70 ring-1 ring-ink/10" />
                  ))}
                </div>
                <p className="text-sm text-ink-soft"><T k="home.box.caption" /></p>
              </div>
            </div>
          </Reveal>

          <div>
            <p className="chip mb-4"><T k="home.box.chip" /></p>
            <h2 className="h-display text-4xl md:text-5xl"><T k="home.box.title" /></h2>
            <p className="mt-5 text-lg text-ink-soft">
              <T k="home.box.lead" />
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {products[0].contents.map((c) => (
                <div key={c} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-terracotta-500" />
                  {c}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-secondary"><T k="home.box.cta.subscribe" /></Link>
              <Link href="/about" className="btn-ghost"><T k="home.box.cta.story" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST JOURNAL */}
      <section className="container-x pb-24 md:pb-32">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="chip mb-4"><T k="home.journal.chip" /></p>
            <h2 className="h-display text-4xl md:text-5xl"><T k="home.journal.title" /></h2>
          </div>
          <Link href="/blog" className="text-sm text-ink-soft hover:text-ink"><T k="common.allArticles" /></Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.1}>
              <Link href={`/blog/${a.slug}`} className="card group block overflow-hidden">
                <div className="relative aspect-[5/3] overflow-hidden bg-gradient-to-br from-sage-100 via-sand to-terracotta-300/40">
                  <div className="absolute inset-0 grid place-items-center font-serif text-6xl italic text-ink/20">
                    {a.category[0]}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-ink-mute">
                    <span><TCategory value={a.category} /></span>
                    <span>{a.read}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl group-hover:text-sage-700 transition-colors">{a.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{a.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

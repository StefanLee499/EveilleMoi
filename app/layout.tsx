import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AuthHydrator from "@/components/AuthHydrator";
import HtmlLangSync from "@/components/HtmlLangSync";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

const siteUrl = "https://eveillemoi.com";

export const metadata: Metadata = {
  title: "EveilleMoi — Massage, Astrology & Monthly Ritual Box",
  description:
    "EveilleMoi is a holistic well-being brand. Slow massage, warm astrology and a curated monthly ritual box.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: Object.fromEntries(LOCALES.map((l) => [l.code, `/?lang=${l.code}`])),
  },
  openGraph: {
    title: "EveilleMoi",
    description: "Massage, Astrology & a monthly ritual box.",
    type: "website",
    locale: DEFAULT_LOCALE,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body className="grain bg-cream text-ink">
        <HtmlLangSync />
        <AuthHydrator />
        <Nav />
        <main className="relative z-[2] min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}

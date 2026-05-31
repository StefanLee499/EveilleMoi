"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, Settings, Shield, ShoppingBag, User as UserIcon, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-client";
import { useT } from "@/lib/i18n-client";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

const nav = [
  { href: "/", key: "nav.home" },
  { href: "/about", key: "nav.about" },
  { href: "/services", key: "nav.services" },
  { href: "/shop", key: "nav.shop" },
  { href: "/blog", key: "nav.journal" },
  { href: "/contact", key: "nav.contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const count = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const { user, loaded, logout } = useAuth();
  const t = useT();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => setUserMenu(false), [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenu(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/80 backdrop-blur-md shadow-[0_1px_0_rgba(31,36,33,0.06)]" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <Link href="/" aria-label="EveilleMoi home" className="flex items-center gap-2">
          <Logo className="h-9 w-9 text-ink" />
          <span className="font-serif text-xl tracking-wide text-ink">EveilleMoi</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`group relative px-4 py-2 text-sm transition-colors ${
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {t(n.key)}
                <span
                  className={`pointer-events-none absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100 ${
                    active ? "scale-x-100" : ""
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden md:inline-flex" />
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative rounded-full border border-ink/15 bg-white/70 p-2.5 text-ink transition hover:bg-ink hover:text-cream"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-terracotta-500 text-[10px] font-medium text-cream">
                {count}
              </span>
            )}
          </button>

          {loaded && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenu((v) => !v)}
                className="hidden items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-3 py-1.5 text-sm text-ink transition hover:bg-ink hover:text-cream md:inline-flex"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-sage-100 text-[10px] font-medium uppercase text-sage-900">
                  {user.name.slice(0, 1)}
                </span>
                <span>{user.name.split(" ")[0]}</span>
                {user.role === "admin" && (
                  <span className="rounded-full bg-terracotta-500 px-2 py-0.5 text-[9px] uppercase tracking-wider text-cream">
                    Admin
                  </span>
                )}
              </button>
              {userMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-soft">
                  <div className="border-b border-ink/10 px-4 py-3">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-ink-mute">{user.email}</p>
                  </div>
                  <Link href="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-ink/5">
                    <Settings className="h-4 w-4" /> {t("common.mySettings")}
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-ink/5">
                      <Shield className="h-4 w-4" /> {t("common.adminPanel")}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-ink/10 px-4 py-2.5 text-sm text-terracotta-700 hover:bg-terracotta-500/10"
                  >
                    <LogOut className="h-4 w-4" /> {t("common.signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-3 py-1.5 text-sm text-ink-soft transition hover:bg-ink hover:text-cream md:inline-flex"
            >
              <UserIcon className="h-4 w-4" /> {t("common.signIn")}
            </Link>
          )}

          <Link href="/contact#booking" className="btn-primary hidden md:inline-flex">
            {t("common.book")}
          </Link>
          <button
            className="md:hidden rounded-full border border-ink/15 bg-white/70 p-2.5"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink/10 bg-cream/95 backdrop-blur">
          <div className="container-x flex flex-col py-4">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="py-2 text-base text-ink-soft hover:text-ink"
              >
                {t(n.key)}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <LanguageSwitcher className="self-start" />
              {loaded && user ? (
                <>
                  <Link href="/account" className="btn-ghost">{t("common.mySettings")}</Link>
                  {user.role === "admin" && <Link href="/admin" className="btn-ghost">{t("common.adminPanel")}</Link>}
                  <button onClick={handleLogout} className="btn-ghost text-terracotta-700">{t("common.signOut")}</button>
                </>
              ) : (
                <Link href="/login" className="btn-ghost">{t("common.signIn")}</Link>
              )}
              <Link href="/contact#booking" className="btn-primary">{t("common.bookSession")}</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

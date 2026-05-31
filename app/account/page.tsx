"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import { useT } from "@/lib/i18n-client";

export default function AccountPage() {
  const router = useRouter();
  const { user, loaded, setUser } = useAuth();
  const t = useT();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [moonReminders, setMoonReminders] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (loaded && !user) router.replace("/login?next=/account");
  }, [loaded, user, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
      setBirthDate(user.birthDate ?? "");
      setNewsletter(!!user.preferences?.newsletter);
      setMoonReminders(user.preferences?.moonReminders ?? true);
    }
  }, [user]);

  if (!loaded || !user) {
    return (
      <div className="container-x grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-mute" />
      </div>
    );
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          birthDate,
          preferences: { newsletter, moonReminders },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data.user);
      setMsg({ kind: "ok", text: t("account.saved") });
    } catch (e: any) {
      setMsg({ kind: "err", text: e.message });
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCurrentPassword("");
      setNewPassword("");
      setMsg({ kind: "ok", text: t("account.passwordUpdated") });
    } catch (e: any) {
      setMsg({ kind: "err", text: e.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="container-x pt-20 pb-12 md:pt-28">
        <p className="chip mb-6">{t("account.chip")}</p>
        <h1 className="h-display text-5xl md:text-6xl">
          {t("account.helloPrefix")}, <span className="italic text-sage-700">{user.name.split(" ")[0]}</span>.
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">{t("account.lead")}</p>
      </section>

      <section className="container-x grid gap-8 pb-24 md:grid-cols-3">
        <aside className="card h-fit p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-mute">{t("account.signedIn")}</p>
          <p className="mt-2 font-serif text-2xl">{user.name}</p>
          <p className="truncate text-sm text-ink-soft">{user.email}</p>
          <p className="mt-4 inline-flex items-center rounded-full bg-sage-100 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-sage-900">
            {user.role}
          </p>
          {user.role === "admin" && (
            <a href="/admin" className="btn-secondary mt-6 w-full">{t("account.openAdmin")}</a>
          )}
        </aside>

        <div className="space-y-8 md:col-span-2">
          {msg && (
            <p
              className={`rounded-2xl px-4 py-3 text-sm ${
                msg.kind === "ok" ? "bg-sage-100 text-sage-900" : "bg-terracotta-500/10 text-terracotta-700"
              }`}
            >
              {msg.text}
            </p>
          )}

          <form onSubmit={saveProfile} className="card p-8">
            <h2 className="font-serif text-2xl">{t("account.personal")}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">{t("account.field.name")}</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="label">{t("account.field.email")}</label>
                <input className="input bg-ink/5" value={user.email} disabled />
              </div>
              <div>
                <label className="label">{t("account.field.phone")}</label>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="label">{t("account.field.birthDate")}</label>
                <input type="date" className="input" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </div>
            </div>

            <h3 className="mt-8 font-serif text-xl">{t("account.preferences")}</h3>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-3 rounded-2xl bg-white/60 p-4 ring-1 ring-ink/5">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-ink"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                />
                <span>
                  <span className="font-medium">{t("account.pref.newsletter.t")}</span>
                  <span className="block text-xs text-ink-mute">{t("account.pref.newsletter.d")}</span>
                </span>
              </label>
              <label className="flex items-center gap-3 rounded-2xl bg-white/60 p-4 ring-1 ring-ink/5">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-ink"
                  checked={moonReminders}
                  onChange={(e) => setMoonReminders(e.target.checked)}
                />
                <span>
                  <span className="font-medium">{t("account.pref.moon.t")}</span>
                  <span className="block text-xs text-ink-mute">{t("account.pref.moon.d")}</span>
                </span>
              </label>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="btn-primary" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> {t("common.save")}</>}
              </button>
            </div>
          </form>

          <form onSubmit={savePassword} className="card p-8">
            <h2 className="font-serif text-2xl">{t("account.changePassword")}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">{t("account.currentPassword")}</label>
                <input
                  type="password"
                  className="input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <div>
                <label className="label">{t("account.newPassword")}</label>
                <input
                  type="password"
                  className="input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="btn-ghost" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("account.updatePassword")}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

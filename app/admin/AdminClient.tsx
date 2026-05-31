"use client";

import { useCallback, useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Plus, Save } from "lucide-react";
import type { Article, Product, Service } from "@/lib/content";
import {
  ARTICLE_CATEGORIES,
  PRODUCT_CADENCES,
  SERVICE_CATEGORIES,
} from "@/lib/admin-constants";
import { ConfirmProvider } from "@/components/ConfirmDialog";
import { PublishBadge, RowActions } from "@/components/admin/RowActions";
import {
  ListToolbar,
  applyFilter,
  useListFilter,
  type SortOption,
} from "@/components/admin/ListToolbar";
import { FieldError, invalidInputClass, parseApiError } from "@/lib/form-errors";
import { useResourceActions } from "@/lib/useResourceActions";

const TABS = ["journal", "services", "shop"] as const;
type Tab = (typeof TABS)[number];

function parseTab(value: string | null): Tab {
  return (TABS as readonly string[]).includes(value ?? "") ? (value as Tab) : "journal";
}

function EmptyState({
  filtered,
  onClear,
  onCreate,
  emptyLabel,
  createLabel,
}: {
  filtered: boolean;
  onClear: () => void;
  onCreate: () => void;
  emptyLabel: string;
  createLabel: string;
}) {
  return (
    <li className="py-10 text-center">
      <p className="text-sm text-ink-soft">
        {filtered ? "No matches for the current filters." : emptyLabel}
      </p>
      <div className="mt-4 flex justify-center">
        {filtered ? (
          <button type="button" onClick={onClear} className="btn-ghost">
            Clear filters
          </button>
        ) : (
          <button type="button" onClick={onCreate} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" /> {createLabel}
          </button>
        )}
      </div>
    </li>
  );
}

export default function AdminClient({
  services: initialServices,
  products: initialProducts,
  articles: initialArticles,
}: {
  services: Service[];
  products: Product[];
  articles: Article[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = parseTab(searchParams.get("view"));
  const setTab = useCallback(
    (next: Tab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "journal") params.delete("view");
      else params.set("view", next);
      const qs = params.toString();
      router.replace(qs ? `/admin?${qs}` : "/admin", { scroll: false });
    },
    [router, searchParams]
  );

  const [services, setServices] = useState(initialServices);
  const [products, setProducts] = useState(initialProducts);
  const [articles, setArticles] = useState(initialArticles);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function flash(text: string, kind: "ok" | "err" = "ok") {
    setToast({ kind, text });
    setTimeout(() => setToast(null), kind === "err" ? 6000 : 3500);
  }

  const tabPanelId = "admin-tabpanel";

  return (
    <ConfirmProvider>
      <section className="container-x pt-20 pb-8 md:pt-28">
        <p className="chip mb-6">Admin panel</p>
        <h1 className="h-display text-5xl md:text-6xl">The quiet back office.</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Publish, edit, add or remove anything below.
        </p>

        <div
          role="tablist"
          aria-label="Admin sections"
          className="mt-8 inline-flex rounded-full border border-ink/15 bg-white/70 p-1"
        >
          {(
            [
              ["journal", "Journal"],
              ["services", "Services"],
              ["shop", "Shop"],
            ] as [Tab, string][]
          ).map(([k, l]) => {
            const selected = tab === k;
            return (
              <button
                key={k}
                id={`admin-tab-${k}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={tabPanelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(k)}
                className={`rounded-full px-5 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 ${
                  selected ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </section>

      <section
        id={tabPanelId}
        role="tabpanel"
        aria-labelledby={`admin-tab-${tab}`}
        className="container-x pb-24"
      >
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="pointer-events-none fixed right-6 top-24 z-50"
        >
          {toast && (
            <div
              className={`pointer-events-auto rounded-2xl px-4 py-3 text-sm shadow-soft ${
                toast.kind === "ok"
                  ? "bg-sage-900 text-cream"
                  : "bg-terracotta-700 text-cream"
              }`}
            >
              {toast.text}
            </div>
          )}
        </div>

        {tab === "journal" && (
          <JournalTab
            articles={articles}
            setArticles={setArticles}
            flash={flash}
            refresh={() => router.refresh()}
          />
        )}
        {tab === "services" && (
          <ServicesTab
            services={services}
            setServices={setServices}
            flash={flash}
            refresh={() => router.refresh()}
          />
        )}
        {tab === "shop" && (
          <ShopTab
            products={products}
            setProducts={setProducts}
            flash={flash}
            refresh={() => router.refresh()}
          />
        )}
      </section>
    </ConfirmProvider>
  );
}

/* ===================== JOURNAL ===================== */

function JournalTab({
  articles,
  setArticles,
  flash,
  refresh,
}: {
  articles: Article[];
  setArticles: (a: Article[]) => void;
  flash: (m: string, k?: "ok" | "err") => void;
  refresh: () => void;
}) {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<Article["category"]>("Wellness");
  const [body, setBody] = useState("");
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fid = useId();
  const filter = useListFilter("date-desc");
  const sortOptions: SortOption[] = [
    { value: "date-desc", label: "Newest first" },
    { value: "date-asc", label: "Oldest first" },
    { value: "title-asc", label: "Title A–Z" },
  ];
  const visible = applyFilter(articles, filter.state, {
    searchableText: (a) => `${a.title} ${a.excerpt} ${a.category} ${a.slug}`,
    isPublished: (a) => a.published !== false,
    sorters: {
      "date-desc": (a, b) => (b.date || "").localeCompare(a.date || ""),
      "date-asc": (a, b) => (a.date || "").localeCompare(b.date || ""),
      "title-asc": (a, b) => a.title.localeCompare(b.title),
    },
  });
  const { togglePublish, remove } = useResourceActions<Article>({
    endpoint: "/api/admin/articles",
    idOf: (a) => a.slug,
    labelOf: (a) => a.title,
    noun: "Article",
    flash,
    refresh,
    apply: (m) => setArticles(m(articles)),
    responseKey: "article",
  });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFieldErrors({});
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt, category, body, published }),
      });
      if (!res.ok) {
        const { message, fieldErrors } = await parseApiError(res);
        setFieldErrors(fieldErrors);
        flash(message, "err");
        return;
      }
      const data = await res.json();
      setArticles([data.article, ...articles]);
      setTitle(""); setExcerpt(""); setBody(""); setPublished(true); setCreating(false);
      flash(published ? "Article published." : "Draft saved.");
      refresh();
    } catch {
      flash("Network error \u2014 check your connection.", "err");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">Articles</h2>
        <button onClick={() => setCreating((v) => !v)} className="btn-primary">
          <Plus className="h-4 w-4" /> {creating ? "Close" : "New article"}
        </button>
      </div>

      {creating && (
        <form onSubmit={create} className="mt-6 grid gap-4 rounded-2xl bg-sand/60 p-6" aria-label="New article" noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label" htmlFor={`${fid}-title`}>Title</label>
              <input
                id={`${fid}-title`}
                className={`input ${fieldErrors.title ? invalidInputClass : ""}`}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={!!fieldErrors.title}
                aria-describedby={fieldErrors.title ? `${fid}-title-err` : undefined}
              />
              <FieldError id={`${fid}-title-err`} message={fieldErrors.title} />
            </div>
            <div>
              <label className="label" htmlFor={`${fid}-cat`}>Category</label>
              <select
                id={`${fid}-cat`}
                className={`input ${fieldErrors.category ? invalidInputClass : ""}`}
                value={category}
                onChange={(e) => setCategory(e.target.value as Article["category"])}
                aria-invalid={!!fieldErrors.category}
              >
                {ARTICLE_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label" htmlFor={`${fid}-excerpt`}>Excerpt</label>
            <input
              id={`${fid}-excerpt`}
              className={`input ${fieldErrors.excerpt ? invalidInputClass : ""}`}
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              aria-invalid={!!fieldErrors.excerpt}
              aria-describedby={fieldErrors.excerpt ? `${fid}-excerpt-err` : undefined}
            />
            <FieldError id={`${fid}-excerpt-err`} message={fieldErrors.excerpt} />
          </div>
          <div>
            <label className="label" htmlFor={`${fid}-body`}>Body (separate paragraphs with a blank line)</label>
            <textarea
              id={`${fid}-body`}
              className={`input min-h-[180px] font-serif text-base ${fieldErrors.body ? invalidInputClass : ""}`}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              aria-invalid={!!fieldErrors.body}
              aria-describedby={fieldErrors.body ? `${fid}-body-err` : undefined}
            />
            <FieldError id={`${fid}-body-err`} message={fieldErrors.body} />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              className="h-4 w-4 accent-ink"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish immediately
          </label>
          <div className="flex justify-end">
            <button className="btn-primary" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : published ? "Publish" : "Save draft"}
            </button>
          </div>
        </form>
      )}

      <ListToolbar
        state={filter.state}
        onQ={filter.setQ}
        onSort={filter.setSort}
        onStatus={filter.setStatus}
        sortOptions={sortOptions}
        searchPlaceholder="Search articles…"
        total={articles.length}
        shown={visible.length}
      />

      <ul className="mt-6 divide-y divide-ink/10">
        {visible.map((a) => (
          <ArticleRow
            key={a.slug}
            article={a}
            onSaved={(next) => {
              setArticles(articles.map((x) => (x.slug === next.slug ? next : x)));
              flash("Article updated.");
              refresh();
            }}
            onTogglePublish={() => togglePublish(a)}
            onDelete={() => remove(a)}
          />
        ))}
        {visible.length === 0 && (
          <EmptyState
            filtered={!!filter.state.q || filter.state.status !== "all"}
            onClear={filter.clear}
            onCreate={() => setCreating(true)}
            createLabel="Write your first article"
            emptyLabel="No articles yet."
          />
        )}
      </ul>
    </div>
  );
}

function ArticleRow({
  article,
  onSaved,
  onDelete,
  onTogglePublish,
}: {
  article: Article;
  onSaved: (a: Article) => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(article.title);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [category, setCategory] = useState(article.category);
  const [body, setBody] = useState(article.body.join("\n\n"));
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/articles/${article.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt, category, body }),
      });
      const data = await res.json();
      if (res.ok) {
        onSaved(data.article);
        setOpen(false);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="py-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-serif text-lg">{article.title}</p>
            <PublishBadge published={article.published} />
          </div>
          <p className="truncate text-xs text-ink-mute">
            {article.category} · {article.date} · /{article.slug}
          </p>
        </div>
        <RowActions
          label={article.title}
          published={article.published}
          open={open}
          onTogglePublish={onTogglePublish}
          onToggleOpen={() => setOpen((v) => !v)}
          onDelete={onDelete}
        />
      </div>
      {open && (
        <div className="mt-4 grid gap-3 rounded-2xl bg-sand/60 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <input className="input" aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <select
              className="input"
              aria-label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Article["category"])}
            >
              {ARTICLE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <input className="input" aria-label="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          <textarea
            className="input min-h-[180px] font-serif"
            aria-label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex justify-end">
            <button onClick={save} className="btn-primary" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save</>}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

/* ===================== SERVICES ===================== */

function ServicesTab({
  services,
  setServices,
  flash,
  refresh,
}: {
  services: Service[];
  setServices: (s: Service[]) => void;
  flash: (m: string, k?: "ok" | "err") => void;
  refresh: () => void;
}) {
  const [creating, setCreating] = useState(false);
  const filter = useListFilter("name-asc");
  const sortOptions: SortOption[] = [
    { value: "name-asc", label: "Name A–Z" },
    { value: "price-asc", label: "Price low–high" },
    { value: "price-desc", label: "Price high–low" },
  ];
  const visible = applyFilter(services, filter.state, {
    searchableText: (s) => `${s.name} ${s.blurb} ${s.category}`,
    isPublished: (s) => s.published !== false,
    sorters: {
      "name-asc": (a, b) => a.name.localeCompare(b.name),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
    },
  });
  const { togglePublish, remove } = useResourceActions<Service>({
    endpoint: "/api/admin/services",
    idOf: (s) => s.id,
    labelOf: (s) => s.name,
    noun: "Service",
    flash,
    refresh,
    apply: (m) => setServices(m(services)),
    responseKey: "service",
  });

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">Services</h2>
        <button onClick={() => setCreating((v) => !v)} className="btn-primary">
          <Plus className="h-4 w-4" /> {creating ? "Close" : "New service"}
        </button>
      </div>

      {creating && (
        <ServiceCreateForm
          onCreated={(s) => {
            setServices([...services, s]);
            setCreating(false);
            flash("Service created.");
            refresh();
          }}
          onError={(m) => flash(m, "err")}
        />
      )}

      <ListToolbar
        state={filter.state}
        onQ={filter.setQ}
        onSort={filter.setSort}
        onStatus={filter.setStatus}
        sortOptions={sortOptions}
        searchPlaceholder="Search services…"
        total={services.length}
        shown={visible.length}
      />

      <ul className="mt-6 space-y-3">
        {visible.map((s) => (
          <ServiceRow
            key={s.id}
            service={s}
            onSaved={(next) => {
              setServices(services.map((x) => (x.id === s.id ? next : x)));
              flash("Service updated.");
              refresh();
            }}
            onTogglePublish={() => togglePublish(s)}
            onDelete={() => remove(s)}
          />
        ))}
        {visible.length === 0 && (
          <EmptyState
            filtered={!!filter.state.q || filter.state.status !== "all"}
            onClear={filter.clear}
            onCreate={() => setCreating(true)}
            createLabel="Add your first service"
            emptyLabel="No services yet."
          />
        )}
      </ul>
    </div>
  );
}

function ServiceCreateForm({
  onCreated,
  onError,
}: {
  onCreated: (s: Service) => void;
  onError: (m: string) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Service["category"]>("Massage");
  const [duration, setDuration] = useState("60 min");
  const [price, setPrice] = useState<number>(80);
  const [blurb, setBlurb] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [fe, setFe] = useState<Record<string, string>>({});
  const fid = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFe({});
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, duration, price, blurb, description, details, published }),
      });
      if (!res.ok) {
        const { message, fieldErrors } = await parseApiError(res);
        setFe(fieldErrors);
        onError(message);
        return;
      }
      const data = await res.json();
      onCreated(data.service);
    } catch {
      onError("Network error \u2014 check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl bg-sand/60 p-6" aria-label="New service" noValidate>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="label" htmlFor={`${fid}-name`}>Name</label>
          <input
            id={`${fid}-name`}
            className={`input ${fe.name ? invalidInputClass : ""}`}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!fe.name}
            aria-describedby={fe.name ? `${fid}-name-err` : undefined}
          />
          <FieldError id={`${fid}-name-err`} message={fe.name} />
        </div>
        <div>
          <label className="label" htmlFor={`${fid}-cat`}>Category</label>
          <select
            id={`${fid}-cat`}
            className={`input ${fe.category ? invalidInputClass : ""}`}
            value={category}
            onChange={(e) => setCategory(e.target.value as Service["category"])}
            aria-invalid={!!fe.category}
          >
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor={`${fid}-dur`}>Duration</label>
          <input
            id={`${fid}-dur`}
            className={`input ${fe.duration ? invalidInputClass : ""}`}
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            aria-invalid={!!fe.duration}
            aria-describedby={fe.duration ? `${fid}-dur-err` : undefined}
          />
          <FieldError id={`${fid}-dur-err`} message={fe.duration} />
        </div>
        <div>
          <label className="label" htmlFor={`${fid}-price`}>Price (€)</label>
          <input
            id={`${fid}-price`}
            type="number"
            min={0}
            className={`input ${fe.price ? invalidInputClass : ""}`}
            required
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            aria-invalid={!!fe.price}
            aria-describedby={fe.price ? `${fid}-price-err` : undefined}
          />
          <FieldError id={`${fid}-price-err`} message={fe.price} />
        </div>
        <label className="flex items-end gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            className="h-4 w-4 accent-ink"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publish immediately
        </label>
      </div>
      <div>
        <label className="label" htmlFor={`${fid}-blurb`}>Short tagline (blurb)</label>
        <input
          id={`${fid}-blurb`}
          className={`input ${fe.blurb ? invalidInputClass : ""}`}
          required
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          aria-invalid={!!fe.blurb}
          aria-describedby={fe.blurb ? `${fid}-blurb-err` : undefined}
        />
        <FieldError id={`${fid}-blurb-err`} message={fe.blurb} />
      </div>
      <div>
        <label className="label" htmlFor={`${fid}-desc`}>Full description</label>
        <textarea
          id={`${fid}-desc`}
          className="input min-h-[110px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A longer paragraph that appears on the public services page."
        />
      </div>
      <div>
        <label className="label" htmlFor={`${fid}-details`}>Details (one per line)</label>
        <textarea
          id={`${fid}-details`}
          className="input min-h-[90px]"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={"Aromatherapy consultation\nLong, flowing strokes\nScalp and feet finish"}
        />
      </div>
      <div className="flex justify-end">
        <button className="btn-primary" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Create service"}
        </button>
      </div>
    </form>
  );
}

function ServiceRow({
  service,
  onSaved,
  onTogglePublish,
  onDelete,
}: {
  service: Service;
  onSaved: (s: Service) => void;
  onTogglePublish: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(service.name);
  const [category, setCategory] = useState<Service["category"]>(service.category);
  const [duration, setDuration] = useState(service.duration);
  const [price, setPrice] = useState<number>(service.price);
  const [blurb, setBlurb] = useState(service.blurb);
  const [description, setDescription] = useState(service.description ?? "");
  const [details, setDetails] = useState(service.details.join("\n"));
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, duration, price, blurb, description, details }),
      });
      const data = await res.json();
      if (res.ok) {
        onSaved(data.service);
        setOpen(false);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="rounded-2xl bg-white/70 p-4 ring-1 ring-ink/5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-serif text-lg">{service.name}</p>
            <PublishBadge published={service.published} />
          </div>
          <p className="text-xs text-ink-mute">
            {service.category} · {service.duration} · €{service.price}
          </p>
        </div>
        <RowActions
          label={service.name}
          published={service.published}
          open={open}
          onTogglePublish={onTogglePublish}
          onToggleOpen={() => setOpen((v) => !v)}
          onDelete={onDelete}
        />
      </div>

      {open && (
        <div className="mt-4 grid gap-3 rounded-2xl bg-sand/60 p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <input className="input md:col-span-2" aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <select
              className="input"
              aria-label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Service["category"])}
            >
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input className="input" aria-label="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
            <div className="relative">
              <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute">€</span>
              <input
                type="number"
                aria-label="Price in euros"
                min={0}
                className="input pl-7"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="label">Short tagline</label>
            <input className="input" value={blurb} onChange={(e) => setBlurb(e.target.value)} />
          </div>
          <div>
            <label className="label">Full description</label>
            <textarea
              className="input min-h-[110px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Details (one per line)</label>
            <textarea
              className="input min-h-[90px]"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button onClick={save} className="btn-primary" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save</>}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

/* ===================== SHOP ===================== */

function ShopTab({
  products,
  setProducts,
  flash,
  refresh,
}: {
  products: Product[];
  setProducts: (p: Product[]) => void;
  flash: (m: string, k?: "ok" | "err") => void;
  refresh: () => void;
}) {
  const [creating, setCreating] = useState(false);
  const filter = useListFilter("name-asc");
  const sortOptions: SortOption[] = [
    { value: "name-asc", label: "Name A–Z" },
    { value: "price-asc", label: "Price low–high" },
    { value: "price-desc", label: "Price high–low" },
  ];
  const visible = applyFilter(products, filter.state, {
    searchableText: (p) => `${p.name} ${p.tagline} ${p.cadence} ${p.badge ?? ""}`,
    isPublished: (p) => p.published !== false,
    sorters: {
      "name-asc": (a, b) => a.name.localeCompare(b.name),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
    },
  });
  const { togglePublish, remove } = useResourceActions<Product>({
    endpoint: "/api/admin/products",
    idOf: (p) => p.id,
    labelOf: (p) => p.name,
    noun: "Item",
    flash,
    refresh,
    apply: (m) => setProducts(m(products)),
    responseKey: "product",
  });

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">Shop items</h2>
        <button onClick={() => setCreating((v) => !v)} className="btn-primary">
          <Plus className="h-4 w-4" /> {creating ? "Close" : "New item"}
        </button>
      </div>

      {creating && (
        <ProductCreateForm
          onCreated={(p) => {
            setProducts([...products, p]);
            setCreating(false);
            flash("Item created.");
            refresh();
          }}
          onError={(m) => flash(m, "err")}
        />
      )}

      <ListToolbar
        state={filter.state}
        onQ={filter.setQ}
        onSort={filter.setSort}
        onStatus={filter.setStatus}
        sortOptions={sortOptions}
        searchPlaceholder="Search shop items…"
        total={products.length}
        shown={visible.length}
      />

      <ul className="mt-6 space-y-3">
        {visible.map((p) => (
          <ProductRow
            key={p.id}
            product={p}
            onSaved={(next) => {
              setProducts(products.map((x) => (x.id === p.id ? next : x)));
              flash("Item updated.");
              refresh();
            }}
            onTogglePublish={() => togglePublish(p)}
            onDelete={() => remove(p)}
          />
        ))}
        {visible.length === 0 && (
          <EmptyState
            filtered={!!filter.state.q || filter.state.status !== "all"}
            onClear={filter.clear}
            onCreate={() => setCreating(true)}
            createLabel="Add your first item"
            emptyLabel="No items yet."
          />
        )}
      </ul>
    </div>
  );
}

function ProductCreateForm({
  onCreated,
  onError,
}: {
  onCreated: (p: Product) => void;
  onError: (m: string) => void;
}) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(49);
  const [cadence, setCadence] = useState<Product["cadence"]>("Monthly");
  const [contents, setContents] = useState("");
  const [badge, setBadge] = useState("");
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [fe, setFe] = useState<Record<string, string>>({});
  const fid = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFe({});
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tagline, description, price, cadence, contents, badge, published }),
      });
      if (!res.ok) {
        const { message, fieldErrors } = await parseApiError(res);
        setFe(fieldErrors);
        onError(message);
        return;
      }
      const data = await res.json();
      onCreated(data.product);
    } catch {
      onError("Network error \u2014 check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl bg-sand/60 p-6" aria-label="New shop item" noValidate>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="label" htmlFor={`${fid}-name`}>Name</label>
          <input
            id={`${fid}-name`}
            className={`input ${fe.name ? invalidInputClass : ""}`}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!fe.name}
            aria-describedby={fe.name ? `${fid}-name-err` : undefined}
          />
          <FieldError id={`${fid}-name-err`} message={fe.name} />
        </div>
        <div>
          <label className="label" htmlFor={`${fid}-cadence`}>Cadence</label>
          <select
            id={`${fid}-cadence`}
            className={`input ${fe.cadence ? invalidInputClass : ""}`}
            value={cadence}
            onChange={(e) => setCadence(e.target.value as Product["cadence"])}
            aria-invalid={!!fe.cadence}
          >
            {PRODUCT_CADENCES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor={`${fid}-price`}>Price (€)</label>
          <input
            id={`${fid}-price`}
            type="number"
            min={0}
            required
            className={`input ${fe.price ? invalidInputClass : ""}`}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            aria-invalid={!!fe.price}
            aria-describedby={fe.price ? `${fid}-price-err` : undefined}
          />
          <FieldError id={`${fid}-price-err`} message={fe.price} />
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor={`${fid}-badge`}>Badge (optional)</label>
          <input id={`${fid}-badge`} className="input" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Most loved" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor={`${fid}-tagline`}>Tagline</label>
        <input
          id={`${fid}-tagline`}
          className={`input ${fe.tagline ? invalidInputClass : ""}`}
          required
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          aria-invalid={!!fe.tagline}
          aria-describedby={fe.tagline ? `${fid}-tagline-err` : undefined}
        />
        <FieldError id={`${fid}-tagline-err`} message={fe.tagline} />
      </div>
      <div>
        <label className="label" htmlFor={`${fid}-desc`}>Full description</label>
        <textarea
          id={`${fid}-desc`}
          className={`input min-h-[110px] ${fe.description ? invalidInputClass : ""}`}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={!!fe.description}
          aria-describedby={fe.description ? `${fid}-desc-err` : undefined}
        />
        <FieldError id={`${fid}-desc-err`} message={fe.description} />
      </div>
      <div>
        <label className="label" htmlFor={`${fid}-contents`}>Contents (one per line)</label>
        <textarea
          id={`${fid}-contents`}
          className="input min-h-[110px]"
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          placeholder={"Hand-blended essential oil\nLoose-leaf herbal tea\nRitual candle"}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          className="h-4 w-4 accent-ink"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Publish immediately
      </label>
      <div className="flex justify-end">
        <button className="btn-primary" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Create item"}
        </button>
      </div>
    </form>
  );
}

function ProductRow({
  product,
  onSaved,
  onTogglePublish,
  onDelete,
}: {
  product: Product;
  onSaved: (p: Product) => void;
  onTogglePublish: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [tagline, setTagline] = useState(product.tagline);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState<number>(product.price);
  const [cadence, setCadence] = useState<Product["cadence"]>(product.cadence);
  const [contents, setContents] = useState(product.contents.join("\n"));
  const [badge, setBadge] = useState(product.badge ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tagline, description, price, cadence, contents, badge }),
      });
      const data = await res.json();
      if (res.ok) {
        onSaved(data.product);
        setOpen(false);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="rounded-2xl bg-white/70 p-4 ring-1 ring-ink/5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-serif text-lg">{product.name}</p>
            <PublishBadge published={product.published} />
          </div>
          <p className="text-xs text-ink-mute">
            {product.cadence} · €{product.price}
            {product.badge ? ` · ${product.badge}` : ""}
          </p>
        </div>
        <RowActions
          label={product.name}
          published={product.published}
          open={open}
          onTogglePublish={onTogglePublish}
          onToggleOpen={() => setOpen((v) => !v)}
          onDelete={onDelete}
        />
      </div>

      {open && (
        <div className="mt-4 grid gap-3 rounded-2xl bg-sand/60 p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <input className="input md:col-span-2" aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <select
              className="input"
              aria-label="Cadence"
              value={cadence}
              onChange={(e) => setCadence(e.target.value as Product["cadence"])}
            >
              {PRODUCT_CADENCES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <div className="relative md:col-span-1">
              <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute">€</span>
              <input
                type="number"
                aria-label="Price in euros"
                min={0}
                className="input pl-7"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <input
              className="input md:col-span-2"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Badge (optional)"
            />
          </div>
          <div>
            <label className="label">Tagline</label>
            <input className="input" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
          <div>
            <label className="label">Full description</label>
            <textarea
              className="input min-h-[110px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Contents (one per line)</label>
            <textarea
              className="input min-h-[110px]"
              value={contents}
              onChange={(e) => setContents(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button onClick={save} className="btn-primary" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save</>}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

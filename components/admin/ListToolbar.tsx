"use client";

import { useCallback, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export type SortOption = { value: string; label: string };

export type ListFilterState = {
  q: string;
  sort: string;
  status: "all" | "live" | "draft";
};

function useUrlState() {
  const router = useRouter();
  const params = useSearchParams();

  const set = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    },
    [router, params]
  );

  return { params, set };
}

export function useListFilter(defaultSort: string): {
  state: ListFilterState;
  setQ: (v: string) => void;
  setSort: (v: string) => void;
  setStatus: (v: ListFilterState["status"]) => void;
  clear: () => void;
} {
  const { params, set } = useUrlState();
  const state = useMemo<ListFilterState>(
    () => ({
      q: params.get("q") ?? "",
      sort: params.get("sort") ?? defaultSort,
      status: ((params.get("status") as ListFilterState["status"]) ?? "all"),
    }),
    [params, defaultSort]
  );
  return {
    state,
    setQ: (v) => set({ q: v || null }),
    setSort: (v) => set({ sort: v === defaultSort ? null : v }),
    setStatus: (v) => set({ status: v === "all" ? null : v }),
    clear: () => set({ q: null, sort: null, status: null }),
  };
}

export function applyFilter<T>(
  list: T[],
  state: ListFilterState,
  opts: {
    searchableText: (item: T) => string;
    isPublished: (item: T) => boolean;
    sorters: Record<string, (a: T, b: T) => number>;
  }
): T[] {
  const q = state.q.trim().toLowerCase();
  let out = list;
  if (q) out = out.filter((x) => opts.searchableText(x).toLowerCase().includes(q));
  if (state.status === "live") out = out.filter(opts.isPublished);
  else if (state.status === "draft") out = out.filter((x) => !opts.isPublished(x));
  const sorter = opts.sorters[state.sort];
  if (sorter) out = [...out].sort(sorter);
  return out;
}

export function ListToolbar({
  state,
  onQ,
  onSort,
  onStatus,
  sortOptions,
  searchPlaceholder,
  total,
  shown,
}: {
  state: ListFilterState;
  onQ: (v: string) => void;
  onSort: (v: string) => void;
  onStatus: (v: ListFilterState["status"]) => void;
  sortOptions: SortOption[];
  searchPlaceholder: string;
  total: number;
  shown: number;
}) {
  const filtered = state.q || state.status !== "all";
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <div className="relative min-w-0 flex-1">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
        <input
          type="search"
          aria-label="Search"
          placeholder={searchPlaceholder}
          value={state.q}
          onChange={(e) => onQ(e.target.value)}
          className="input pl-9 pr-9"
        />
        {state.q && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-mute hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <label className="sr-only" htmlFor="filter-status">Status</label>
      <select
        id="filter-status"
        className="input w-auto"
        value={state.status}
        onChange={(e) => onStatus(e.target.value as ListFilterState["status"])}
      >
        <option value="all">All statuses</option>
        <option value="live">Live only</option>
        <option value="draft">Drafts only</option>
      </select>
      <label className="sr-only" htmlFor="filter-sort">Sort</label>
      <select
        id="filter-sort"
        className="input w-auto"
        value={state.sort}
        onChange={(e) => onSort(e.target.value)}
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <p className="text-xs text-ink-mute" aria-live="polite">
        {filtered ? `${shown} of ${total}` : `${total} total`}
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useConfirm } from "@/components/ConfirmDialog";

type Flash = (text: string, kind?: "ok" | "err") => void;

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return data?.error || fallback;
  } catch {
    return fallback;
  }
}

export type ResourceItem = {
  published?: boolean;
};

/**
 * Shared toggle-publish + delete logic for admin resources.
 * Each resource exposes the same shape: PATCH for publish flip, DELETE for remove.
 */
export function useResourceActions<T extends ResourceItem>(opts: {
  endpoint: string;
  idOf: (item: T) => string;
  labelOf: (item: T) => string;
  noun: string;
  flash: Flash;
  refresh: () => void;
  apply: (mutator: (list: T[]) => T[]) => void;
  responseKey: "article" | "service" | "product";
}) {
  const { endpoint, idOf, labelOf, noun, flash, refresh, apply, responseKey } = opts;
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function togglePublish(item: T) {
    const next = !(item.published !== false);
    const id = idOf(item);
    setBusyId(id);
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: next }),
      });
      if (!res.ok) {
        flash(await readError(res, `Could not update \u201c${labelOf(item)}\u201d.`), "err");
        return;
      }
      const data = await res.json();
      const updated = data[responseKey] as T;
      apply((list) => list.map((x) => (idOf(x) === id ? updated : x)));
      flash(next ? `${noun} published.` : `${noun} hidden.`);
      refresh();
    } catch {
      flash("Network error \u2014 check your connection.", "err");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(item: T) {
    const ok = await confirm({
      title: `Delete ${noun.toLowerCase()}?`,
      message: `\u201c${labelOf(item)}\u201d will be permanently removed.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    const id = idOf(item);
    setBusyId(id);
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        flash(await readError(res, `Could not delete \u201c${labelOf(item)}\u201d.`), "err");
        return;
      }
      apply((list) => list.filter((x) => idOf(x) !== id));
      flash(`${noun} deleted.`);
      refresh();
    } catch {
      flash("Network error \u2014 check your connection.", "err");
    } finally {
      setBusyId(null);
    }
  }

  return { togglePublish, remove, busyId };
}

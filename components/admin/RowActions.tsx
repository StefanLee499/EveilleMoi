"use client";

import { Eye, EyeOff, Loader2, Trash2 } from "lucide-react";

export function PublishBadge({ published }: { published?: boolean }) {
  return published === false ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-ink-mute">
      <EyeOff className="h-3 w-3" aria-hidden="true" /> Draft
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-sage-900">
      <Eye className="h-3 w-3" aria-hidden="true" /> Live
    </span>
  );
}

export function ToggleButton({
  published,
  onToggle,
  busy,
}: {
  published?: boolean;
  onToggle: () => void;
  busy?: boolean;
}) {
  const live = published !== false;
  const label = live ? "Unpublish" : "Publish";
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      title={label}
      aria-label={label}
      aria-busy={busy || undefined}
      className={`btn-ghost ${live ? "" : "border-sage-500 text-sage-700"}`}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : live ? (
        <><EyeOff className="h-4 w-4" aria-hidden="true" /> Unpublish</>
      ) : (
        <><Eye className="h-4 w-4" aria-hidden="true" /> Publish</>
      )}
    </button>
  );
}

export function RowActions({
  label,
  published,
  open,
  busy,
  onTogglePublish,
  onToggleOpen,
  onDelete,
}: {
  label: string;
  published?: boolean;
  open: boolean;
  busy?: boolean;
  onTogglePublish: () => void;
  onToggleOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <ToggleButton published={published} onToggle={onTogglePublish} busy={busy} />
      <button
        type="button"
        onClick={onToggleOpen}
        className="btn-ghost"
        aria-expanded={open}
        aria-label={open ? `Close editor for ${label}` : `Edit ${label}`}
      >
        {open ? "Close" : "Edit"}
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${label}`}
        disabled={busy}
        className="rounded-full p-2 text-ink-mute hover:text-terracotta-700 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </>
  );
}

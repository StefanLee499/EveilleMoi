"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trap focus inside `ref` while `active` is true. Restores focus to the
 * previously focused element on deactivation and calls `onEscape` when ESC
 * is pressed.
 */
export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  onEscape?: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;
    const root = ref.current;
    if (!root) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("aria-hidden")
      );

    const initial = focusables()[0] ?? root;
    initial.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (current === first || !root.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [active, onEscape]);

  return ref;
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useEffect, useId, useState } from "react";
import { useT } from "@/lib/i18n-client";
import { useFocusTrap } from "@/lib/use-focus-trap";

export default function CartDrawer() {
  const t = useT();
  const { isOpen, close, items, setQty, remove, total, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const trapRef = useFocusTrap<HTMLElement>(isOpen, close);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setError(null);
  }, [isOpen]);

  async function checkout() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total: total() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(data.id);
      clear();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={close} />
          <motion.aside
            ref={trapRef as React.RefObject<HTMLElement>}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl focus:outline-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                <h3 id={titleId} className="font-serif text-2xl">{t("cart.title")}</h3>
              </div>
              <button
                onClick={close}
                aria-label={t("common.close")}
                className="rounded-full p-2 hover:bg-ink/5"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {done ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-sage-100 text-sage-700">
                    ✓
                  </div>
                  <h4 className="font-serif text-2xl">{t("cart.thanks")}</h4>
                  <p className="mt-2 text-ink-soft">
                    {t("cart.thanksBody1")} <code className="text-ink">#{done}</code> {t("cart.thanksBody2")}
                  </p>
                  <button className="btn-ghost mt-6" onClick={() => { setDone(null); close(); }}>
                    {t("cart.keepBrowsing")}
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-ink-soft">
                  <ShoppingBag className="h-8 w-8 opacity-40" aria-hidden="true" />
                  <p className="mt-3">{t("cart.empty")}</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((i) => (
                    <li key={i.id} className="flex gap-4 rounded-2xl bg-white/70 p-4 shadow-soft">
                      <div className="grid h-16 w-16 place-items-center rounded-xl bg-sage-100 text-sage-700">
                        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{i.name}</p>
                        <p className="text-xs text-ink-mute">{i.cadence}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            className="rounded-full border border-ink/15 p-1 disabled:opacity-50"
                            onClick={() => setQty(i.id, i.qty - 1)}
                            disabled={submitting}
                            aria-label={`Decrease quantity of ${i.name}`}
                          >
                            <Minus className="h-3 w-3" aria-hidden="true" />
                          </button>
                          <span className="w-6 text-center text-sm" aria-live="polite">{i.qty}</span>
                          <button
                            className="rounded-full border border-ink/15 p-1 disabled:opacity-50"
                            onClick={() => setQty(i.id, i.qty + 1)}
                            disabled={submitting}
                            aria-label={`Increase quantity of ${i.name}`}
                          >
                            <Plus className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <p className="font-medium">€{(i.price * i.qty).toFixed(0)}</p>
                        <button
                          onClick={() => remove(i.id)}
                          className="text-ink-mute hover:text-terracotta-700 disabled:opacity-50"
                          disabled={submitting}
                          aria-label={`Remove ${i.name}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!done && items.length > 0 && (
              <div className="border-t border-ink/10 px-6 py-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{t("cart.subtotal")}</span>
                  <span className="font-serif text-2xl">€{total().toFixed(0)}</span>
                </div>
                {error && (
                  <p
                    role="alert"
                    aria-live="assertive"
                    className="mb-3 rounded-2xl bg-terracotta-500/10 px-4 py-2 text-sm text-terracotta-700"
                  >
                    {error}
                  </p>
                )}
                <button
                  className="btn-primary w-full"
                  disabled={submitting}
                  aria-busy={submitting}
                  onClick={checkout}
                >
                  {submitting ? t("cart.reserving") : t("cart.reserve")}
                </button>
                <p className="mt-3 text-center text-xs text-ink-mute">
                  {t("cart.disclaimer")}
                </p>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

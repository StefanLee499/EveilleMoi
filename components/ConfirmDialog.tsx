"use client";

import { createContext, useCallback, useContext, useId, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useFocusTrap } from "@/lib/use-focus-trap";

type ConfirmOptions = {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmCtx = createContext<ConfirmFn | null>(null);

export function useConfirm(): ConfirmFn {
  const fn = useContext(ConfirmCtx);
  if (!fn) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return fn;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((v: boolean) => void) | null>(null);
  const titleId = useId();
  const descId = useId();

  const confirm = useCallback<ConfirmFn>((o) => {
    setOpts(o);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const close = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOpts(null);
  }, []);

  const dialogRef = useFocusTrap<HTMLDivElement>(!!opts, () => close(false));

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {opts && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={() => close(false)}
        >
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="card w-full max-w-md p-6 focus:outline-none md:p-7"
          >
            <div className="flex items-start gap-3">
              {opts.destructive && (
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-terracotta-500/15 text-terracotta-700"
                >
                  <AlertTriangle className="h-5 w-5" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="font-serif text-xl text-ink">
                  {opts.title ?? "Are you sure?"}
                </h2>
                {opts.message && (
                  <p id={descId} className="mt-2 text-sm text-ink-soft">
                    {opts.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={() => close(false)}>
                {opts.cancelLabel ?? "Cancel"}
              </button>
              <button
                type="button"
                className={opts.destructive ? "btn-secondary" : "btn-primary"}
                onClick={() => close(true)}
              >
                {opts.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}

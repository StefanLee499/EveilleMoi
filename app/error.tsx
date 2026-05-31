"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <section className="container-x grid min-h-[70vh] place-items-center py-20">
      <div className="card w-full max-w-lg p-8 text-center md:p-12">
        <span
          aria-hidden="true"
          className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-terracotta-500/15 text-terracotta-700"
        >
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h1 className="h-display mt-5 text-3xl">Something went off-key.</h1>
        <p className="mt-3 text-sm text-ink-soft">
          We couldn’t load this page. Please try again in a moment.
        </p>
        {error?.digest && (
          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-mute">
            ref · {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <Link href="/" className="btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}

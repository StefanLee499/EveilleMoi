"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function BlogArticleError({
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
    <section className="container-x grid min-h-[60vh] place-items-center py-20">
      <div className="card w-full max-w-lg p-8 text-center md:p-10">
        <span
          aria-hidden="true"
          className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-terracotta-500/15 text-terracotta-700"
        >
          <AlertTriangle className="h-5 w-5" />
        </span>
        <h1 className="h-display mt-4 text-2xl">This article didn’t open.</h1>
        <p className="mt-2 text-sm text-ink-soft">
          The story may have moved, or the page failed to load.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <Link href="/blog" className="btn-ghost">
            Back to journal
          </Link>
        </div>
      </div>
    </section>
  );
}

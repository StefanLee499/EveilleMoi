export default function Loading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="container-x grid min-h-[70vh] place-items-center py-20"
    >
      <div className="w-full max-w-3xl space-y-6">
        <div className="h-4 w-32 animate-pulse rounded-full bg-ink/10" />
        <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-ink/10" />
        <div className="h-12 w-2/3 animate-pulse rounded-2xl bg-ink/10" />
        <div className="space-y-3 pt-4">
          <div className="h-4 w-full animate-pulse rounded-full bg-ink/10" />
          <div className="h-4 w-11/12 animate-pulse rounded-full bg-ink/10" />
          <div className="h-4 w-9/12 animate-pulse rounded-full bg-ink/10" />
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="container-x py-20"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="h-4 w-24 animate-pulse rounded-full bg-ink/10" />
        <div className="h-10 w-5/6 animate-pulse rounded-2xl bg-ink/10" />
        <div className="aspect-[5/2] w-full animate-pulse rounded-3xl bg-ink/10" />
        <div className="space-y-3 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded-full bg-ink/10"
              style={{ width: `${100 - (i * 7) % 30}%` }}
            />
          ))}
        </div>
        <span className="sr-only">Loading article…</span>
      </div>
    </section>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <path
        d="M14 30c0-8 4-14 10-14s10 6 10 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="24" cy="18" r="2.4" fill="currentColor" />
      <path d="M10 34c4-1 8-1 14-1s10 0 14 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

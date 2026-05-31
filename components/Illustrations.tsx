"use client";

import { motion, useReducedMotion } from "framer-motion";

export function MoonIllustration({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden>
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EFE6D2" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EFE6D2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="moonBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6F1E7" />
          <stop offset="100%" stopColor="#DCE4D2" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="180" fill="url(#moonGlow)" />
      <motion.g
        animate={reduced ? undefined : { rotate: 360 }}
        transition={reduced ? undefined : { duration: 90, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle cx="200" cy="60" r="2" fill="#56654A" />
        <circle cx="340" cy="200" r="1.5" fill="#56654A" />
        <circle cx="200" cy="340" r="2" fill="#56654A" />
        <circle cx="60" cy="200" r="1.5" fill="#56654A" />
        <circle cx="100" cy="100" r="1" fill="#56654A" />
        <circle cx="300" cy="300" r="1" fill="#56654A" />
      </motion.g>
      <circle cx="200" cy="200" r="120" fill="url(#moonBody)" stroke="#56654A" strokeOpacity="0.15" />
      <circle cx="170" cy="170" r="14" fill="#DCE4D2" opacity="0.6" />
      <circle cx="230" cy="220" r="22" fill="#DCE4D2" opacity="0.5" />
      <circle cx="200" cy="260" r="8" fill="#DCE4D2" opacity="0.7" />
      <motion.circle
        cx="320"
        cy="120"
        r="3"
        fill="#C97B5A"
        animate={reduced ? undefined : { opacity: [0.3, 1, 0.3] }}
        transition={reduced ? undefined : { duration: 3, repeat: Infinity }}
      />
      <motion.circle
        cx="80"
        cy="280"
        r="2"
        fill="#C97B5A"
        animate={reduced ? undefined : { opacity: [1, 0.2, 1] }}
        transition={reduced ? undefined : { duration: 4, repeat: Infinity }}
      />
    </svg>
  );
}

export function LeafIllustration({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 200 300" className={className} fill="none" aria-hidden>
      <motion.g
        animate={reduced ? undefined : { rotate: [-2, 2, -2] }}
        transition={reduced ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 280px" }}
      >
        <path d="M100 280 Q100 180 100 60" stroke="#56654A" strokeWidth="2" />
        <path d="M100 220 Q60 200 40 160 Q70 170 100 200" fill="#A8B89A" />
        <path d="M100 180 Q140 160 160 120 Q130 130 100 160" fill="#7C8C6C" />
        <path d="M100 140 Q70 120 55 80 Q85 95 100 120" fill="#A8B89A" />
        <path d="M100 100 Q130 80 145 45 Q115 55 100 80" fill="#7C8C6C" />
        <ellipse cx="100" cy="55" rx="14" ry="20" fill="#56654A" />
      </motion.g>
    </svg>
  );
}

export function HandIllustration({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 320 320" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E2A58A" />
          <stop offset="100%" stopColor="#C97B5A" />
        </linearGradient>
      </defs>
      <motion.g
        animate={reduced ? undefined : { y: [0, -6, 0] }}
        transition={reduced ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M70 220 Q60 160 100 130 Q130 110 130 80 Q130 50 160 50 Q190 50 190 80 L190 140 Q220 130 240 150 Q260 170 250 200 Q240 240 200 260 Q150 280 110 270 Q80 260 70 220 Z"
          fill="url(#skin)"
          stroke="#9C5638"
          strokeOpacity="0.25"
        />
        <circle cx="160" cy="180" r="22" fill="#F6F1E7" opacity="0.6" />
        <circle cx="160" cy="180" r="6" fill="#56654A" />
      </motion.g>
    </svg>
  );
}

export function StarsField({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const stars = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 137) % 100,
    y: (i * 89) % 100,
    r: ((i * 7) % 3) + 0.5,
    d: 2 + ((i * 3) % 5),
  }));
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden>
      {stars.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r / 4}
          fill="#56654A"
          animate={reduced ? undefined : { opacity: [0.2, 0.9, 0.2] }}
          transition={reduced ? undefined : { duration: s.d, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </svg>
  );
}

"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: As = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: any;
}) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion(As as any);
  if (prefersReduced) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }
  return (
    <MotionTag
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

export function Parallax({
  children,
  amount = 60,
  className = "",
}: {
  children: React.ReactNode;
  amount?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  if (prefersReduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export function FadeWord({ text, className = "" }: { text: string; className?: string }) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");
  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </span>
  );
}

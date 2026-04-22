"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * SplitHeadline — splits each word/char for a staggered reveal.
 *
 * Words wrap together (no orphan characters inside a word), but each
 * character has its own transform so the whole line feels like ink
 * settling onto paper. Falls back to a plain span when the user prefers
 * reduced motion.
 */
export function SplitHeadline({
  text,
  className,
  delay = 0,
  stagger = 0.03,
  italic = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  italic?: boolean;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
  const child: Variants = {
    hidden: { opacity: 0, y: "40%" },
    show: {
      opacity: 1,
      y: "0%",
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
      style={italic ? { fontStyle: "italic" } : undefined}
    >
      {words.map((word, wi) => (
        <span
          key={`${word}-${wi}`}
          className="inline-block whitespace-nowrap"
        >
          {Array.from(word).map((ch, ci) => (
            <motion.span
              key={`${ch}-${ci}`}
              variants={child}
              className="inline-block"
            >
              {ch}
            </motion.span>
          ))}
          {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </motion.span>
  );
}

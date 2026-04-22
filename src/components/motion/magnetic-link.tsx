"use client";

import Link from "next/link";
import { useRef, useState, type ComponentProps } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * MagneticLink — a link that gently follows the cursor within a radius.
 *
 * The effect is restrained: a ~14px translation max, smoothed with a
 * motion spring. Disabled when the user prefers reduced motion, in which
 * case it renders as a plain `<Link>`.
 */
type Props = {
  strength?: number;
} & ComponentProps<typeof Link>;

export function MagneticLink({ strength = 14, children, className, ...rest }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  if (reduce) {
    return (
      <Link className={className} {...rest}>
        {children}
      </Link>
    );
  }

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const nx = Math.max(-1, Math.min(1, x / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, y / (rect.height / 2)));
    setOffset({ x: nx * strength, y: ny * strength });
  };

  const handleLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.span
      className="inline-block"
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.4 }}
    >
      <Link
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={className}
        {...rest}
      >
        {children}
      </Link>
    </motion.span>
  );
}

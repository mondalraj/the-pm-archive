"use client";

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * Lightweight animation primitives built on `motion/react`.
 *
 * Design goals:
 *   - Subtle, editorial. No bouncy springs, no long durations.
 *   - SSR-safe. These are client components; wrap only the parts of a
 *     page that benefit from reveal. The rest of the tree stays static.
 *   - Respect `prefers-reduced-motion`. When the user has reduced motion
 *     on, these render as plain elements with zero transform or opacity
 *     animation.
 *
 * Two patterns:
 *
 *   <Reveal>         Single element fades + slides up when it enters
 *                    the viewport. Fires once. Good for section titles,
 *                    hero blocks, newsletter CTAs.
 *
 *   <Stagger>        Parent that staggers children. Pair with
 *     <StaggerItem>  <StaggerItem> for grids / lists that reveal in
 *                    sequence as the group scrolls into view.
 */

const EASE = [0.22, 1, 0.36, 1] as const; // "ease-out-expo"-ish

type RevealProps = {
  children: ReactNode;
  /** Delay before the animation starts, in seconds. */
  delay?: number;
  /** Pixels to translate up from. Default 16. */
  y?: number;
  /** Fire on mount instead of waiting for the viewport. */
  immediate?: boolean;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "className" | "initial" | "animate" | "whileInView" | "viewport" | "transition">;

export function Reveal({
  children,
  delay = 0,
  y = 16,
  immediate = false,
  className,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} {...(rest as Record<string, unknown>)}>
        {children}
      </div>
    );
  }

  const transition = { duration: 0.7, ease: EASE, delay };
  const from = { opacity: 0, y };
  const to = { opacity: 1, y: 0 };

  return immediate ? (
    <motion.div
      className={className}
      initial={from}
      animate={to}
      transition={transition}
      {...rest}
    >
      {children}
    </motion.div>
  ) : (
    <motion.div
      className={className}
      initial={from}
      whileInView={to}
      viewport={{ once: true, margin: "-80px" }}
      transition={transition}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

type StaggerProps = {
  children: ReactNode;
  /** Fire on mount instead of waiting for the viewport. */
  immediate?: boolean;
  className?: string;
};

export function Stagger({ children, immediate = false, className }: StaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "-80px" } })}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

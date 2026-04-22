"use client";

import { useEffect, useRef } from "react";

/**
 * InteractiveGrid — a subtle, gamified grid that reacts to the cursor.
 *
 * Two layered pieces:
 *   1. A faint always-on 48px grid (low-opacity violet lines) so the
 *      background has structure but doesn't pull attention.
 *   2. A radial "spotlight" that follows the cursor, implemented as a
 *      CSS `radial-gradient` whose position is driven by two CSS
 *      custom properties (`--mx`, `--my`). We update the properties
 *      with rAF on mousemove — no React state, no re-renders.
 *
 * The result: the grid sits quietly until the reader sweeps their
 * mouse over the hero, at which point a soft violet glow tracks their
 * movement and lights up the cells underneath. Restrained, not
 * distracting. Fully disabled by `prefers-reduced-motion`.
 */
export function InteractiveGrid({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;
    let targetX = -9999;
    let targetY = -9999;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(flush);
    };
    const handleLeave = () => {
      targetX = -9999;
      targetY = -9999;
      if (!frame) frame = requestAnimationFrame(flush);
    };
    const flush = () => {
      frame = 0;
      el.style.setProperty("--mx", `${targetX}px`);
      el.style.setProperty("--my", `${targetY}px`);
    };

    const parent = el.parentElement ?? el;
    parent.addEventListener("mousemove", handleMove);
    parent.addEventListener("mouseleave", handleLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMove);
      parent.removeEventListener("mouseleave", handleLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      style={
        {
          "--mx": "-9999px",
          "--my": "-9999px",
        } as React.CSSProperties
      }
    >
      {/* Base grid. */}
      <div className="interactive-grid-base" />
      {/* Cursor spotlight. */}
      <div className="interactive-grid-spot" />
    </div>
  );
}

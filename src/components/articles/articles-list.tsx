"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { ArticleSummary } from "@/types/article";
import { StandardCard } from "@/components/home/standard-card";

/**
 * Client-side infinite-scroll list.
 *
 * The server hands us the full article set in one request; we reveal it
 * `pageSize` rows at a time. A sentinel `<div>` at the end of the list
 * is observed with `IntersectionObserver` — when it scrolls into view
 * we bump `visible` by `pageSize`. There's no network call involved, so
 * "loading" is really just staged rendering, which keeps the initial
 * DOM small and the scroll responsive on long archives.
 *
 * Respects `prefers-reduced-motion` by skipping the fade-up animation
 * on newly revealed rows.
 */
export function ArticlesList({
  articles,
  pageSize = 6,
}: {
  articles: ArticleSummary[];
  pageSize?: number;
}) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(() =>
    Math.min(pageSize, articles.length),
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible >= articles.length) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible((v) => Math.min(v + pageSize, articles.length));
          }
        }
      },
      { rootMargin: "400px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [visible, articles.length, pageSize]);

  const shown = articles.slice(0, visible);
  const done = visible >= articles.length;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        <AnimatePresence initial={false}>
          {shown.map((article, index) =>
            reduce ? (
              <StandardCard key={article.slug} article={article} />
            ) : (
              <motion.div
                key={article.slug}
                initial={index < pageSize ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index < pageSize ? 0 : 0.04 * (index % pageSize),
                }}
              >
                <StandardCard article={article} />
              </motion.div>
            ),
          )}
        </AnimatePresence>
      </div>

      <div
        ref={sentinelRef}
        className="mt-16 flex flex-col items-center justify-center gap-2"
      >
        {done ? (
          <p className="label-caps text-muted-foreground">
            You&apos;ve reached the end of the archive
          </p>
        ) : (
          <LoadingIndicator />
        )}
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      <span className="label-caps">Loading more</span>
    </div>
  );
}

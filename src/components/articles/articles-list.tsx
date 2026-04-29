"use client";


import { useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { ArticleSummary } from "@/types/article";
import { StandardCard } from "@/components/home/standard-card";
import { useInfiniteArticles } from "@/hooks/use-infinite-articles";

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


export function ArticlesList({ pageSize = 10 }: { pageSize?: number }) {
  const reduce = useReducedMotion();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteArticles(pageSize);

  // Flatten all pages into a single articles array
  const articles: ArticleSummary[] = data?.pages.flatMap((page) => page.articles) ?? [];

  // Infinite scroll observer
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || isLoading || isError) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      }
    }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError]);

  return (
    <ErrorBoundary>
      <div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-lg border border-border bg-surface p-6 min-h-[180px] flex flex-col gap-4"
                  />
                ))
              : articles.map((article, index) => {
                  const key = article.id ?? `${article.slug}-${article.createdAt}`;
                  return reduce ? (
                    <StandardCard key={key} article={article} />
                  ) : (
                    <motion.div
                      key={key}
                      className="flex"
                      initial={index < pageSize ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                        delay: index < pageSize ? 0 : 0.04 * (index % pageSize),
                      }}
                    >
                      <StandardCard article={article} className="w-full" />
                    </motion.div>
                  );
                })}
          </AnimatePresence>
        </div>

        <div
          ref={sentinelRef}
          className="mt-16 flex flex-col items-center justify-center gap-2"
        >
          {isError ? (
            <ErrorMessage message={error?.message || "Failed to load articles."} onRetry={refetch} />
          ) : isFetchingNextPage ? (
            <LoadingIndicator />
          ) : !hasNextPage && !isLoading ? (
            <p className="label-caps text-muted-foreground">
              You&apos;ve reached the end of the archive
            </p>
          ) : null}
        </div>
      </div>
    </ErrorBoundary>
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

function ErrorMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 text-destructive">
      <span className="label-caps">{message}</span>
      <button
        className="label-caps text-primary underline underline-offset-4 hover:opacity-80"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}

import * as React from "react";
// Simple error boundary for client components
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return <div className="text-destructive label-caps">Something went wrong. Please reload the page.</div>;
    }
    return this.props.children;
  }
}

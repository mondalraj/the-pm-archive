"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { ArticleSummary } from "@/types/article";
import { StandardCard } from "@/components/home/standard-card";

type FetchState = "idle" | "loading" | "error";

type ApiResponse = {
  articles: ArticleSummary[];
  hasMore: boolean;
};

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
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);

  // Fetch articles page
  const fetchArticles = useCallback(async () => {
    if (!hasMore || fetchState === "loading") return;
    setFetchState("loading");
    setError(null);
    try {
      const res = await fetch(`/api/articles?offset=${articles.length}&limit=${pageSize}`);
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data: ApiResponse = await res.json();
      setArticles((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const newArticles = data.articles.filter((a) => !existingIds.has(a.id));
        return [...prev, ...newArticles];
      });
      setHasMore(data.hasMore);
      setFetchState("idle");
      setPage((p) => p + 1);
    } catch (err: any) {
      setFetchState("error");
      setError(err?.message || "Unknown error");
    }
  }, [articles.length, hasMore, fetchState, pageSize]);

  // Initial fetch
  useEffect(() => {
    (async () => {
      await fetchArticles();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!hasMore || fetchState === "loading" || fetchState === "error") return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          fetchArticles();
        }
      }
    }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [fetchArticles, hasMore, fetchState]);

  return (
    <ErrorBoundary>
      <div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {articles.map((article, index) => {
              // Prefer id, fallback to slug+createdAt for uniqueness
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
          {fetchState === "error" ? (
            <ErrorMessage message={error || "Failed to load articles."} onRetry={fetchArticles} />
          ) : hasMore ? (
            <LoadingIndicator />
          ) : (
            <p className="label-caps text-muted-foreground">
              You&apos;ve reached the end of the archive
            </p>
          )}
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

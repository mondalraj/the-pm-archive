"use client";


import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ArticleSummary } from "@/types/article";
import { StandardCard } from "@/components/home/standard-card";
import { cn } from "@/lib/utils";
import { useInfiniteTopics } from "@/hooks/use-infinite-topics";
type ApiResponse = { articles: ArticleSummary[]; hasMore: boolean };



/**
 * Client-side topic explorer.
 *  - Search filters on title, description, newsletter name, author, tags.
 *  - Tag pills narrow further; clicking the active tag clears it.
 */
export function TopicsExplorer({ tags }: { tags: string[] }) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 10;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteTopics({ tag: activeTag, query, pageSize }) as {
    data: { pages: ApiResponse[] } | undefined;
    fetchNextPage: () => void;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
  };
  // Flatten all pages into a single articles array
  const articles: ArticleSummary[] = data?.pages.flatMap((page) => page.articles) ?? [];

  // Remove fetchArticles and related state

  // Refetch on filter change
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTag, query]);

  // IntersectionObserver for infinite scroll
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
    <div>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="mb-8">
            <label htmlFor="topics-search" className="label-caps mb-3 block text-muted-foreground">
              Search
            </label>
            <div className="relative">
              <input
                id="topics-search"
                type="search"
                autoComplete="off"
                placeholder="Search by topic, challenge, or tool..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-border bg-surface px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <p className="label-caps mb-4 text-muted-foreground">Topics</p>
            <div className="flex flex-wrap gap-2">
              <TagPill label="All" active={activeTag === null} onClick={() => setActiveTag(null)} />
              {tags.map((tag) => (
                <TagPill
                  key={tag}
                  label={tag}
                  active={activeTag === tag}
                  onClick={() => setActiveTag((t) => (t === tag ? null : tag))}
                />
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-border pb-4">
            <p className="label-caps text-muted-foreground">
              {isLoading && articles.length === 0
                ? "Loading…"
                : `${articles.length} ${articles.length === 1 ? "result" : "results"}`}
            </p>
            {activeTag ? (
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="label-caps text-primary transition-opacity hover:opacity-70"
              >
                Clear topic: {activeTag}
              </button>
            ) : null}
          </div>

          {isError ? (
            <div className="text-destructive label-caps mb-4">{error?.message || "Failed to load articles."}</div>
          ) : null}

          {articles.length === 0 && isLoading ? (
            <TopicsSkeletonGrid />
          ) : articles.length === 0 && !isLoading ? (
            <EmptyState
              onClear={() => {
                setQuery("");
                setActiveTag(null);
              }}
            />
          ) : (
            <motion.div layout={!reduce} className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {articles.map((article) =>
                  reduce ? (
                    <StandardCard key={article.id ?? `${article.slug}-${article.createdAt}`} article={article} />
                  ) : (
                    <motion.div
                      layout
                      key={article.id ?? `${article.slug}-${article.createdAt}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <StandardCard article={article} />
                    </motion.div>
                  ),
                )}
              </AnimatePresence>
            </motion.div>
          )}
          <div ref={sentinelRef} className="mt-8 flex flex-col items-center justify-center gap-2">
            {isFetchingNextPage && articles.length > 0 ? (
              <LoadingIndicator />
            ) : null}
            {!hasNextPage && articles.length > 0 && !isLoading ? (
              <p className="label-caps text-muted-foreground">You&apos;ve reached the end of the archive</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

// Skeleton grid for loading state
function TopicsSkeletonGrid() {
  // Show 6 skeleton cards
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-border bg-surface p-6 min-h-[180px] flex flex-col gap-4"
        >
          <div className="h-5 w-1/3 rounded bg-muted" />
          <div className="h-7 w-2/3 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted/70" />
          <div className="h-4 w-5/6 rounded bg-muted/60" />
          <div className="mt-auto flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted/80" />
            <div className="h-4 w-1/4 rounded bg-muted/60" />
          </div>
        </div>
      ))}
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
}

function TagPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "label-caps inline-flex items-center border px-3 py-2 transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4 border border-dashed border-border bg-surface/40 p-10">
      <p className="font-serif text-2xl italic text-muted-foreground">No matching articles yet.</p>
      <p className="text-muted-foreground">
        Try a broader keyword, or clear filters to discover what other builders
        are reading right now.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="label-caps border-b border-primary/40 pb-1 text-primary transition-all hover:border-primary"
      >
        Reset filters
      </button>
    </div>
  );
}

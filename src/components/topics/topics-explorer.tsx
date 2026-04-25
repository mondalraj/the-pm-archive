"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ArticleSummary } from "@/types/article";
import { StandardCard } from "@/components/home/standard-card";
import { cn } from "@/lib/utils";

/**
 * Client-side topic explorer.
 *  - Search filters on title, description, newsletter name, author, tags.
 *  - Tag pills narrow further; clicking the active tag clears it.
 */
export function TopicsExplorer({
  articles,
  tags,
}: {
  articles: ArticleSummary[];
  tags: string[];
}) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      const tagNames = article.tags.map((t) => t.name);
      if (activeTag && !tagNames.includes(activeTag)) return false;
      if (!q) return true;
      const haystack = [
        article.title,
        article.description,
        article.sourceName,
        article.authorName,
        ...tagNames,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [articles, query, activeTag]);

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
                placeholder="Search articles…"
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
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
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

          {filtered.length === 0 ? (
            <EmptyState
              onClear={() => {
                setQuery("");
                setActiveTag(null);
              }}
            />
          ) : (
            <motion.div layout={!reduce} className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {filtered.map((article) =>
                  reduce ? (
                    <StandardCard key={article.slug} article={article} />
                  ) : (
                    <motion.div
                      layout
                      key={article.slug}
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
        </div>
      </div>
    </div>
  );
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
      <p className="font-serif text-2xl italic text-muted-foreground">No matching articles.</p>
      <p className="text-muted-foreground">
        Try a different keyword, or clear your filters to see the full archive.
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

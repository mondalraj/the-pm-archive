import Link from "next/link";
import type { ArticleSummary } from "@/types/article";
import { cn, formatDate } from "@/lib/utils";
import { ArticleCover } from "@/components/ui/article-cover";

/**
 * Standard editorial card: square cover, category, title, excerpt, meta.
 *
 * `compact` tightens vertical rhythm so two standard cards can stack next
 * to the featured card without overflowing its height.
 */
export function StandardCard({
  article,
  compact = false,
  className,
}: {
  article: ArticleSummary;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "group flex flex-col border border-border bg-surface p-5 transition-all duration-300 hover:border-border-strong hover:-translate-y-0.5",
        compact ? "md:flex-row md:gap-5 md:p-4" : "",
        className,
      )}
    >
      <div
        className={cn(
          "relative mb-5 overflow-hidden",
          compact
            ? "aspect-[4/3] md:mb-0 md:aspect-square md:w-40 md:shrink-0"
            : "aspect-[4/3]",
        )}
      >
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          <ArticleCover hueSeed={article.hueSeed} />
        </div>
        <span className="label-caps absolute left-3 top-3 bg-background/80 px-2 py-1 text-primary backdrop-blur-sm">
          {article.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <h3
          className={cn(
            "font-serif font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary",
            compact ? "text-lg md:text-xl" : "text-2xl",
          )}
        >
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-muted-foreground">
          <span className="label-caps">{article.author.name}</span>
          <span>
            {formatDate(article.publishedAt, "short")} · {article.readingTime}m
          </span>
        </div>
      </div>
    </Link>
  );
}

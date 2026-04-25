import Link from "next/link";
import Image from "next/image";
import type { ArticleSummary } from "@/types/article";
import { cn, formatDate } from "@/lib/utils";

/**
 * Standard editorial card.
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
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          sizes={compact ? "160px" : "(min-width: 1024px) 360px, 100vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="label-caps absolute left-3 top-3 bg-background/80 px-2 py-1 text-primary backdrop-blur-sm">
          {article.sourceName}
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
          <span className="label-caps">{article.authorName}</span>
          <span>
            {formatDate(article.createdAt, "short")} · {article.timeToRead}m
          </span>
        </div>
      </div>
    </Link>
  );
}

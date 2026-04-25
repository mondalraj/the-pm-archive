import Link from "next/link";
import Image from "next/image";
import type { ArticleSummary } from "@/types/article";
import { cn, formatDate } from "@/lib/utils";

/**
 * Standard editorial card.
 *
 * Design constraints:
 * - Fixed aspect-ratio image area so all cards in a row are the same height
 * - Title clamped to 2 lines, description to 2 lines → consistent body height
 * - Author / source truncated to 1 line each so the meta row never wraps
 * - No-image fallback uses a gradient swatch so the card still looks intentional
 */
export function StandardCard({
  article,
  compact = false,
  descriptionClamp = 2,
  className,
}: {
  article: ArticleSummary;
  compact?: boolean;
  /** Max lines to show for the description. Defaults to 2. */
  descriptionClamp?: 2 | 3 | 4 | 5;
  className?: string;
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        // h-full ensures the card stretches to fill its grid / motion wrapper
        "group relative flex h-full flex-col overflow-hidden border border-border bg-surface transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_32px_-8px_rgba(124,58,237,0.18)]",
        compact ? "md:flex-row" : "",
        className,
      )}
    >
      {/* ── Thin primary accent line that slides in from the left on hover ── */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
      />

      {/* ── Thumbnail ── */}
      {article.imageUrl ? (
        <div
          className={cn(
            "relative shrink-0 overflow-hidden",
            compact
              ? "aspect-[16/10] md:aspect-auto md:h-full md:w-36"
              : "aspect-[16/10]",
          )}
        >
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes={compact ? "144px" : "(min-width: 1024px) 380px, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Source badge */}
          <span className="label-caps absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate bg-primary px-2 py-1 text-white shadow-[0_2px_8px_-2px_rgba(124,58,237,0.5)]">
            {article.sourceName}
          </span>
        </div>
      ) : (
        /* Gradient swatch fallback — no blank empty box */
        <div
          className={cn(
            "relative shrink-0 overflow-hidden",
            compact
              ? "aspect-[16/10] md:aspect-auto md:h-full md:w-36"
              : "aspect-[16/10]",
          )}
          style={{
            background:
              "linear-gradient(135deg, var(--primary-muted) 0%, rgba(124,58,237,0.04) 100%)",
          }}
        >
          {/* Large initial monogram */}
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center select-none font-serif text-5xl font-medium text-primary/10"
          >
            {article.sourceName.charAt(0)}
          </span>
          <span className="label-caps absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate bg-primary px-2 py-1 text-white shadow-[0_2px_8px_-2px_rgba(124,58,237,0.5)]">
            {article.sourceName}
          </span>
        </div>
      )}

      {/* ── Body ── */}
      <div className={cn("flex flex-1 flex-col p-5", compact && "md:p-4")}>
        <h3
          className={cn(
            "line-clamp-2 font-serif font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary",
            compact ? "text-base md:text-lg" : "text-xl",
          )}
        >
          {article.title}
        </h3>

        <p
          className={cn(
            "mt-2 text-sm leading-relaxed text-muted-foreground",
            descriptionClamp === 2 && "line-clamp-2",
            descriptionClamp === 3 && "line-clamp-3",
            descriptionClamp === 4 && "line-clamp-4",
            descriptionClamp === 5 && "line-clamp-5",
          )}
        >
          {article.description}
        </p>

        {/* ── Meta row ── always a single line, never wraps ── */}
        <div className="mt-auto flex items-center gap-3 pt-4">
          {/* Author — takes available space, truncates if long */}
          <span className="label-caps min-w-0 flex-1 truncate text-muted-foreground">
            {article.authorName}
          </span>

          {/* Date + read time — rigid, never wraps */}
          <span className="label-caps shrink-0 whitespace-nowrap text-muted-foreground/70">
            {formatDate(article.createdAt, "short")} · {article.timeToRead}m
          </span>
        </div>
      </div>
    </Link>
  );
}

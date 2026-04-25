import Link from "next/link";
import type { ArticleSummary } from "@/types/article";
import { cn, formatDate } from "@/lib/utils";

/**
 * The large featured card on the home page.
 *
 * Uses a rich purple/indigo gradient background (no image) so the card
 * looks crisp in both light and dark modes and white text is always
 * legible without any contrast hacks.
 */
export function FeaturedCard({
  article,
  className,
}: {
  article: ArticleSummary;
  className?: string;
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "group relative flex min-h-[420px] flex-col justify-end overflow-hidden border border-primary/20 p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_16px_64px_-16px_rgba(124,58,237,0.35)] md:min-h-[540px] md:p-10",
        className,
      )}
      style={{
        background:
          "linear-gradient(145deg, #1e1035 0%, #2d1660 40%, #160d3a 70%, #0d0824 100%)",
      }}
    >
      {/* Subtle noise-like radial glows for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(99,14,212,0.6) 0%, transparent 70%)" }}
      />

      {/* Bottom vignette so content never competes with the glows */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <div className="relative z-10 space-y-5 text-white">
        <span className="label-caps inline-block bg-primary px-3 py-1.5 text-white shadow-[0_4px_16px_-4px_rgba(124,58,237,0.6)]">
          Featured · {article.sourceName}
        </span>
        <h3 className="max-w-2xl font-serif text-3xl font-medium leading-tight tracking-tight md:text-5xl">
          {article.title}
        </h3>
        <p className="line-clamp-4 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
          {article.description}
        </p>
        <div className="flex items-center gap-3 border-t border-white/10 pt-5">
          <AuthorBadge name={article.authorName} />
          <div className="text-sm">
            <p className="font-medium text-white">{article.authorName}</p>
            <p className="text-xs text-white/50">
              {formatDate(article.createdAt)} · {article.timeToRead} min read
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function AuthorBadge({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 font-serif text-sm font-medium text-white backdrop-blur-md">
      {initials}
    </span>
  );
}

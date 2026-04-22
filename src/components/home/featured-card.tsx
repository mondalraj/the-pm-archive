import Link from "next/link";
import type { ArticleSummary } from "@/types/article";
import { cn, formatDate } from "@/lib/utils";
import { ArticleCover } from "@/components/ui/article-cover";

/**
 * The large, image-dominated card in the home grid. Category tag, full-
 * bleed cover, gradient overlay, headline, and a compact author strip.
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
        "group relative flex min-h-[420px] flex-col justify-end overflow-hidden border border-border bg-surface-elevated p-8 transition-all duration-500 hover:border-border-strong md:min-h-[540px] md:p-10",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10 opacity-90 transition-transform duration-700 group-hover:scale-[1.03]">
        <ArticleCover hueSeed={article.hueSeed} />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

      <div className="space-y-6 text-white">
        <span className="label-caps inline-block border border-white/30 bg-white/5 px-3 py-1.5 text-white/90 backdrop-blur-sm">
          Featured · {article.category}
        </span>
        <h3 className="max-w-2xl font-serif text-3xl font-medium leading-tight tracking-tight md:text-5xl">
          {article.title}
        </h3>
        {article.subtitle ? (
          <p
            className="max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
            dangerouslySetInnerHTML={{ __html: article.subtitle }}
          />
        ) : null}
        <div className="flex items-center gap-3 border-t border-white/15 pt-5">
          <AuthorBadge name={article.author.name} />
          <div className="text-sm">
            <p className="font-medium text-white">{article.author.name}</p>
            <p className="text-xs text-white/60">
              {formatDate(article.publishedAt)} · {article.readingTime} min read
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

import Link from "next/link";
import Image from "next/image";
import type { ArticleSummary } from "@/types/article";
import { cn, formatDate } from "@/lib/utils";

/**
 * The large, image-dominated card in the home grid.
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
      <Image
        src={article.imageUrl}
        alt={article.title}
        fill
        sizes="(min-width: 1024px) 720px, 100vw"
        className="-z-10 object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
        priority
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

      <div className="space-y-6 text-white">
        <span className="label-caps inline-block border border-white/30 bg-white/5 px-3 py-1.5 text-white/90 backdrop-blur-sm">
          Featured · {article.sourceName}
        </span>
        <h3 className="max-w-2xl font-serif text-3xl font-medium leading-tight tracking-tight md:text-5xl">
          {article.title}
        </h3>
        <p className="max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
          {article.description}
        </p>
        <div className="flex items-center gap-3 border-t border-white/15 pt-5">
          <AuthorBadge name={article.authorName} />
          <div className="text-sm">
            <p className="font-medium text-white">{article.authorName}</p>
            <p className="text-xs text-white/60">
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

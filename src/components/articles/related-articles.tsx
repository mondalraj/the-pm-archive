import Link from "next/link";
import type { ArticleSummary } from "@/types/article";
import { formatDate } from "@/lib/utils";
import { ArticleCover } from "@/components/ui/article-cover";

export function RelatedArticles({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-24 border-t border-border pt-16">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="label-caps mb-3 text-primary">Continued reading</p>
          <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
            More from the Archive
          </h2>
        </div>
        <Link
          href="/"
          className="label-caps hidden border-b border-border pb-1 text-muted-foreground transition-colors hover:text-primary md:inline-block"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group flex flex-col"
          >
            <div className="relative mb-5 aspect-[16/10] overflow-hidden border border-border">
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                <ArticleCover hueSeed={article.hueSeed} />
              </div>
            </div>
            <p className="label-caps mb-2 text-primary">{article.category}</p>
            <h3 className="font-serif text-xl font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
              {article.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {article.description}
            </p>
            <p className="label-caps mt-4 text-muted-foreground">
              {formatDate(article.publishedAt, "short")} · {article.readingTime}m
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

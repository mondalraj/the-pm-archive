import Link from "next/link";
import Image from "next/image";
import type { ArticleSummary } from "@/types/article";
import { formatDate } from "@/lib/utils";

export function RelatedArticles({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-24 border-t border-border pt-16">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="label-caps mb-3 text-primary">Continued reading</p>
          <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
            Keep your momentum
          </h2>
        </div>
        <Link
          href="/articles"
          className="label-caps hidden border-b border-border pb-1 text-muted-foreground transition-colors hover:text-primary md:inline-block"
        >
          Explore archive
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group flex flex-col rounded-lg border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_32px_-8px_rgba(124,58,237,0.10)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
              {article.imageUrl ? (
                <>
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(min-width: 1024px) 360px, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Radial purple gradient overlay */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-10 block"
                    style={{
                      background:
                        "radial-gradient(circle at 60% 40%, rgba(124,58,237,0.22) 0%, rgba(124,58,237,0.10) 60%, transparent 100%)",
                      mixBlendMode: "multiply",
                    }}
                  />
                  {/* Dark mode stronger gradient */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-10 hidden dark:block"
                    style={{
                      background:
                        "radial-gradient(circle at 60% 40%, rgba(124,58,237,0.32) 0%, rgba(124,58,237,0.18) 60%, transparent 100%)",
                      mixBlendMode: "screen",
                    }}
                  />
                </>
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center select-none font-serif text-5xl font-medium text-primary/10 bg-gradient-to-br from-primary/10 to-surface"
                >
                  {article.sourceName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="label-caps mb-2 text-primary">{article.sourceName}</p>
              <h3 className="font-serif text-xl font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                {article.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{article.description}</p>
              <p className="label-caps mt-4 text-muted-foreground">
                {formatDate(article.createdAt, "short")} · {article.timeToRead}m
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

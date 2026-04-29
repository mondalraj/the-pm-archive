import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/articles";
import { Container } from "@/components/ui/container";
import { ArticleHeader } from "@/components/articles/article-header";
import { ArticleBody } from "@/components/articles/article-body";
import { AuthorCard } from "@/components/articles/author-card";
import { RelatedArticles } from "@/components/articles/related-articles";
import { ReadingProgress } from "@/components/articles/reading-progress";

type RouteParams = { slug: string };

/**
 * ISR revalidates each article page in the background every hour.
 *
 * Build-time prerendering is intentionally capped to avoid exhausting
 * connection pools when many slugs are generated in parallel.
 *
 * Override with PRERENDER_ARTICLES_COUNT in CI if needed.
 */
export const dynamicParams = true;
export const revalidate = 3600;

const PRERENDER_ARTICLES_COUNT = Number.parseInt(
  process.env.PRERENDER_ARTICLES_COUNT ?? "12",
  10,
);

const getArticleBySlugCached = cache(getArticleBySlug);

export async function generateStaticParams(): Promise<RouteParams[]> {
  const slugs = await getAllArticleSlugs();
  const capped = Number.isFinite(PRERENDER_ARTICLES_COUNT)
    ? slugs.slice(0, Math.max(0, PRERENDER_ARTICLES_COUNT))
    : slugs;

  return capped.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlugCached(slug);
  if (!article) return buildMetadata({ title: "Article not found" });

  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/articles/${article.slug}`,
    type: "article",
    publishedTime: article.createdAt,
    authors: [article.authorName],
    tags: article.tags.map((t) => t.name),
    image: article.imageUrl,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlugCached(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug, 3);

  return (
    <>
      <ReadingProgress />
      <article>
        <ArticleHeader article={article} />

        <Container size="prose" className="py-16 md:py-24">
          <ArticleBody article={article} />

          {article.tags.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="label-caps rounded-full border border-border px-4 py-1.5 text-muted-foreground"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          ) : null}

          <AuthorCard name={article.authorName} />
        </Container>

        <Container size="wide">
          <RelatedArticles articles={related} />
        </Container>
      </article>
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/articles";
import { Container } from "@/components/ui/container";
import { ArticleHeader } from "@/components/articles/article-header";
import {
  ArticleBody,
  KeyTakeaways,
} from "@/components/articles/article-body";
import { AuthorCard } from "@/components/articles/author-card";
import { RelatedArticles } from "@/components/articles/related-articles";
import { ReadingProgress } from "@/components/articles/reading-progress";
import { NewsletterCta } from "@/components/newsletter/newsletter-cta";

type RouteParams = { slug: string };

/**
 * Pre-render every known article at build time (SSG). New articles added
 * after build will still render on-demand and then be cached.
 */
export async function generateStaticParams(): Promise<RouteParams[]> {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return buildMetadata({ title: "Article not found" });

  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/articles/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    authors: [article.author.name],
    tags: article.tags,
    image: article.coverImage,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug, 3);

  return (
    <>
      <ReadingProgress />
      <article>
        <ArticleHeader article={article} />

        <Container size="prose" className="py-16 md:py-24">
          {article.keyTakeaways && article.keyTakeaways.length > 0 ? (
            <KeyTakeaways items={article.keyTakeaways} />
          ) : null}

          <ArticleBody article={article} />

          {article.tags && article.tags.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="label-caps rounded-full border border-border px-4 py-1.5 text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <AuthorCard author={article.author} />
        </Container>

        <Container size="wide">
          <RelatedArticles articles={related} />
        </Container>
      </article>
      <NewsletterCta />
    </>
  );
}

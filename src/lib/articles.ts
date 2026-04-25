import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Article, ArticleSummary, ArticleTag } from "@/types/article";

/**
 * Data-access layer for articles. Pages and API routes import exclusively
 * from this module — no direct Prisma usage outside `src/lib`.
 *
 * Performance notes:
 *  - List queries `select` only the columns the UI actually renders, so we
 *    never ship `contentMarkdown` to listing pages.
 *  - Sorting by `createdAt DESC` is backed by `article_created_at_desc_idx`
 *    (no Sort node in the planner).
 *  - Detail lookup uses `findUnique({ where: { slug } })` so Prisma can
 *    batch concurrent calls via its dataloader.
 *  - Search relies on the `pg_trgm` GIN index on `article.title`.
 */

const summarySelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  imageUrl: true,
  sourceName: true,
  authorName: true,
  originalUrl: true,
  timeToRead: true,
  createdAt: true,
  updatedAt: true,
  tags: { select: { id: true, name: true } },
} satisfies Prisma.ArticleSelect;

const articleSelect = {
  ...summarySelect,
  contentMarkdown: true,
} satisfies Prisma.ArticleSelect;

type SummaryRow = Prisma.ArticleGetPayload<{ select: typeof summarySelect }>;
type ArticleRow = Prisma.ArticleGetPayload<{ select: typeof articleSelect }>;

function toSummary(row: SummaryRow): ArticleSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    imageUrl: row.imageUrl,
    sourceName: row.sourceName,
    authorName: row.authorName,
    originalUrl: row.originalUrl,
    timeToRead: row.timeToRead,
    tags: row.tags satisfies ArticleTag[],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toArticle(row: ArticleRow): Article {
  return {
    ...toSummary(row),
    contentMarkdown: row.contentMarkdown,
  };
}

export async function getAllArticles(): Promise<ArticleSummary[]> {
  const rows = await prisma.article.findMany({
    select: summarySelect,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toSummary);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const row = await prisma.article.findUnique({
    where: { slug },
    select: articleSelect,
  });
  return row ? toArticle(row) : null;
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const rows = await prisma.article.findMany({
    select: { slug: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => r.slug);
}

/**
 * Related articles: prefer those sharing tags with `slug`, then fall back
 * to most-recent. Two queries instead of one complex join so each plan is
 * trivially index-driven.
 */
export async function getRelatedArticles(
  slug: string,
  limit = 3,
): Promise<ArticleSummary[]> {
  const current = await prisma.article.findUnique({
    where: { slug },
    select: { id: true, tags: { select: { id: true } } },
  });

  const tagIds = current?.tags.map((t) => t.id) ?? [];

  const overlapping = tagIds.length
    ? await prisma.article.findMany({
        where: {
          slug: { not: slug },
          tags: { some: { id: { in: tagIds } } },
        },
        select: summarySelect,
        orderBy: { createdAt: "desc" },
        take: limit,
      })
    : [];

  if (overlapping.length >= limit) return overlapping.map(toSummary);

  const need = limit - overlapping.length;
  const excludeSlugs = [slug, ...overlapping.map((r) => r.slug)];
  const filler = await prisma.article.findMany({
    where: { slug: { notIn: excludeSlugs } },
    select: summarySelect,
    orderBy: { createdAt: "desc" },
    take: need,
  });

  return [...overlapping, ...filler].map(toSummary);
}

/** Substring search on `title`; uses the trigram GIN index. */
export async function searchArticles(
  query: string,
  limit = 24,
): Promise<ArticleSummary[]> {
  const q = query.trim();
  if (!q) return getAllArticles();

  const rows = await prisma.article.findMany({
    where: { title: { contains: q, mode: "insensitive" } },
    select: summarySelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toSummary);
}

export async function getAllTags(): Promise<ArticleTag[]> {
  return prisma.tag.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

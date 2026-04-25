/**
 * Domain types for articles.
 *
 * These mirror the `article` and `tag` tables (see prisma/schema.prisma)
 * with one deliberate adaptation: `createdAt`/`updatedAt` are serialised as
 * ISO strings before crossing the server -> client boundary so RSC payloads
 * stay JSON-safe. The data-access layer in `src/lib/articles.ts` performs
 * that conversion.
 */

export type ArticleTag = {
  id: number;
  name: string;
};

export type Article = {
  id: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  contentMarkdown: string;
  /** Source publication this article was summarised from (e.g. "Lenny's Newsletter"). */
  sourceName: string;
  authorName: string;
  originalUrl: string;
  /** Estimated reading time in minutes. */
  timeToRead: number;
  tags: ArticleTag[];
  /** ISO-8601 timestamp. */
  createdAt: string;
  /** ISO-8601 timestamp. */
  updatedAt: string;
};

/** Preview shape used on listings — omits the heavy markdown body. */
export type ArticleSummary = Omit<Article, "contentMarkdown">;

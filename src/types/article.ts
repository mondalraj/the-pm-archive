/**
 * Shape of an article/blog post. Kept intentionally minimal; extend as the
 * data source (MDX, CMS, DB) is chosen. Used by list, detail, SEO, sitemap.
 */
export type Author = {
  name: string;
  role?: string;
  bio?: string;
  /** Optional avatar URL; omit to render initials-on-gradient placeholder. */
  avatar?: string;
};

export type Article = {
  slug: string;
  title: string;
  /** Optional italic editorial subtitle rendered below the main headline. */
  subtitle?: string;
  description: string;
  /** Editorial grouping shown as an uppercase label (e.g. "Strategy"). */
  category: string;
  /** ISO-8601 publish date, e.g. "2026-04-22". */
  publishedAt: string;
  author: Author;
  /** Estimated reading time in minutes. */
  readingTime: number;
  tags?: string[];
  /** Optional remote image URL. If absent, a gradient placeholder is shown. */
  coverImage?: string;
  /** Deterministic seed (0–360) used to vary gradient placeholders per card. */
  hueSeed?: number;
  /** Featured articles render large on the home grid. */
  featured?: boolean;
  /** Optional key takeaways rendered in a callout box on the article page. */
  keyTakeaways?: string[];
  /** Body content as HTML (trusted, authored in-repo for now). */
  content: string;
};

/** Preview shape used on the home page and listing views. */
export type ArticleSummary = Omit<Article, "content">;

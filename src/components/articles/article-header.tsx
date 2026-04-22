import Link from "next/link";
import type { Article } from "@/types/article";
import { formatDate } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { ArticleCover } from "@/components/ui/article-cover";
import { Reveal } from "@/components/motion/reveal";

/**
 * Top of the article page: breadcrumbs, category, headline, subtitle,
 * author bar, and wide hero cover. Purely presentational; data comes in
 * from the route segment which already loaded the article.
 */
export function ArticleHeader({ article }: { article: Article }) {
  return (
    <Container size="wide" className="pt-12 md:pt-20">
      <nav aria-label="Breadcrumb" className="mb-10">
        <ol className="label-caps flex flex-wrap items-center gap-2 text-muted-foreground">
          <li>
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/" className="transition-colors hover:text-primary">
              Archive
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{article.category}</li>
        </ol>
      </nav>

      <p className="label-caps mb-5 text-primary">{article.category}</p>

      <Reveal immediate delay={0.05}>
        <h1 className="max-w-5xl font-serif text-[clamp(2.25rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-foreground">
          {article.title}
        </h1>
      </Reveal>

      {article.subtitle ? (
        <Reveal immediate delay={0.18}>
          <p
            className="mt-6 max-w-3xl font-serif text-xl italic leading-relaxed text-muted-foreground md:text-2xl"
            dangerouslySetInnerHTML={{ __html: article.subtitle }}
          />
        </Reveal>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-y border-border py-6">
        <div className="flex items-center gap-4">
          <AuthorAvatar name={article.author.name} />
          <div>
            <p className="font-medium text-foreground">{article.author.name}</p>
            <p className="text-sm text-muted-foreground">
              {article.author.role ? `${article.author.role} · ` : ""}
              {formatDate(article.publishedAt)}
            </p>
          </div>
        </div>
        <dl className="label-caps flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <ClockIcon />
            <span>{article.readingTime} min read</span>
          </div>
          {article.tags && article.tags.length > 0 ? (
            <div className="hidden items-center gap-2 sm:flex">
              <TagIcon />
              <span>{article.tags[0]}</span>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="mt-12 aspect-[21/9] w-full overflow-hidden border border-border">
        <ArticleCover hueSeed={article.hueSeed} category={article.category} />
      </div>
    </Container>
  );
}

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <span className="inline-flex size-12 items-center justify-center rounded-full border border-border-strong bg-surface-elevated font-serif text-base font-medium text-foreground">
      {initials}
    </span>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M20 12l-8 8-9-9V3h8l9 9z" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.25" />
    </svg>
  );
}

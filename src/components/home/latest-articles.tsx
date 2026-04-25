import Link from "next/link";
import type { ArticleSummary } from "@/types/article";
import { Container } from "@/components/ui/container";
import { FeaturedCard } from "@/components/home/featured-card";
import { StandardCard } from "@/components/home/standard-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

/**
 * The 2+1 editorial grid on the home page. Articles arrive sorted DESC
 * by createdAt from the data layer; the most recent renders large.
 */
export function LatestArticles({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) return null;

  const featured = articles[0];
  const rest = articles.slice(1, 5);

  return (
    <section id="latest" className="py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="label-caps mb-3 text-primary">The Archive</p>
              <h2 className="font-serif text-3xl font-medium tracking-tight md:text-5xl">
                Latest articles
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground md:text-lg">
                The biggest product and technology moves, broken down into
                practical ideas you can use this week.
              </p>
              <p className="label-caps mt-4 text-muted-foreground">
                Want weekly picks? <Link href="/#newsletter" className="text-primary hover:opacity-80">Subscribe for free</Link>
              </p>
            </div>
            <Link
              href="/articles"
              className="label-caps hidden items-center gap-2 border-b border-border pb-1 text-foreground transition-all hover:gap-3 hover:border-primary hover:text-primary md:inline-flex"
            >
              See all articles
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <StaggerItem className="md:col-span-2">
            <FeaturedCard article={featured} />
          </StaggerItem>
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {rest.slice(0, 2).map((article) => (
              <StaggerItem key={article.slug}>
                <StandardCard article={article} compact />
              </StaggerItem>
            ))}
          </div>
        </Stagger>

        {rest.length > 2 ? (
          <Stagger className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {rest.slice(2).map((article) => (
              <StaggerItem key={article.slug}>
                <StandardCard article={article} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : null}
      </Container>
    </section>
  );
}

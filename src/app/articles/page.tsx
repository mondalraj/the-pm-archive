import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getAllArticles } from "@/lib/articles";
import { Container } from "@/components/ui/container";
import { ArticlesList } from "@/components/articles/articles-list";
import { Reveal } from "@/components/motion/reveal";

export const metadata = buildMetadata({
  title: "Articles",
  description:
    "Browse every 5-minute article in The P.M. Archive on product, engineering, startup strategy, and growth execution.",
  path: "/articles",
});

/**
 * Revalidate every hour — serves the cached static page instantly and
 * rebuilds silently in the background.
 */
export const revalidate = 3600;

/**
 * /articles — the full article index. The server fetches everything once
 * and hands it to a client list component which paginates via
 * IntersectionObserver (so readers never see a pagination control).
 */
export default async function ArticlesIndexPage() {
  const articles = await getAllArticles();

  return (
    <Container className="py-16 md:py-24">
      <Reveal immediate>
        <header className="mb-14 max-w-3xl">
          <p className="label-caps mb-4 text-primary">The Archive</p>
          <h1 className="font-serif text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
            Every article, in one place.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">
            Fast, practical reads for teams shipping products in real markets.
            Scroll to keep exploring, or filter by topic from the{" "}
            <a
              href="/topics"
              className="underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
            >
              Topics
            </a>{" "}
            page.
          </p>
          <p className="label-caps mt-4 text-muted-foreground">
            Prefer the weekly version?{" "}
            <Link
              href="/#newsletter"
              className="text-primary transition-opacity hover:opacity-80"
            >
              Subscribe for free
            </Link>
          </p>
        </header>
      </Reveal>

      <ArticlesList articles={articles} pageSize={6} />
    </Container>
  );
}

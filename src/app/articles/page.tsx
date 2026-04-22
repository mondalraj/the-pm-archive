import { buildMetadata } from "@/lib/seo";
import { getAllArticles } from "@/lib/articles";
import { Container } from "@/components/ui/container";
import { ArticlesList } from "@/components/articles/articles-list";
import { Reveal } from "@/components/motion/reveal";

export const metadata = buildMetadata({
  title: "Articles",
  description:
    "Browse every article in The P.M. Archive — deep reads on product, strategy, growth, leadership, and engineering.",
  path: "/articles",
});

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
            Scroll to load more. Filter by topic from the{" "}
            <a
              href="/topics"
              className="underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
            >
              Topics
            </a>{" "}
            page.
          </p>
        </header>
      </Reveal>

      <ArticlesList articles={articles} pageSize={6} />
    </Container>
  );
}

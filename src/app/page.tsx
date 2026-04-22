import { buildMetadata } from "@/lib/seo";
import { getAllArticles } from "@/lib/articles";
import { Hero } from "@/components/home/hero";
import { LatestIssues } from "@/components/home/latest-issues";
import { NewsletterCta } from "@/components/newsletter/newsletter-cta";
import { Marquee } from "@/components/motion/marquee";

export const metadata = buildMetadata({ path: "/" });

/**
 * Home page. Server component — articles are fetched at build / request
 * time from the data layer, so the page is fully SSR-friendly and the
 * first paint is complete HTML with no client-side loading state.
 */
export default async function HomePage() {
  const articles = await getAllArticles();

  // Unique topic list for the slow marquee strip between sections.
  const fallbackTopics = [
    "Product",
    "Strategy",
    "Growth",
    "Leadership",
    "AI",
    "Engineering",
    "Design",
  ];
  const topics = Array.from(
    new Set([...articles.flatMap((a) => a.tags ?? []), ...fallbackTopics]),
  );

  return (
    <>
      <Hero />
      <LatestIssues articles={articles} />
      <section
        aria-hidden
        className="relative overflow-hidden border-y border-border py-10"
      >
        <Marquee items={topics} duration={80} />
      </section>
      <NewsletterCta />
    </>
  );
}

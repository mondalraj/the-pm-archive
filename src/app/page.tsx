import { buildMetadata } from "@/lib/seo";
import { getAllTags, getArticlesPage } from "@/lib/articles";
import { Hero } from "@/components/home/hero";
import { HowItWorksStrip } from "@/components/home/how-it-works-strip";
import { LatestArticles } from "@/components/home/latest-articles";
import { NewsletterCta } from "@/components/newsletter/newsletter-cta";
import { Marquee } from "@/components/motion/marquee";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

export const metadata = buildMetadata({ path: "/" });

/**
 * Revalidate every hour. Next.js serves the cached static page instantly
 * and silently rebuilds it in the background after 3600 s.
 */
export const revalidate = 3600;

/**
 * Home page. Server component — articles are fetched at request time
 * from the data-access layer (Prisma / Supabase Postgres).
 */
export default async function HomePage() {
  // SSR/SSG: Prefetch latest articles and tags for hydration
  const queryClient = new QueryClient();
  // Prefetch latest articles (limit 6)
  await queryClient.prefetchQuery({
    queryKey: ["latest-articles"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/articles?offset=0&limit=6`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data = await res.json();
      return data.articles;
    },
  });
  // Prefetch tags for the Marquee
  const tagRows = await getAllTags();
  const fallbackTopics = [
    "Product",
    "Strategy",
    "Growth",
    "Leadership",
    "Developer Tools",
    "Engineering",
    "Design",
  ];
  const topics = Array.from(new Set([...tagRows.map((t) => t.name), ...fallbackTopics]));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Hero />
      <HowItWorksStrip />
      <LatestArticles />
      <NewsletterCta />
      <section aria-hidden className="relative overflow-hidden border-y border-border py-10">
        <Marquee items={topics} duration={80} />
      </section>
    </HydrationBoundary>
  );
}

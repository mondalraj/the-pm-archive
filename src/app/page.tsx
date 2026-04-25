import { buildMetadata } from "@/lib/seo";
import { getAllArticles, getAllTags } from "@/lib/articles";
import { Hero } from "@/components/home/hero";
import { LatestArticles } from "@/components/home/latest-articles";
import { NewsletterCta } from "@/components/newsletter/newsletter-cta";
import { Marquee } from "@/components/motion/marquee";

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
  const [articles, tagRows] = await Promise.all([getAllArticles(), getAllTags()]);

  // Marquee strip: real tags from the DB, with a quiet fallback so the
  // page still feels alive when the archive is empty.
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
    <>
      <Hero />
      <LatestArticles articles={articles} />
      <NewsletterCta />
      <section aria-hidden className="relative overflow-hidden border-y border-border py-10">
        <Marquee items={topics} duration={80} />
      </section>
    </>
  );
}

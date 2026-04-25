import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getAllArticles, getAllTags } from "@/lib/articles";
import { Container } from "@/components/ui/container";
import { TopicsExplorer } from "@/components/topics/topics-explorer";
import { Reveal } from "@/components/motion/reveal";

export const metadata = buildMetadata({
  title: "Topics",
  description:
    "Explore topics across product, engineering, growth, and startup execution. Find the next 5-minute read for your current challenge.",
  path: "/topics",
});

/** Revalidate every hour. */
export const revalidate = 3600;

export default async function TopicsPage() {
  const [articles, tagRows] = await Promise.all([
    getAllArticles(),
    getAllTags(),
  ]);

  const tags = tagRows.map((t) => t.name).sort((a, b) => a.localeCompare(b));

  return (
    <Container className="py-16 md:py-24">
      <Reveal immediate>
        <header className="mb-14 max-w-3xl">
          <p className="label-caps mb-4 text-primary">Explore</p>
          <h1 className="font-serif text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
            Find articles by topic.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">
            Jump straight to what matters now - pricing, onboarding, retention,
            roadmap, shipping, and more. Filter instantly as you type.
          </p>
          <p className="label-caps mt-4 text-muted-foreground">
            Get top picks weekly: <Link href="/#newsletter" className="text-primary transition-opacity hover:opacity-80">Subscribe for free</Link>
          </p>
        </header>
      </Reveal>

      <TopicsExplorer articles={articles} tags={tags} />
    </Container>
  );
}

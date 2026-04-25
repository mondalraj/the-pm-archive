import { buildMetadata } from "@/lib/seo";
import { getAllArticles, getAllTags } from "@/lib/articles";
import { Container } from "@/components/ui/container";
import { TopicsExplorer } from "@/components/topics/topics-explorer";
import { Reveal } from "@/components/motion/reveal";

export const metadata = buildMetadata({
  title: "Topics",
  description:
    "Browse The P.M. Archive by topic. Search and filter articles by the subjects you care about.",
  path: "/topics",
});

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
            Search for a keyword or pick a topic. The archive filters in real
            time — no page reloads, no page numbers.
          </p>
        </header>
      </Reveal>

      <TopicsExplorer articles={articles} tags={tags} />
    </Container>
  );
}

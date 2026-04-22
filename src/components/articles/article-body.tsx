import type { Article } from "@/types/article";

/**
 * Renders the article's HTML body with editorial prose styles. The body
 * is authored in-repo today, so `dangerouslySetInnerHTML` is acceptable.
 * If the source is ever switched to user-generated input, sanitise first.
 */
export function ArticleBody({ article }: { article: Article }) {
  return (
    <div
      className="prose-editorial"
      dangerouslySetInnerHTML={{ __html: article.content }}
    />
  );
}

export function KeyTakeaways({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <aside className="my-10 border-l-2 border-primary bg-primary-muted p-6 md:p-8">
      <p className="label-caps mb-4 text-primary">Key takeaways</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-foreground md:text-lg">
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

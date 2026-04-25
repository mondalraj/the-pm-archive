import type { Article } from "@/types/article";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders the article body from Markdown (`contentMarkdown` in the
 * `newsletter` table). GitHub-flavoured Markdown is enabled. By default,
 * `react-markdown` does not render embedded HTML, which keeps the
 * pipeline safe even if content is later sourced from untrusted authors.
 */
export function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="prose-editorial">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {article.contentMarkdown}
      </ReactMarkdown>
    </div>
  );
}

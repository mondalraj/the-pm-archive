
import type { ArticleSummary } from "@/types/article";
import { useInfiniteQuery } from '@tanstack/react-query';

type ApiResponse = { articles: ArticleSummary[]; hasMore: boolean };

export function useInfiniteTopics({ tag, query, pageSize = 10 }: { tag: string | null, query: string, pageSize?: number }) {
  return useInfiniteQuery<ApiResponse, Error>({
    queryKey: ['topics', { tag, query }],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        offset: String(pageParam),
        limit: String(pageSize),
      });
      if (tag) params.set('tag', tag);
      if (query?.trim()) params.set('q', query.trim());
      const res = await fetch(`/api/articles?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch articles');
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.flatMap((p) => p.articles).length;
      return lastPage.hasMore ? totalLoaded : undefined;
    },
    keepPreviousData: true,
  });
}

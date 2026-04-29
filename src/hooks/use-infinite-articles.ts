import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfiniteArticles(pageSize: number) {
  return useInfiniteQuery({
    queryKey: ['articles'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/articles?offset=${pageParam}&limit=${pageSize}`);
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data = await res.json();
      return { articles: data.articles, nextOffset: pageParam + data.articles.length, hasMore: data.hasMore };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextOffset : undefined),
    staleTime: 1000 * 60 * 10,
  });
}

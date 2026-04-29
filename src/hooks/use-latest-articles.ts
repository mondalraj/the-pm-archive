import { useQuery } from '@tanstack/react-query';

export function useLatestArticles() {
  return useQuery({
    queryKey: ['latest-articles'],
    queryFn: async () => {
      const res = await fetch('/api/articles?offset=0&limit=6');
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data = await res.json();
      return data.articles;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

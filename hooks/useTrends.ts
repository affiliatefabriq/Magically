import api from '@/lib/api';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

/** Список трендов с пагинацией (для страницы /trends) */
export const useTrends = () =>
  useInfiniteQuery({
    queryKey: ['trends', 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get('/trends', {
        params: { page: pageParam, limit: 20 },
      });
      return res.data.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

export const useTrendsPreview = (limit = 8) =>
  useQuery({
    queryKey: ['trends', 'preview', limit],
    queryFn: async () => {
      const res = await api.get('/trends', { params: { page: 1, limit } });
      return res.data.data.trends as Trend[];
    },
  });

export const useTrend = (id: string) =>
  useQuery({
    queryKey: ['trends', id],
    queryFn: async () => {
      const res = await api.get(`/trends/${id}`);
      return res.data.data as Trend;
    },
    enabled: !!id,
  });

export interface Trend {
  id: string;
  content: string;
  coverText?: string;
  trendingCover?: string;
  trendingImageSet?: string[];
  adminId?: string;
  createdAt: string;
  updatedAt: string;
}

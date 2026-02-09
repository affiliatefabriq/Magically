import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import api from '@/lib/api';

export const useActiveGeneration = () => {
  return useQuery({
    queryKey: ['activeGeneration'],
    queryFn: async () => {
      const { data } = await api.get('/job/active');
      return data.data ?? null;
    },
    refetchInterval: 5000,
    staleTime: 0,
  });
};

export const useGenerationHistory = () => {
  return useQuery({
    queryKey: ['generationHistory'],
    queryFn: async () => {
      const { data } = await api.get('/job/history');
      return data.data;
    },
  });
};

export const useGenerationJob = (id: string) => {
  return useQuery({
    queryKey: ['generation', id],
    queryFn: async () => {
      const { data } = await api.get(`/job/jobs/${id}`);
      return data.data;
    },
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data?.status === 'pending' ? 2000 : false,
  });
};

export const usePublishJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await api.post(`/job/${jobId}/publish`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generationHistory'] });
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success('Опубликовано в ленту!');
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || 'Failed to publish'),
  });
};

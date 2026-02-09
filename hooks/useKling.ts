import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import api from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';

const generateKlingVideo = async (formData: FormData) => {
  const { data } = await api.post('/kling/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

const processKlingVideo = async (values: {
  publish: boolean;
  historyId: string;
}) => {
  const { data } = await api.post('/kling/process-video', values);
  return data;
};

export const useGenerateKlingVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateKlingVideo,
    onSuccess: (data) => {
      toast.success('Video generation started!');
      queryClient.invalidateQueries({ queryKey: queryKeys.history.all });
      return data;
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Generation failed');
    },
  });
};

export const useProcessKlingVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: processKlingVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.publications.all });
      toast.success('Video processed successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Processing failed');
    },
  });
};

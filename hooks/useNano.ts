import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import api from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';

const generateNanoImage = async (formData: FormData) => {
  const { data } = await api.post('/nano/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

const processNanoImage = async (values: {
  publish: boolean;
  historyId: string;
}) => {
  const { data } = await api.post('/nano/process-image', values);
  return data;
};

export const useGenerateNanoImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateNanoImage,
    onSuccess: (data) => {
      toast.success('Image generation started!');
      queryClient.invalidateQueries({ queryKey: queryKeys.history.all });
      return data;
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Generation failed');
    },
  });
};

export const useProcessNanoImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: processNanoImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.publications.all });
      toast.success('Image processed successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Processing failed');
    },
  });
};

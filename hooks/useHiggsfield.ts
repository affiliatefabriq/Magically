import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import api from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';

export interface HiggsMotion {
  id: string;
  name: string;
  media: {
    width: number;
    height: number;
    url: string;
    type: string;
  };
  priority: number;
  tags: string[];
  preset_family: string;
  cms_id: string | null;
  categories: string[];
  params: {
    steps: number;
    frames: number;
    strength: number;
    guide_scale: number;
  };
}

const getHiggsfieldMotions = async () => {
  const { data } = await api.get('/higgsfield/motions');
  return data.data.data.items;
};

const generateHiggsfieldVideo = async (formData: FormData) => {
  const { data } = await api.post('/higgsfield/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

const processHiggsfieldVideo = async (values: {
  publish: boolean;
  historyId: string;
}) => {
  const { data } = await api.post('/higgsfield/process-video', values);
  return data;
};

export const useHiggsfieldMotions = () => {
  return useQuery({
    queryKey: queryKeys.higgsfield.motions(),
    queryFn: getHiggsfieldMotions,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGenerateHiggsfieldVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateHiggsfieldVideo,
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

export const useProcessHiggsfieldVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: processHiggsfieldVideo,
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

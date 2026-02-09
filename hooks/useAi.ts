import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import axios from 'axios';

export interface AIModel {
  id: string;
  userId: string;
  name: string;
  description?: string;
  instruction?: string;
  imagePaths: string[];
  provider: 'unifically' | 'ttapi';
  createdAt: string;
}

export interface GenerateAIParams {
  prompt: string;
  modelId: string;
  publish: boolean;
  aspect_ratio?: string;
  width?: number;
  height?: number;
  seed?: number;
}

// API Functions
const getModels = async (): Promise<AIModel[]> => {
  const { data } = await api.get('/ai/models');
  return data.data;
};

const getModelById = async (id: string): Promise<AIModel> => {
  const { data } = await api.get(`/ai/models/${id}`);
  return data.data;
};

const createModel = async (formData: FormData) => {
  const { data } = await api.post('/ai/models', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

const updateModel = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  const { data } = await api.put(`/ai/models/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

const deleteModel = async (id: string) => {
  const { data } = await api.delete(`/ai/models/${id}`);
  return data;
};

const generateImage = async (params: GenerateAIParams) => {
  const { data } = await api.post('/ai/generate', params);
  return data;
};

// React Query Hooks
export const useAIModels = () => {
  return useQuery({
    queryKey: ['ai', 'models'],
    queryFn: getModels,
  });
};

export const useAIModel = (id: string) => {
  return useQuery({
    queryKey: ['ai', 'model', id],
    queryFn: () => getModelById(id),
    enabled: !!id,
    retry: 1,
  });
};

export const useCreateAIModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createModel,
    onSuccess: () => {
      toast.success('Model created successfully!');
      queryClient.invalidateQueries({ queryKey: ['ai', 'models'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create model');
    },
  });
};

export const useUpdateAIModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateModel,
    onSuccess: () => {
      toast.success('Model updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['ai', 'models'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update model');
    },
  });
};

export const useDeleteAIModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      toast.success('Model deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['ai', 'models'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete model');
    },
  });
};

export const useGenerateAI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateImage,
    onSuccess: () => {
      toast.success('Generation started!');
      queryClient.invalidateQueries({ queryKey: ['generationHistory'] });
      queryClient.invalidateQueries({ queryKey: ['activeGeneration'] });
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        // Получаем ошибку из response.data.errors или response.data.message
        const errorMsg =
          error.response?.data?.errors ||
          error.response?.data?.message ||
          'Generation error';

        // Проверяем на insufficient tokens
        if (errorMsg.toLowerCase().includes('insufficient')) {
          toast.error('Недостаточно токенов', {
            description: 'Для генерации нужно 15 токенов',
            duration: 4000,
          });
        } else {
          toast.error('Ошибка генерации', {
            description: errorMsg,
            duration: 4000,
          });
        }

        return;
      }

      toast.error('Неизвестная ошибка');
    }
  });
};
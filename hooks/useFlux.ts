import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";

export interface FluxModel {
  id: string;
  userId: string;
  name: string;
  description?: string;
  instruction?: string;
  imagePaths: string[];
  createdAt: string;
}

export interface GenerateFluxParams {
  prompt: string;
  modelId: string;
  publish: boolean;
  aspect_ratio?: string;
}

const getModels = async (): Promise<FluxModel[]> => {
  const { data } = await api.get("/flux/models");
  return data.data;
};

const getModelById = async (id: string): Promise<FluxModel> => {
  const { data } = await api.get(`/flux/models/${id}`);
  return data.data;
};

const createModel = async (formData: FormData) => {
  const { data } = await api.post("/flux/models", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const updateModel = async ({ id, formData }: { id: string; formData: FormData }) => {
  const { data } = await api.put(`/flux/models/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const deleteModel = async (id: string) => {
  const { data } = await api.delete(`/flux/models/${id}`);
  return data;
};

const generateImage = async (params: GenerateFluxParams) => {
  const { data } = await api.post("/flux/generate", params);
  return data;
};

// Hooks
export const useFluxModels = () => {
  return useQuery({
    queryKey: ["flux", "models"],
    queryFn: getModels,
  });
};

export const useFluxModel = (id: string) => {
  return useQuery({
    queryKey: ["flux", "model", id],
    queryFn: () => getModelById(id),
    enabled: !!id,
    retry: 1,
  });
};

export const useCreateFluxModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createModel,
    onSuccess: () => {
      toast.success("Flux Model created!");
      queryClient.invalidateQueries({ queryKey: ["flux", "models"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create model");
    },
  });
};

export const useUpdateFluxModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateModel,
    onSuccess: () => {
      toast.success("Flux Model updated!");
      queryClient.invalidateQueries({ queryKey: ["flux", "models"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update model");
    },
  });
};

export const useDeleteFluxModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      toast.success("Flux Model deleted!");
      queryClient.invalidateQueries({ queryKey: ["flux", "models"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete model");
    },
  });
};

export const useGenerateFluxImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateImage,
    onSuccess: () => {
      toast.success("Generation started!");
      queryClient.invalidateQueries({ queryKey: ["generationHistory"] });
      queryClient.invalidateQueries({ queryKey: ["activeGeneration"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Generation failed");
    },
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

export interface TtModel {
    id: string;
    userId: string;
    name: string;
    description?: string;
    imagePaths: string[];
    createdAt: string;
}

export interface GenerateTtParams {
    prompt: string;
    modelId: string;
    publish: boolean;
}

const getModels = async (): Promise<TtModel[]> => {
    const { data } = await api.get("/ttapi/models");
    return data.data;
};

const getModelById = async (id: string): Promise<TtModel> => {
    const { data } = await api.get(`/ttapi/models/${id}`);
    return data.data;
};

const createModel = async (formData: FormData) => {
    const { data } = await api.post("/ttapi/models", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

const updateModel = async ({ id, formData }: { id: string; formData: FormData }) => {
    const { data } = await api.put(`/ttapi/models/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

const deleteModel = async (id: string) => {
    const { data } = await api.delete(`/ttapi/models/${id}`);
    return data;
};

const generateImage = async (params: GenerateTtParams) => {
    const { data } = await api.post("/ttapi/generate", params);
    return data;
};

// Hooks
export const useTtModels = () => {
    return useQuery({
        queryKey: ["ttapi", "models"],
        queryFn: getModels,
    });
};

export const useTtModel = (id: string) => {
    return useQuery({
        queryKey: ["ttapi", "model", id],
        queryFn: () => getModelById(id),
        enabled: !!id,
        retry: 1,
    });
};

export const useCreateTtModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createModel,
        onSuccess: () => {
            toast.success("Model created successfully!");
            queryClient.invalidateQueries({ queryKey: ["ttapi", "models"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create model");
        },
    });
};

export const useUpdateTtModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateModel,
        onSuccess: () => {
            toast.success("Model updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["ttapi", "models"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update model");
        },
    });
};

export const useDeleteTtModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteModel,
        onSuccess: () => {
            toast.success("Model deleted!");
            queryClient.invalidateQueries({ queryKey: ["ttapi", "models"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete model");
        },
    });
};

export const useGenerateTtImage = () => {
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
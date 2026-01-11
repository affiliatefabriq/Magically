import api from "@/lib/api";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types
export interface TtModel {
    id: string;
    name: string;
    description?: string;
    imagePaths: string[];
}

// API Functions
const getModels = async () => {
    const { data } = await api.get("/ttapi/models");
    return data.data;
};

const createModel = async (formData: FormData) => {
    const { data } = await api.post("/ttapi/models", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

const deleteModel = async (modelId: string) => {
    const { data } = await api.delete(`/ttapi/models/${modelId}`);
    return data;
};

const generateImage = async (payload: { prompt: string; modelId: string; publish: boolean }) => {
    const { data } = await api.post("/ttapi/generate", payload);
    return data;
};

// Hooks
export const useTtModels = () => {
    return useQuery({
        queryKey: ["ttapi", "models"],
        queryFn: getModels,
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
        onError: (err: any) => toast.error(err.response?.data?.message || "Failed to create model"),
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
    });
};

export const useGenerateTtImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: generateImage,
        onSuccess: () => {
            toast.success("Generation started!");
            queryClient.invalidateQueries({ queryKey: ["history"] }); // Assuming standard query key
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Generation failed"),
    });
};
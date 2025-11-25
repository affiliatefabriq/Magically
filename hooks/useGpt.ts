import api from "@/lib/api";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const generateGptImage = async (formData: FormData) => {
    const { data } = await api.post("/gpt/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

const processGptImage = async (values: { publish: boolean; historyId: string }) => {
    const { data } = await api.post("/gpt/process-image", values);
    return data;
};

export const useGenerateGptImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: generateGptImage,
        onSuccess: (data) => {
            toast.success("Image generation started!");
            queryClient.invalidateQueries({ queryKey: queryKeys.history.all });
            return data;
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Generation failed");
        },
    });
};

export const useProcessGptImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: processGptImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.publications.all });
            toast.success("Image processed successfully!");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Processing failed");
        },
    });
};
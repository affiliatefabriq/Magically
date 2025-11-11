"use client";

import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const trainModel = async (formData: FormData) => {
    const { data } = await api.post("/replicate/train", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

const generateImage = async (values: { modelVersion: string; prompt: string }) => {
    const { data } = await api.post("/replicate/generate", values);
    return data;
};

const getMyModels = async () => {
    const { data } = await api.get("/auth/me");
    return data.data.user.replicateModels || [];
};

export const useTrainModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: trainModel,
        onSuccess: () => {
            toast.success("Training started!");
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Training failed");
        },
    });
};

export const useGenerateImage = () => {
    return useMutation({
        mutationFn: generateImage,
        onSuccess: () => {
            toast.success("Image generation started!");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Generation failed");
        },
    });
};

export const useMyModels = () => {
    return useQuery({
        queryKey: ["replicateModels"],
        queryFn: getMyModels,
    });
};

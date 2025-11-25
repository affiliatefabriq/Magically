import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface HistoryItem {
    id: string;
    userId: string;
    service: "kling" | "higgsfield" | "gpt" | "nano" | "replicate";
    serviceTaskId?: string;
    status: "pending" | "processing" | "completed" | "failed";
    resultUrl?: string;
    prompt?: string;
    tokensSpent: number;
    errorMessage?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

const getHistory = async (page: number = 1, limit: number = 20) => {
    const { data } = await api.get("/history", { params: { page, limit } });
    return data.data;
};

const getHistoryById = async (historyId: string) => {
    const { data } = await api.get(`/history/${historyId}`);
    return data.data;
};

export const useHistory = (page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: queryKeys.history.list(page, limit),
        queryFn: () => getHistory(page, limit),
    });
};

export const useHistoryItem = (historyId: string) => {
    return useQuery({
        queryKey: queryKeys.history.detail(historyId),
        queryFn: () => getHistoryById(historyId),
        enabled: !!historyId,
    });
};
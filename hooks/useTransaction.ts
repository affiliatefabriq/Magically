import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

const getTransactions = async (page = 1, limit = 20) => {
    const { data } = await api.get("/transaction", { params: { page, limit } });
    return data.data; // { count, rows }
};

export const useTransactions = (page: number, limit: number) => {
    return useQuery({
        queryKey: ["transactions", page, limit],
        queryFn: () => getTransactions(page, limit),
        staleTime: 60000,
    });
};
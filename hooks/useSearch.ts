import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { UserAttributes } from "@/types";

// --- API Functions ---
const searchAll = async (params: { query?: string; type?: string; sortBy?: string; hashtag?: string }) => {
  const { data } = await api.get("/search", { params });
  return data.data;
};

const getRecommendedUsers = async (limit: number = 10): Promise<UserAttributes[]> => {
  const { data } = await api.get("/users/users/recommendations", {
    params: { limit },
  });
  return data.data;
};

// --- Hooks ---
export const useSearch = (params: { query?: string; type?: string; sortBy?: string; hashtag?: string }) => {
  return useQuery({
    queryKey: queryKeys.search.query(params),
    queryFn: () => searchAll(params),
    enabled: !!params.query || !!params.hashtag,
  });
};

export const useRecommendedUsers = (enabled: boolean = true, limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.recommendations.users(limit),
    queryFn: () => getRecommendedUsers(limit),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

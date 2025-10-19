import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

// --- API Functions ---
const searchAll = async (params: { query?: string; type?: string; sortBy?: string; hashtag?: string }) => {
  const { data } = await api.get("/search", { params });
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

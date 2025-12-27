import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useActiveGeneration = () => {
  return useQuery({
    queryKey: ["activeGeneration"],
    queryFn: async () => {
      const { data } = await api.get("/job/active");
      return data.data;
    },
    refetchInterval: 5000,
  });
};

export const useGenerationHistory = () => {
  return useQuery({
    queryKey: ["generationHistory"],
    queryFn: async () => {
      const { data } = await api.get("/job/history");
      return data.data;
    },
  });
};

export const useGenerationJob = (id: string) => {
  return useQuery({
    queryKey: ["generation", id],
    queryFn: async () => {
      const { data } = await api.get(`/job/jobs/${id}`);
      return data.data;
    },
    enabled: !!id,
    refetchInterval: (query) => (query.state.data?.status === "pending" ? 2000 : false),
  });
};
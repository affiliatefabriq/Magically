import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { Publication } from "@/types";

interface PublicationsPage {
  publications: Publication[];
  nextPage?: number;
}

// API Functions
const getPublications = async ({ pageParam = 1, filters = {} }): Promise<PublicationsPage> => {
  const { data } = await api.get("/publications", {
    params: { page: pageParam, limit: 10, ...filters },
  });
  return data.data;
};

const getPublicationById = async (id: string) => {
  const { data } = await api.get(`/publications/${id}`);
  return data.data;
};

const likePublication = async (id: string) => {
  const { data } = await api.post(`/publications/${id}/like`);
  return data;
};

const unlikePublication = async (id: string) => {
  const { data } = await api.delete(`/publications/${id}/unlike`);
  return data;
};

const updatePublication = async ({ publicationId, content }: { publicationId: string; content: string }) => {
  const { data } = await api.put(`/publications/${publicationId}`, { content });
  return data;
};

const deletePublication = async (publicationId: string) => {
  const { data } = await api.delete(`/publications/${publicationId}`);
  return data;
};

// Hooks
export const usePublications = (filters: { sortBy?: string; hashtag?: string } = {}) => {
  return useInfiniteQuery<PublicationsPage, Error>({
    queryKey: queryKeys.publications.list(filters),
    queryFn: ({ pageParam }) => getPublications({ pageParam: pageParam as number, filters }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};

export const usePublication = (id: string) => {
  return useQuery({
    queryKey: queryKeys.publications.detail(id),
    queryFn: () => getPublicationById(id),
    enabled: !!id,
  });
};

export const useLikePublication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePublication,

    onSuccess: (_data, publicationId) => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      queryClient.invalidateQueries({ queryKey: ["publication", publicationId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};


export const useUnlikePublication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlikePublication,

    onSuccess: (_data, publicationId) => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      queryClient.invalidateQueries({ queryKey: ["publication", publicationId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};


export const useUpdatePublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePublication,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.publications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.publications.detail(data.publication.id) });
      toast.success("Publication updated!");
    },
  });
};

export const useDeletePublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.publications.all });
      toast.success("Publication deleted.");
    },
  });
};

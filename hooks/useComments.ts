import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

// --- API Functions for comment routes ---
const getComments = async (publicationId: string) => {
  const { data } = await api.get(`/comments/${publicationId}/comments`);
  return data.data;
};

const createComment = async ({ publicationId, text }: { publicationId: string; text: string }) => {
  const { data } = await api.post(`/comments/${publicationId}/comments`, { text });
  return data;
};

const replyToComment = async ({ commentId, text }: { commentId: string; text: string }) => {
  const { data } = await api.post(`/comments/${commentId}/reply`, { text });
  return data;
};

const deleteComment = async (commentId: string) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};

const likeComment = async (commentId: string) => {
  const { data } = await api.post(`/comments/${commentId}/like`);
  return data;
};

const unlikeComment = async (commentId: string) => {
  const { data } = await api.delete(`/comments/${commentId}/unlike`);
};

// --- Hooks ---
export const useComments = (publicationId: string) => {
  return useQuery({
    queryKey: queryKeys.comments.list(publicationId),
    queryFn: () => getComments(publicationId),
    enabled: !!publicationId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (data, { publicationId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(publicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.publications.detail(publicationId) });
      toast.success("Comment posted!");
    },
  });
};

export const useReplyToComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: replyToComment,
    onSuccess: (data) => {
      // Invalidate all comments for the publication as we don't know the parent pubId easily
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
      toast.success("Reply posted!");
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.publications.all });
      toast.success("Comment deleted.");
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
    },
  });
};

export const useUnlikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unlikeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
    },
  });
};

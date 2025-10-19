import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

// --- API Functions for /users routes ---
const getProfile = async (username: string) => {
  const { data } = await api.get(`/users/${username}`);
  return data.data;
};

const getMyProfile = async () => {
  const { data } = await api.get(`/users/me/profile`);
  return data.data;
};

const getMyFollowing = async () => {
  const { data } = await api.get("/users/me/profile/following");
  return data.data;
};

const getMyFollowers = async () => {
  const { data } = await api.get("/users/me/profile/followers");
  return data.data;
};

const getUserFollowing = async (username: string) => {
  const { data } = await api.get(`/users/${username}/following`);
  return data.data;
};

const getUserFollowers = async (username: string) => {
  const { data } = await api.get(`/users/${username}/followers`);
  return data.data;
};

const subscribe = async (userId: string) => {
  const { data } = await api.post(`/users/${userId}/subscribe`);
  return data;
};

const unsubscribe = async (userId: string) => {
  const { data } = await api.delete(`/users/${userId}/unsubscribe`);
  return data;
};

const updateProfile = async (formData: { fullname?: string; bio?: string }) => {
  const { data } = await api.put("/users/me/profile", formData);
  return data;
};

const updateAvatar = async (formData: FormData) => {
  const { data } = await api.put("/users/me/avatar", formData);
  return data;
};

// --- Hooks ---
export const useProfile = (username: string) => {
  return useQuery({
    queryKey: queryKeys.users.profile(username),
    queryFn: () => getProfile(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: queryKeys.users.profile("me"),
    queryFn: getMyProfile,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMyFollowing = () => {
  return useQuery({
    queryKey: queryKeys.users.following("me"),
    queryFn: getMyFollowing,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMyFollowers = () => {
  return useQuery({
    queryKey: queryKeys.users.followers("me"),
    queryFn: getMyFollowers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserFollowing = (username: string) => {
  return useQuery({
    queryKey: queryKeys.users.following(username),
    queryFn: () => getUserFollowing(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserFollowers = (username: string) => {
  return useQuery({
    queryKey: queryKeys.users.followers(username),
    queryFn: () => getUserFollowers(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubscribe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.search.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.publications.all });
    },
  });
};

export const useUnsubscribe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unsubscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.search.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.publications.all });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile("me") });
      toast.success("Profile updated!");
    },
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile("me") });
      toast.success("Avatar updated!");
    },
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import {
  EmailFormValues,
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterDetailsFormValues,
  ResetPasswordFormValues,
} from "@/lib/validation";
import { UserAttributes } from "@/types";

// --- API Functions ---
const getMe = async (): Promise<UserAttributes> => {
  const { data } = await api.get("/auth/me");
  return data.data.user;
};

const login = async (credentials: LoginFormValues) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

const logout = async () => {
  return api.post("/auth/logout");
};

const requestOtp = async (values: EmailFormValues) => {
  const { data } = await api.post("/auth/register-step-1", values);
  return data;
};

const verifyOtp = async (values: { email: string; otp: string }) => {
  const { data } = await api.post("/auth/register-step-2", values);
  return data;
};

const completeRegistration = async (values: RegisterDetailsFormValues & { email: string }) => {
  const { data } = await api.post("/auth/register-step-3", values);
  return data;
};

const forgotPassword = async (values: ForgotPasswordFormValues) => {
  const { data } = await api.post("/auth/forgot-password", values);
  return data;
};

const resetPassword = async ({ token, values }: { token: string; values: ResetPasswordFormValues }) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, { password: values.password });
  return data;
};

// --- Hooks ---
export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getMe,
    retry: 1, // Only retry once if the user is not logged in
    staleTime: Infinity, // User data is stable
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me(), data.data.user);
      toast.success("Login successful!");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.me(), null);
      queryClient.clear(); // Clear all caches on logout
      window.location.href = "/login";
    },
  });
};

export const useRequestOtp = () => useMutation({ mutationFn: requestOtp });
export const useVerifyOtp = () => useMutation({ mutationFn: verifyOtp });
export const useCompleteRegistration = () =>
  useMutation({
    mutationFn: completeRegistration,
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
    },
  });
export const useForgotPassword = () => useMutation({ mutationFn: forgotPassword });
export const useResetPassword = () => useMutation({ mutationFn: resetPassword });

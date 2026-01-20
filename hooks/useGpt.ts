import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

const generateGptImage = async (formData: FormData) => {
  const { data } = await api.post("/gpt/generate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 900000,
  });
  return data;
};

export const useGenerateGptImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateGptImage,
    onSuccess: (data) => {
      toast.success("Image generated and saved!");
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.publications.all });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      return data;
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Generation failed");
    },
  });
};

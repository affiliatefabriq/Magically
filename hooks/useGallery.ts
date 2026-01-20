import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { GalleryItem } from "@/types";

// API Function with filters
const getMyGallery = async (filters: {
  sortBy?: string;
  searchQuery?: string;
  date?: string;
}): Promise<GalleryItem[]> => {
  const { data } = await api.get("/gallery", { params: filters });
  return data.data;
};

// Hook with filters
export const useGallery = (filters: { sortBy?: string; searchQuery?: string; date?: string } = {}) => {
  return useQuery({
    queryKey: queryKeys.gallery.list(filters),
    queryFn: () => getMyGallery(filters),
  });
};

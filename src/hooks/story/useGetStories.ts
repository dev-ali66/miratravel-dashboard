import { useQuery } from "@tanstack/react-query";
import { apiPrivate as api } from "@/lib/api-client";
import type { Story } from "@/components/pages/Stories/storyTypes";

export function useGetStories(params?: { category?: string; slug?: string }) {
  return useQuery({
    queryKey: ["stories", params],
    queryFn: async () => {
      const res = await api.get<{ data: Story[] }>("/stories", { params });
      return res.data;
    },
  });
}

export function useGetStoryById(id?: string) {
  return useQuery({
    queryKey: ["stories", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<{ data: Story }>(`/stories`, { params: { id } });
      return res.data;
    },
    enabled: !!id,
  });
}

import { useQuery } from "@tanstack/react-query";
import { apiPrivate as api } from "@/lib/api-client";
import type { Story } from "./storyTypes";

export type StoryQueryParams = {
  page?: number
  limit?: number
  search?: string
  type?: string
  status?: string
  category?: string
  featured?: boolean
  recommended?: boolean
  slug?: string
}

export type GetStoriesResponse = {
  success: boolean
  message: string
  code: number
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: Story[]
}

export function useGetStories(params: StoryQueryParams = {}) {
  const {
    page,
    limit,
    search,
    type,
    status,
    category,
    featured,
    recommended,
    slug,
  } = params

  return useQuery({
    queryKey: [
      "stories",
      page,
      limit,
      search,
      type,
      status,
      category,
      featured,
      recommended,
      slug,
    ],
    queryFn: async () => {
      const res = await api.get<GetStoriesResponse>("/stories", {
        params: {
          ...(page ? { page } : {}),
          ...(limit ? { limit } : {}),
          ...(search ? { search } : {}),
          ...(type ? { type } : {}),
          ...(status ? { status } : {}),
          ...(category ? { category } : {}),
          ...(featured !== undefined ? { featured: String(featured) } : {}),
          ...(recommended !== undefined ? { recommended: String(recommended) } : {}),
          ...(slug ? { slug } : {}),
        },
      });
      return res.data;
    },
    placeholderData: slug ? undefined : (previous) => previous,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export function useGetStoryById(id?: string) {
  return useQuery({
    queryKey: ["stories", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<{ data: Story | Story[] }>(`/stories`, { params: { id } });
      const rawData = res.data?.data;
      const singleStory = Array.isArray(rawData) ? rawData[0] || null : rawData;
      return {
        ...res.data,
        data: singleStory,
      };
    },
    enabled: !!id,
  });
}



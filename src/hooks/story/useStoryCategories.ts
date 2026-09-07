import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate as api } from "@/lib/api-client"

export interface StoryCategoryItem {
  id: string
  name: string
  slug: string
}

export function useGetStoryCategories(search?: string) {
  return useQuery({
    queryKey: ["story-categories", search],
    queryFn: async () => {
      const res = await api.get<{
        success: boolean
        data: StoryCategoryItem[]
      }>("/story-categories", {
        params: search ? { search } : undefined,
      })
      return res.data
    },
  })
}

export function useCreateStoryCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post<{
        success: boolean
        data: StoryCategoryItem
        message: string
      }>("/story-categories", { name })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-categories"] })
    },
  })
}

export function useDeleteStoryCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<{
        success: boolean
        message: string
      }>(`/story-categories/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-categories"] })
    },
  })
}

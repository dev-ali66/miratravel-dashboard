import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate as api } from "@/lib/api-client"

export interface StoryTypeItem {
  id: string
  name: string
  slug: string
}

export function useGetStoryTypes(search?: string) {
  return useQuery({
    queryKey: ["story-types", search],
    queryFn: async () => {
      const res = await api.get<{
        success: boolean
        data: StoryTypeItem[]
      }>("/story-types", {
        params: search ? { search } : undefined,
      })
      return res.data
    },
  })
}

export function useCreateStoryType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post<{
        success: boolean
        data: StoryTypeItem
        message: string
      }>("/story-types", { name })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-types"] })
    },
  })
}

export function useDeleteStoryType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<{
        success: boolean
        message: string
      }>(`/story-types/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-types"] })
    },
  })
}

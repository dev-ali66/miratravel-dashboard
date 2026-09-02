import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error"
import { toast } from "sonner"

type CreatePagePayload = {
  name: string
  slug: string
}

type CreatePageResponse = {
  success: boolean
  message: string
  data: any
}

export function useCreatePage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreatePagePayload) => {
      const res = await apiPrivate.post<CreatePageResponse>("/pages/", payload)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success !== false) {
        toast.success(res.message || "Page created successfully!")
        queryClient.invalidateQueries({ queryKey: ["pages"] })
      } else {
        toast.error(res.message || "Failed to create page")
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

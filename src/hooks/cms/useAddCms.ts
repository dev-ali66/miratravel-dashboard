import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error"
import { toast } from "sonner"

export type AddCmsPayload = {
  id?: string
  name?: string
  slug: string
  metadata?: Record<string, any>
  data: Record<string, any>
}

export type AddCmsResponse = {
  success: boolean
  message: string
  code: number
  meta: any | null
  data: any
}

export function useAddCms() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddCmsPayload) => {
      const res = await apiPrivate.post<AddCmsResponse>("/cms-pages", payload)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success !== false) {
        toast.success(res.message || "CMS added successfully!")
        queryClient.invalidateQueries({ queryKey: ["cms"] })
      } else {
        toast.error(res.message || "Failed to add CMS")
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error"
import { toast } from "sonner"

export function useDeleteExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string | string[]) => {
      const response = await apiPrivate.delete("/experiences", {
        data: {
          id: Array.isArray(id) ? id : [id],
        },
      })
      return response.data
    },

    onSuccess: (response) => {
      if (response?.success !== false) {
        toast.success(response?.message || "Experience deleted successfully.")
        queryClient.invalidateQueries({
          queryKey: ["experience-pages"],
          refetchType: "all",
        })
        queryClient.invalidateQueries({
          queryKey: ["experiences"],
          refetchType: "all",
        })
      } else {
        toast.error(response?.message || "Failed to delete experience.")
      }
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

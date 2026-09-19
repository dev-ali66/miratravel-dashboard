import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error"
import { toast } from "sonner"

export function useDeleteJourney() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiPrivate.delete("/journeys", {
        data: { id },
      })
      return response.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["journeys"],
        refetchType: "all",
      })
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

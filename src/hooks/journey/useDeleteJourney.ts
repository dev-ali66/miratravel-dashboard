import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

type DeleteJourneyResponse = {
  success: boolean
  message: string
  code: number
  data: any
}

export function useDeleteJourney() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiPrivate.delete<DeleteJourneyResponse>("/journeys", {
        data: { id },
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] })
      queryClient.invalidateQueries({ queryKey: ["journey"] })
    },
  })
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error"
import { toast } from "sonner"
import type { JourneyData } from "@/components/pages/Journey/journeyTypes"

export type AddJourneyPayload = Partial<JourneyData> & {
  id?: string
}

export type AddJourneyResponse = {
  success: boolean
  message: string
  code: number
  meta: any | null
  data: any
}

export function useAddJourney() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddJourneyPayload) => {
      const response = await apiPrivate.post<AddJourneyResponse>(
        "/journeys",
        payload
      )
      return response.data
    },

    onSuccess: (response) => {
      if (response.success !== false) {
        toast.success(response.message || "Journey saved successfully!")

        queryClient.invalidateQueries({
          queryKey: ["journeys"],
          refetchType: "all",
        })

        queryClient.invalidateQueries({
          queryKey: ["journey"],
          refetchType: "all",
        })
      } else {
        toast.error(response.message || "Failed to save journey")
      }
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

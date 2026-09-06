import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api-error"
import type { Journey } from "@/components/pages/Journeys/journeyTypes"
import { normalizeJourneyPayload } from "@/components/pages/Journeys/shared/normalizeJourneyPayload"

type SaveJourneyResponse = {
  success: boolean
  message: string
  code: number
  data: Journey
}

export function useSaveJourney() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (draft: Journey) => {
      const normalizedPayload = normalizeJourneyPayload(draft)
      const res = await apiPrivate.post<SaveJourneyResponse>("/journeys", normalizedPayload)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success !== false) {
        toast.success(res.message || "Journey saved successfully!")
        queryClient.invalidateQueries({ queryKey: ["journeys"] })
        queryClient.invalidateQueries({ queryKey: ["journey"] })
      } else {
        toast.error(res.message || "Failed to save journey")
      }
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err))
    },
  })
}

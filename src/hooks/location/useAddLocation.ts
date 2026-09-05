import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiPrivate } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error"
import { toast } from "sonner"
import type { LocationData } from "@/components/pages/Location/locationTypes"

export type AddLocationPayload = Partial<LocationData> & {
  data: LocationData["data"]
}

export type AddLocationResponse = {
  success: boolean
  message: string
  code: number
  meta: any | null
  data: any
}

export function useAddLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddLocationPayload) => {
      const response = await apiPrivate.post<AddLocationResponse>(
        "/locations",
        payload
      )

      return response.data
    },

    onSuccess: (response) => {
      if (response.success !== false) {
        toast.success(response.message || "Location saved successfully!")

        queryClient.invalidateQueries({
          queryKey: ["location-pages"],
        })

        queryClient.invalidateQueries({
          queryKey: ["locations"],
        })

        queryClient.invalidateQueries({
          queryKey: ["location"],
        })
      } else {
        toast.error(response.message || "Failed to save location")
      }
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

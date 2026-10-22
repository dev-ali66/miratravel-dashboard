import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error"
import { toast } from "sonner"
import type { ExperienceData } from "@/components/pages/Experience/experienceTypes"

export type AddExperiencePayload = Partial<ExperienceData>

export type AddExperienceResponse = {
  success: boolean
  message: string
  code: number
  meta: any | null
  data: any
}

export function useAddExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddExperiencePayload) => {
      const response = await apiPrivate.post<AddExperienceResponse>(
        "/experiences",
        payload
      )
      return response.data
    },

    onSuccess: (response) => {
      if (response.success !== false) {
        toast.success(response.message || "Experience saved successfully!")

        queryClient.invalidateQueries({
          queryKey: ["experience-pages"],
          refetchType: "all",
        })

        queryClient.invalidateQueries({
          queryKey: ["experiences"],
          refetchType: "all",
        })

        queryClient.invalidateQueries({
          queryKey: ["experience"],
          refetchType: "all",
        })

        queryClient.refetchQueries({
          queryKey: ["experience-pages"],
        })
      } else {
        toast.error(response.message || "Failed to save experience")
      }
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

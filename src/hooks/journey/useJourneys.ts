import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"
import type { JourneyData, PaginatedJourneysResponse } from "./journeyTypes"

export const JOURNEYS_QUERY_KEY = "journeys"

// GET ALL JOURNEYS
export const useGetJourneys = (page = 1, limit = 10, search?: string, status?: string) => {
  return useQuery({
    queryKey: [JOURNEYS_QUERY_KEY, page, limit, search, status],
    queryFn: async (): Promise<PaginatedJourneysResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (search) params.append("search", search)
      if (status && status !== "ALL") params.append("status", status)

      // Fallback/mock since we might not have the endpoint fully ready yet
      // You can remove the try/catch mock once the backend `/journeys` GET is confirmed working.
      try {
        const response = await apiPrivate.get(`/journeys?${params.toString()}`)
        return response.data
      } catch (error) {
        console.warn("Journeys endpoint failed, returning empty fallback.")
        return {
          data: [],
          meta: {
            total: 0,
            page,
            limit,
            totalPages: 1,
          },
        }
      }
    },
  })
}

// GET JOURNEY BY ID
export const useGetJourneyById = (id: string) => {
  return useQuery({
    queryKey: [JOURNEYS_QUERY_KEY, id],
    queryFn: async (): Promise<JourneyData> => {
      const response = await apiPrivate.get(`/journeys/${id}`)
      return response.data?.data || response.data
    },
    enabled: !!id && id !== "new",
  })
}

// CREATE OR UPDATE JOURNEY
export const useSaveJourney = (isEditing: boolean) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Partial<JourneyData>) => {
      if (isEditing && payload.id) {
        const response = await apiPrivate.patch(`/journeys/${payload.id}`, payload)
        return response.data
      } else {
        const response = await apiPrivate.post(`/journeys`, payload)
        return response.data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNEYS_QUERY_KEY] })
      toast.success(isEditing ? "Journey updated successfully" : "Journey created successfully")
    },
    onError: (error: any) => {
      console.error("Failed to save journey:", error)
      toast.error(error?.response?.data?.message || "Failed to save journey")
    },
  })
}

// DELETE JOURNEY
export const useDeleteJourney = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiPrivate.delete(`/journeys/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNEYS_QUERY_KEY] })
      toast.success("Journey deleted successfully")
    },
    onError: (error: any) => {
      console.error("Failed to delete journey:", error)
      toast.error(error?.response?.data?.message || "Failed to delete journey")
    },
  })
}

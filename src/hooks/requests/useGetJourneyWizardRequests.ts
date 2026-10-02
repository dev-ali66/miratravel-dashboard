import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type JourneyWizardRequestItem = {
  id: string
  journeyTypes: string[]
  travelStyles: string[]
  perfectFor: string[]
  pace: string | null
  comfortLevel: string | null
  duration: string | null
  budget: number | null
  budgetText: string | null
  name: string | null
  email: string | null
  phone: string | null
  notes: string | null
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "CLOSED"
  createdAt: string
  updatedAt: string
}

export type GetJourneyWizardRequestsResponse = {
  success: boolean
  data: {
    items: JourneyWizardRequestItem[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export function useGetJourneyWizardRequests(
  page: number = 1,
  limit: number = 20,
  status?: string
) {
  return useQuery({
    queryKey: ["journey-wizard-requests", page, limit, status],
    queryFn: async () => {
      const res = await apiPrivate.get<GetJourneyWizardRequestsResponse>(
        "/journey-wizard",
        {
          params: {
            page,
            limit,
            ...(status ? { status } : {}),
          },
        }
      )
      return res.data
    },
  })
}

export function useUpdateJourneyWizardRequestStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: string
      status: string
      notes?: string
    }) => {
      const res = await apiPrivate.patch(`/journey-wizard/${id}`, { status, notes })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey-wizard-requests"] })
    },
  })
}

export function useDeleteJourneyWizardRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiPrivate.delete(`/journey-wizard/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey-wizard-requests"] })
    },
  })
}

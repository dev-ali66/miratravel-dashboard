import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import type { Journey, JourneyStatus, JourneyType } from "@/components/pages/Journeys/journeyTypes"

export type JourneyQueryParams = {
  page?: number
  limit?: number
  search?: string
  status?: JourneyStatus | ""
  journeyType?: JourneyType | ""
  featured?: boolean
}

type GetJourneysResponse = {
  success: boolean
  message: string
  code: number
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: Journey[]
}

export function useGetJourneys(params: JourneyQueryParams = {}) {
  const { page = 1, limit = 10, search, status, journeyType, featured } = params

  return useQuery({
    queryKey: ["journeys", page, limit, search, status, journeyType, featured],
    queryFn: async () => {
      const res = await apiPrivate.get<GetJourneysResponse>("/journeys", {
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
          ...(journeyType ? { journeyType } : {}),
          ...(featured !== undefined ? { featured } : {}),
        },
      })
      return res.data
    },
    placeholderData: (previous) => previous,
  })
}

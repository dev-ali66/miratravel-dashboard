import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import type { JourneyData } from "@/components/pages/Journey/journeyTypes"

export type JourneyPageData = JourneyData & {
  id: string
  createdAt: string
  updatedAt: string
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
  data: JourneyPageData[]
}

export type JourneyQueryParams = {
  page?: number
  limit?: number
  search?: string
  journeyType?: string
  travelStyle?: string
  pace?: string
  comfortLevel?: string
  status?: string
  featured?: boolean
}

export function useGetJourneys(params: JourneyQueryParams = {}) {
  const {
    page = 1,
    limit = 12,
    search,
    journeyType,
    travelStyle,
    pace,
    comfortLevel,
    status,
    featured,
  } = params

  return useQuery({
    queryKey: [
      "journeys",
      page,
      limit,
      search,
      journeyType,
      travelStyle,
      pace,
      comfortLevel,
      status,
      featured,
    ],
    queryFn: async () => {
      const res = await apiPrivate.get<GetJourneysResponse>("/journeys", {
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(journeyType ? { journeyType } : {}),
          ...(travelStyle ? { travelStyle } : {}),
          ...(pace ? { pace } : {}),
          ...(comfortLevel ? { comfortLevel } : {}),
          ...(status ? { status } : {}),
          ...(featured !== undefined ? { featured: String(featured) } : {}),
        },
      })

      return res.data
    },
    placeholderData: (previous) => previous,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  })
}

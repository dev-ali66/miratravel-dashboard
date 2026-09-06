/* =====================================================
   JOURNEYS — USE JOURNEY LOCATIONS HOOK
   Dedicated hook for fetching, searching, and caching 
   locations specifically for Journey features (Itinerary, etc.)
   Decoupled from Location management hooks so it can be 
   optimized, cached, or migrated to a journey-specific API endpoint.
===================================================== */

import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type JourneyLocationItem = {
  id: string
  name: string
  slug?: string
  type?: string
  parent?: {
    id: string
    name: string
    type?: string
  } | null
  geoData?: {
    latitude?: number
    longitude?: number
  } | null
  metadata?: Record<string, any> | null
}

export type JourneyLocationsQueryParams = {
  page?: number
  limit?: number
  search?: string
  type?: string
}

export type JourneyLocationsResponse = {
  success: boolean
  message: string
  code: number
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: JourneyLocationItem[]
}

/**
 * Dedicated Journey hook to search and fetch destination locations.
 * Isolated from Location module hooks to allow independent caching,
 * transformation, and backend API response optimization.
 */
export function useJourneyLocations(params: JourneyLocationsQueryParams = {}) {
  const { page = 1, limit = 50, search, type } = params

  return useQuery({
    queryKey: ["journey-locations", page, limit, search, type],
    queryFn: async () => {
      const res = await apiPrivate.get<JourneyLocationsResponse>("/locations", {
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(type ? { type } : {}),
        },
      })
      return res.data
    },
    placeholderData: (previous) => previous,
    staleTime: 1000 * 60 * 5, // 5 minutes cache for smooth itinerary editing
  })
}

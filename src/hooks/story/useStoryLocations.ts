/* =====================================================
   STORIES — USE STORY LOCATIONS HOOK
   Dedicated hook for fetching, searching, and caching 
   locations specifically for Story features (Geographical Anchor, Tag 1 Place, etc.)
   Decoupled from Location management and Journey hooks so it can be 
   optimized, cached, or migrated to a story-specific API endpoint.
===================================================== */

import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type StoryLocationItem = {
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

export type StoryLocationsQueryParams = {
  page?: number
  limit?: number
  search?: string
  type?: string
}

export type StoryLocationsResponse = {
  success: boolean
  message: string
  code: number
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: StoryLocationItem[]
}

/**
 * Dedicated Story hook to search and fetch destination locations.
 * Decoupled from other module hooks to allow independent caching,
 * endpoint overrides, and backend optimization.
 */
export function useStoryLocations(params: StoryLocationsQueryParams = {}) {
  const { page = 1, limit = 50, search, type } = params

  return useQuery({
    queryKey: ["story-locations", page, limit, search, type],
    queryFn: async () => {
      const res = await apiPrivate.get<StoryLocationsResponse>("/locations", {
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
    staleTime: 1000 * 60 * 5, // 5 minutes cache for smooth story editing
  })
}

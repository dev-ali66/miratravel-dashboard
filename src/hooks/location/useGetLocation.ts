import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import type { LocationData } from "@/components/pages/Location/locationTypes"

export type LocationPageData = LocationData & {
  id: string
  createdAt: string
  updatedAt: string
}

type GetLocationPagesResponse = {
  success: boolean
  message: string
  code: number
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: LocationPageData[]
}

export type LocationQueryParams = {
  page?: number
  limit?: number
  search?: string
  type?: string
  parentId?: string
}

/**
 * Backend-driven list query for GET /locations. All filtering,
 * search and pagination happens server-side (see
 * backend/src/shared/getRecords.service.ts) — do not add
 * client-side filtering on top of this.
 */
export function useGetLocationPages(params: LocationQueryParams = {}) {
  const { page = 1, limit = 10, search, type, parentId } = params

  return useQuery({
    queryKey: ["location-pages", page, limit, search, type, parentId],
    queryFn: async () => {
      const res = await apiPrivate.get<GetLocationPagesResponse>("/locations", {
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(type ? { type } : {}),
          ...(parentId ? { parentId } : {}),
        },
      })

      return res.data
    },
    // keep previous page's data visible while the next page loads
    placeholderData: (previous) => previous,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  })
}

export type LocationSearchItem = {
  id: string
  name: string
  slug: string
  type: string
  hero?: any
  card?: any
  why?: any
  parent?: {
    id: string
    name: string
    slug: string
    type: string
  } | null
}

type LocationSearchResponse = {
  success: boolean
  message: string
  code: number
  data: LocationSearchItem[]
}

export function useSearchLocations(search = "", type?: string, limit = 50) {
  return useQuery({
    queryKey: ["locations-search", search, type, limit],
    queryFn: async () => {
      const res = await apiPrivate.get<LocationSearchResponse>("/locations/search", {
        params: {
          search: search.trim() || undefined,
          type: type || undefined,
          limit,
        },
      })
      return res.data
    },
    staleTime: 1000 * 30,
  })
}


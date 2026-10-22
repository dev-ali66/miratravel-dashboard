import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import type { ExperienceData } from "@/components/pages/Experience/experienceTypes"

export type ExperienceItemData = ExperienceData & {
  id: string
  createdAt: string
  updatedAt: string
}

type GetExperiencesResponse = {
  success: boolean
  message: string
  code: number
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: ExperienceItemData[]
}

export type ExperienceQueryParams = {
  page?: number
  limit?: number
  search?: string
  parentId?: string
  countryId?: string
  regionId?: string
  primaryType?: string
  status?: string
  featured?: boolean
  priceType?: string
  currency?: string
  minPrice?: number
  maxPrice?: number
}

export function useGetExperiencePages(params: ExperienceQueryParams = {}) {
  const {
    page = 1,
    limit = 12,
    search,
    parentId,
    countryId,
    regionId,
    primaryType,
    status,
    featured,
    priceType,
    currency,
    minPrice,
    maxPrice,
  } = params

  return useQuery({
    queryKey: [
      "experience-pages",
      page,
      limit,
      search,
      parentId,
      countryId,
      regionId,
      primaryType,
      status,
      featured,
      priceType,
      currency,
      minPrice,
      maxPrice,
    ],
    queryFn: async () => {
      const res = await apiPrivate.get<GetExperiencesResponse>("/experiences", {
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(parentId ? { parentId } : {}),
          ...(countryId ? { countryId } : {}),
          ...(regionId ? { regionId } : {}),
          ...(primaryType ? { primaryType } : {}),
          ...(status ? { status } : {}),
          ...(featured !== undefined ? { featured } : {}),
          ...(priceType ? { priceType } : {}),
          ...(currency ? { currency } : {}),
          ...(minPrice !== undefined ? { minPrice } : {}),
          ...(maxPrice !== undefined ? { maxPrice } : {}),
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

export type ExperienceSearchItem = {
  id: string
  name: string
  slug: string
  status?: string
  primaryType?: string
  featured?: boolean
  price?: number | null
  priceType?: string | null
  hero?: any
  essence?: any
  country?: {
    id: string
    name: string
    slug: string
    type?: string
  } | null
  region?: {
    id: string
    name: string
    slug: string
    type?: string
  } | null
  place?: {
    id: string
    name: string
    slug: string
    type?: string
  } | null
  parent?: {
    id: string
    name: string
    slug: string
    type?: string
  } | null
}

type ExperienceSearchResponse = {
  success: boolean
  message: string
  code: number
  data: ExperienceSearchItem[]
}

export function useSearchExperiences(search = "", limit = 50, featured?: boolean, parentId?: string) {
  return useQuery({
    queryKey: ["experiences-search", search, limit, featured, parentId],
    queryFn: async () => {
      const res = await apiPrivate.get<ExperienceSearchResponse>("/experiences/search", {
        params: {
          search: search.trim() || undefined,
          limit,
          ...(featured !== undefined ? { featured } : {}),
          ...(parentId ? { parentId } : {}),
        },
      })
      return res.data
    },
    staleTime: 1000 * 30,
  })
}

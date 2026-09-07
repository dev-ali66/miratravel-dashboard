/* =====================================================
   STORY MODULE — JOURNEY FETCHING HOOK
   Dedicated hook for fetching bookable journeys in the
   Story editor's "Linked Commercial Journeys" section.
   Decoupled from the Journey module hooks so each module
   can independently change its API endpoint later.
===================================================== */

import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export const STORY_JOURNEYS_QUERY_KEY = "story-journeys"

export interface StoryJourneyItem {
  id: string
  title?: string
  slug?: string
  destination?: string
  status?: string
  heroImage?: string
  duration?: string | number
  price?: string | number
  [key: string]: unknown
}

interface StoryJourneysResponse {
  data: StoryJourneyItem[]
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

/**
 * Fetch bookable journeys for use in the Story form's linked journeys selector.
 * Currently hits the same `/journeys` endpoint, but is isolated so the Story module
 * can migrate to a dedicated endpoint (e.g. `/stories/journeys`) later without
 * affecting the Journey module.
 */
export const useStoryJourneys = (page = 1, limit = 100, search?: string) => {
  return useQuery({
    queryKey: [STORY_JOURNEYS_QUERY_KEY, page, limit, search],
    queryFn: async (): Promise<StoryJourneysResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (search) params.append("search", search)

      try {
        const response = await apiPrivate.get(`/journeys?${params.toString()}`)
        return response.data
      } catch (error) {
        console.warn("[StoryJourneys] Journey endpoint failed, returning empty fallback.")
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

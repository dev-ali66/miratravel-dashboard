import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import type { Journey } from "@/components/pages/Journeys/journeyTypes"

export type CheckSlugResult = {
  exists: boolean
  conflictJourney: Journey | null
}

export function useCheckJourneySlug(slug?: string, currentJourneyId?: string) {
  const cleanSlug = (slug || "").trim().toLowerCase()

  return useQuery<CheckSlugResult>({
    queryKey: ["check-journey-slug", cleanSlug, currentJourneyId],
    queryFn: async () => {
      if (!cleanSlug || cleanSlug.length < 2) {
        return { exists: false, conflictJourney: null }
      }

      try {
        const res = await apiPrivate.get<{
          success?: boolean
          data?: Journey[]
        }>("/journeys", {
          params: {
            page: 1,
            limit: 20,
            search: cleanSlug,
          },
        })

        const list = Array.isArray(res.data?.data) ? res.data.data : []
        const matched = list.find(
          (j) => (j.slug || "").trim().toLowerCase() === cleanSlug
        )

        if (matched) {
          // If the matching journey is the one we are editing, it's not a conflict
          const isSameJourney = Boolean(
            currentJourneyId && matched.id === currentJourneyId
          )

          return {
            exists: !isSameJourney,
            conflictJourney: isSameJourney ? null : matched,
          }
        }

        return { exists: false, conflictJourney: null }
      } catch (err) {
        // In case of query error, do not aggressively block
        return { exists: false, conflictJourney: null }
      }
    },
    enabled: Boolean(cleanSlug && cleanSlug.length >= 2),
    staleTime: 1000 * 15, // 15 seconds
  })
}

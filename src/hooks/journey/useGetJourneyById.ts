import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import type { Journey } from "@/components/pages/Journeys/journeyTypes"

type GetJourneyResponse = {
  success: boolean
  message: string
  code: number
  data: Journey | Journey[]
}

export function useGetJourneyById(id?: string, slug?: string) {
  const enabled = Boolean(id || slug)

  return useQuery({
    queryKey: ["journey", id || slug],
    queryFn: async () => {
      const res = await apiPrivate.get<GetJourneyResponse>("/journeys", {
        params: {
          ...(id ? { id } : {}),
          ...(slug ? { slug } : {}),
        },
      })
      const raw = res.data?.data
      if (Array.isArray(raw)) {
        return raw[0] ?? null
      }
      return raw ?? null
    },
    enabled,
  })
}

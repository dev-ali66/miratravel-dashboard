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
  const enabled = Boolean(id || slug) && id !== "new"

  return useQuery({
    queryKey: ["journey", id || slug],
    queryFn: async () => {
      const params: Record<string, string> = {}
      const isCuidOrUuid =
        id && (/^c[a-z0-9]{20,}$/i.test(id) || /^[0-9a-f-]{36}$/i.test(id))

      if (id && id !== "new") {
        if (isCuidOrUuid) {
          params.id = id
        } else if (!slug) {
          params.slug = id
        } else {
          params.id = id
        }
      }
      if (slug && slug !== "new") {
        params.slug = slug
      }

      const res = await apiPrivate.get<GetJourneyResponse>("/journeys", { params })
      const raw = res.data?.data
      if (Array.isArray(raw)) {
        return raw[0] ?? null
      }
      return raw ?? null
    },
    enabled,
  })
}

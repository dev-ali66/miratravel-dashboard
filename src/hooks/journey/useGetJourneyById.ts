import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export function useGetJourneyById(id?: string) {
  return useQuery({
    queryKey: ["journey", id],
    queryFn: async () => {
      if (!id) return null
      const res = await apiPrivate.get(`/journeys`, {
        params: { id },
      })
      return res.data
    },
    enabled: Boolean(id),
  })
}

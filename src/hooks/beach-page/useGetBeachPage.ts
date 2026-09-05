import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type GetBeachPageResponse = {
  success: boolean
  message: string
  code: number
  meta: any
  data: {
    id: string
    beachId: string
    slug: string
    title: string
    data: any
    isPublished: boolean
  }
}

export function useGetBeachPage(
  beachId: string | null | undefined,
  slug: string
) {
  return useQuery({
    queryKey: ["beach-page", beachId, slug],
    queryFn: async () => {
      if (!beachId) return null
      const res = await apiPrivate.get<GetBeachPageResponse>(`/beach-page`, {
        params: {
          beachId,
          slug,
        },
      })
      return res.data
    },
    enabled: !!beachId && !!slug,
  })
}

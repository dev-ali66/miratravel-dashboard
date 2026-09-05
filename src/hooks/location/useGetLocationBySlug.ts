import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type GetLocationResponse = {
  success: boolean
  message: string
  code: number
  meta: any | null
  data: any
}

export function useGetLocationBySlug(slug: string) {
  return useQuery({
    queryKey: ["locations", slug],

    queryFn: async () => {
      const res = await apiPrivate.get<GetLocationResponse>("/locations", {
        params: {
          slug,
        },
      })

      return res.data
    },

    enabled: !!slug,
  })
}

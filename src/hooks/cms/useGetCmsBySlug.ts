import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type GetCmsResponse = {
  success: boolean
  message: string
  code: number
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  } | null
  data: any
}

export function useGetCmsBySlug(slug: string) {
  return useQuery({
    queryKey: ["cms", slug],
    queryFn: async () => {
      const res = await apiPrivate.get<GetCmsResponse>("/cms-pages", {
        params: { slug },
      })
      return res.data
    },
    enabled: !!slug,
  })
}

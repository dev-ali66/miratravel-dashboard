import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import type { PageSectionData } from "./useGetPageSections"

type GetPageSectionResponse = {
  success: boolean
  message: string
  code: number
  meta: any
  data: PageSectionData
}

export function useGetPageSectionBySlug(slug: string, pageId?: string) {
  return useQuery({
    queryKey: ["pageSection", slug, pageId],
    queryFn: async () => {
      const res = await apiPrivate.get<GetPageSectionResponse>(
        "/pages-section",
        {
          params: { slug, pageId },
        }
      )
      return res.data
    },
    enabled: !!slug,
  })
}

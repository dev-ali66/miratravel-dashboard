import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type PageSectionData = {
  id: string
  pageId: string
  pageName: string
  order: number
  title: string
  key: string
  data: Record<string, any>
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

type GetPageSectionsResponse = {
  success: boolean
  message: string
  code: number
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: PageSectionData[]
}

export function useGetPageSections(pageId: string) {
  return useQuery({
    queryKey: ["pageSections", pageId],
    queryFn: async () => {
      const res = await apiPrivate.get<GetPageSectionsResponse>(
        "/pages-section",
        {
          params: { pageId },
        }
      )
      return res.data
    },
    enabled: !!pageId,
  })
}

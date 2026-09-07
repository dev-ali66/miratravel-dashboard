import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type StoryCmsResponse = {
  success: boolean
  message: string
  code: number
  data: any
}

export function useStoryFooterCms() {
  return useQuery({
    queryKey: ["story-cms-footer"],
    queryFn: async () => {
      const res = await apiPrivate.get<StoryCmsResponse>("/cms-pages", {
        params: { slug: "footer" },
      })
      return res.data
    },
  })
}

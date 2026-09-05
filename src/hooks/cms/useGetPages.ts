import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type PageData = {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

type GetPagesResponse = {
  success: boolean
  message: string
  code: number
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: PageData[]
}

export function useGetPages() {
  return useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const res = await apiPrivate.get<GetPagesResponse>("/cms-pages/")
      return res.data
    },
  })
}

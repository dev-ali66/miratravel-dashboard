import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type GetInstructorFreeLeadUsedResponse = {
  success: boolean
  message: string
  code: number
  data: boolean
}

export function useGetInstructorFreeLeadUsed() {
  return useQuery({
    queryKey: ["instructor-free-lead-used"],
    queryFn: async () => {
      const res = await apiPrivate.get<GetInstructorFreeLeadUsedResponse>(
        "/instructor/free-lead-status"
      )

      return res.data
    },
  })
}

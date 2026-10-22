import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export function useGetExperienceById(id?: string) {
  return useQuery({
    queryKey: ["experience", id],
    queryFn: async () => {
      if (!id) return null
      const res = await apiPrivate.get("/experiences", {
        params: { id },
      })
      return res.data
    },
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnMount: "always",
  })
}

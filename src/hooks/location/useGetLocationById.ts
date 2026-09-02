import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type GetLocationResponse = {
    success: boolean
    message: string
    code: number
    meta: any | null
    data: any
}

export function useGetLocationById(id?: string) {
    return useQuery({
        queryKey: ["location", id],

        queryFn: async () => {
            const response = await apiPrivate.get<GetLocationResponse>(
                `/locations?id=${encodeURIComponent(id!)}`
            )
            return response.data
        },

        enabled: !!id,
    })
}
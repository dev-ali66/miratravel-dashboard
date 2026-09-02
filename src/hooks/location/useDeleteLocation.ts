import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

type DeleteLocationResponse = {
    success: boolean;
    message: string;
    code: number;
    meta: any;
    data: {
        count: number;
    }
}

export function useDeleteLocation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await apiPrivate.delete<DeleteLocationResponse>("/locations/", {
                data: { id }
            })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["locations"] })
        }
    })
}
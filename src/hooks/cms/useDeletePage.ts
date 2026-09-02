import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

type DeletePageResponse = {
    success: boolean;
    message: string;
    code: number;
    meta: any;
    data: {
        count: number;
    }
}

export function useDeletePage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await apiPrivate.delete<DeletePageResponse>("/pages/", {
                data: { id }
            })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pages"] })
        }
    })
}

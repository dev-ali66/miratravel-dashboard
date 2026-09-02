import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"

export type SaveBeachPagePayload = {
    beachId: string;
    slug: string;
    isPublished: boolean;
    title: string;
    data: any;
}

export type SaveBeachPageResponse = {
    success: boolean;
    message: string;
    code: number;
    meta: any | null;
    data: any;
}

export function useSaveBeachPage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: SaveBeachPagePayload) => {
            const res = await apiPrivate.post<SaveBeachPageResponse>("/beach-page/", payload);
            return res.data;
        },
        onSuccess: (data, variables) => {
            if (data.success) {
                toast.success(data.message || "Section saved successfully");
                // Invalidate the specific section query
                queryClient.invalidateQueries({ queryKey: ["beach-page", variables.beachId, variables.slug] });
            } else {
                toast.error(data.message || "Failed to save section");
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message || "An error occurred while saving the section");
        }
    })
}

import { useMutation } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"

export type SavePageSectionPayload = {
    pageId: string;
    slug: string;
    data: Record<string, any>;
    isPublished?: boolean;
}

export type SavePageSectionResponse = {
    success: boolean;
    message: string;
    code: number;
    meta: any | null;
    data: any;
}

export function useSavePageSection() {
    return useMutation({
        mutationFn: async (payload: SavePageSectionPayload) => {
            const formData = new FormData();
            formData.append("slug", payload.slug);
            formData.append("data", JSON.stringify(payload.data));
            
            if (payload.pageId) {
                formData.append("pageId", payload.pageId);
            }
            
            formData.append("isPublished", String(payload.isPublished ?? true));

            const res = await apiPrivate.post<SavePageSectionResponse>("/pages-section", formData);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || "Section updated successfully");
                // Optional: Invalidate queries if there is a query for fetching page sections
                // queryClient.invalidateQueries({ queryKey: ["pages-sections"] });
            } else {
                toast.error(data.message || "Failed to update section");
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message || "An error occurred while saving");
        }
    })
}

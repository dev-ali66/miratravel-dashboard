import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"

export type UpdateRequestStatusPayload = {
    id: string;
    isVerified: boolean;
    status?: string;
}

export function useUpdateRequestStatus() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (payload: UpdateRequestStatusPayload) => {
            const formData = new URLSearchParams();
            formData.append("id", payload.id);
            formData.append("isVerified", String(payload.isVerified));
            if (payload.status) {
                formData.append("status", payload.status);
            }

            const res = await apiPrivate.post("/users", formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return res.data;
        },
        onSuccess: (data: any) => {
            if (data.success || data.code === 200 || data.code === 201 || data.statusCode === 200) {
                toast.success(data.message || "Request status updated successfully");
                queryClient.invalidateQueries({ queryKey: ["requests"] });
            } else {
                toast.error(data.message || "Failed to update request status");
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message || "An error occurred while updating");
        }
    })
}

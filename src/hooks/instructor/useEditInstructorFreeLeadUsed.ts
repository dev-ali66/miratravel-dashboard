import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "@/lib/api-client";
import { toast } from "sonner";

export type EditInstructorFreeLeadUsedPayload = {
    free_lead_used: boolean;
};

export type EditInstructorFreeLeadUsedResponse = {
    success: boolean;
    message: string;
    code: number;
    data: {
        free_lead_used: boolean;
        updatedCount: number;
    };
};

export function useEditInstructorFreeLeadUsed() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            payload: EditInstructorFreeLeadUsedPayload
        ) => {
            const res =
                await apiPrivate.post<EditInstructorFreeLeadUsedResponse>(
                    "/instructor/free-lead-status",
                    payload
                );

            return res.data;
        },

        onSuccess: (data) => {
            if (data.success) {
                toast.success(
                    data.message || "Free lead status updated successfully"
                );

                // Global free lead status refresh
                queryClient.invalidateQueries({
                    queryKey: ["instructor-free-lead-used"],
                });

                // User list refresh
                queryClient.invalidateQueries({
                    queryKey: ["users"],
                });
            } else {
                toast.error(
                    data.message || "Failed to update free lead status"
                );
            }
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "An error occurred while updating free lead status"
            );
        },
    });
}
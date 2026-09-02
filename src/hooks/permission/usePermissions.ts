import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "@/lib/api-client";
import { toast } from "sonner";

export type PermissionItem = {
    id: string;
    name: string;
    description?: string | null;
    module?: string;
    image?: string | null;
    video?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type GetPermissionsResponse = {
    success: boolean;
    message: string;
    code: number;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data: PermissionItem[];
};

export function useGetPermissions(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ["permissions", page, limit],
        queryFn: async () => {
            const res = await apiPrivate.get<GetPermissionsResponse>("/permissions", {
                params: { page, limit },
            });
            return res.data;
        },
    });
}

export type ManagePermissionPayload = {
    id?: string;
    name: string;
    description?: string;
    module?: string;
    image?: File | null;
    video?: File | null;
};

export type ManagePermissionResponse = {
    success: boolean;
    message: string;
    code: number;
    data: PermissionItem;
};

function buildPermissionFormData(payload: ManagePermissionPayload) {
    const formData = new FormData();

    if (payload.id) formData.append("id", payload.id);
    formData.append("name", payload.name);
    if (payload.description) formData.append("description", payload.description);
    if (payload.module) formData.append("module", payload.module);
    if (payload.image) formData.append("image", payload.image);
    if (payload.video) formData.append("video", payload.video);

    return formData;
}

export function useManagePermission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: ManagePermissionPayload) => {
            const hasFile = Boolean(payload.image || payload.video);

            const res = await apiPrivate.post<ManagePermissionResponse>(
                "/permissions",
                hasFile ? buildPermissionFormData(payload) : payload,
                hasFile
                    ? { headers: { "Content-Type": "multipart/form-data" } }
                    : undefined,
            );

            return res.data;
        },

        onSuccess: (data, variables) => {
            if (data.success) {
                toast.success(
                    data.message ||
                        (variables.id
                            ? "Permission updated successfully"
                            : "Permission created successfully"),
                );

                queryClient.invalidateQueries({
                    queryKey: ["permissions"],
                });
            } else {
                toast.error(data.message || "Failed to save permission");
            }
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "An error occurred while saving permission",
            );
        },
    });
}

export type DeletePermissionPayload = {
    id: string;
};

export type DeletePermissionResponse = {
    success: boolean;
    message: string;
    code: number;
    data: any;
};

export function useDeletePermission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: DeletePermissionPayload) => {
            const res = await apiPrivate.delete<DeletePermissionResponse>("/permissions", {
                data: { id },
            });

            return res.data;
        },

        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || "Permission deleted successfully");

                queryClient.invalidateQueries({
                    queryKey: ["permissions"],
                });
            } else {
                toast.error(data.message || "Failed to delete permission");
            }
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "An error occurred while deleting permission",
            );
        },
    });
}
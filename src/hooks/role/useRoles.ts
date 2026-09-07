import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"

export type RoleItem = {
  id: string
  name: string
  permissions: any[]
  createdAt?: string
  updatedAt?: string
}

export type GetRolesResponse = {
  success: boolean
  message: string
  code: number
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: RoleItem[]
}

export function useGetRoles(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["roles", page, limit],
    queryFn: async () => {
      const res = await apiPrivate.get<GetRolesResponse>("/roles", {
        params: { page, limit },
      })
      return res.data
    },
  })
}

export type ManageRolePayload = {
  id?: string
  name: string
  permissions?: string[]
}

export type ManageRoleResponse = {
  success: boolean
  message: string
  code: number
  data: RoleItem
}

export function useManageRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ManageRolePayload) => {
      const res = await apiPrivate.post<ManageRoleResponse>(
        "/roles",
        payload
      )

      return res.data
    },

    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success(
          data.message ||
            (variables.id
              ? "Role updated successfully"
              : "Role created successfully")
        )

        queryClient.invalidateQueries({
          queryKey: ["roles"],
        })
      } else {
        toast.error(data.message || "Failed to save role")
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while saving role"
      )
    },
  })
}

export type DeleteRolePayload = {
  id: string
}

export type DeleteRoleResponse = {
  success: boolean
  message: string
  code: number
  data: any
}

export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteRolePayload) => {
      const res = await apiPrivate.delete<DeleteRoleResponse>("/roles", {
        data: { id },
      })

      return res.data
    },

    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Role deleted successfully")

        queryClient.invalidateQueries({
          queryKey: ["roles"],
        })
      } else {
        toast.error(data.message || "Failed to delete role")
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while deleting role"
      )
    },
  })
}

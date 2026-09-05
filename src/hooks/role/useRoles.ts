import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"

export type RoleItem = {
  id: string
  name: string
  description?: string | null
  permissions: string[]
  image?: string | null
  video?: string | null
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
  description?: string
  permissions?: string[]
  image?: File | null
  video?: File | null
}

export type ManageRoleResponse = {
  success: boolean
  message: string
  code: number
  data: RoleItem
}

function buildRoleFormData(payload: ManageRolePayload) {
  const formData = new FormData()

  if (payload.id) formData.append("id", payload.id)
  formData.append("name", payload.name)
  if (payload.description) formData.append("description", payload.description)
  if (payload.permissions) {
    payload.permissions.forEach((p) => formData.append("permissions[]", p))
  }
  if (payload.image) formData.append("image", payload.image)
  if (payload.video) formData.append("video", payload.video)

  return formData
}

export function useManageRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ManageRolePayload) => {
      const hasFile = Boolean(payload.image || payload.video)

      const res = await apiPrivate.post<ManageRoleResponse>(
        "/roles",
        hasFile ? buildRoleFormData(payload) : payload,
        hasFile
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined
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

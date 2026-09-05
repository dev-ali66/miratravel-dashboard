import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"

export type EditUserPayload = {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  roles?: string
  roleId?: string
  status?: string
  photoUrl?: string | null
}

export type EditUserResponse = {
  success: boolean
  message: string
  code: number
  data: any
}

export function useEditUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: EditUserPayload) => {
      const res = await apiPrivate.post<EditUserResponse>("/users", {
        id,
        ...payload,
      })

      return res.data
    },

    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "User updated successfully")

        queryClient.invalidateQueries({
          queryKey: ["users"],
        })
      } else {
        toast.error(data.message || "Failed to update user")
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while updating user"
      )
    },
  })
}

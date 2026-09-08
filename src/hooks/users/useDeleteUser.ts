import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"

export type DeleteUserPayload = {
  id: string
  isDeleted?: boolean
}

export type DeleteUserResponse = {
  success: boolean
  message: string
  code: number
  data: any
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteUserPayload) => {
      const res = await apiPrivate.delete<DeleteUserResponse>(`/users/${id}`)
      return res.data
    },

    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "User deleted successfully")
        queryClient.invalidateQueries({ queryKey: ["users"] })
      } else {
        toast.error(data.message || "Failed to delete user")
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while deleting user"
      )
    },
  })
}

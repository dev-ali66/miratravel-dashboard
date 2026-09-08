import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"

export type CreateUserPayload = {
  email: string
  password?: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: string
  status?: string
  isVerified?: boolean
}

export type CreateUserResponse = {
  success: boolean
  message: string
  code: number
  data: any
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const res = await apiPrivate.post<CreateUserResponse>("/users", payload)
      return res.data
    },

    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "User created successfully")
        queryClient.invalidateQueries({ queryKey: ["users"] })
      } else {
        toast.error(data.message || "Failed to create user")
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while creating user"
      )
    },
  })
}

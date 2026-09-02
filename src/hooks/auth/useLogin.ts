import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPublic } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

type LoginPayload = {
  email: string
  password?: string
}

type User = {
  id: string
  email: string
  isVerified: boolean
  isDeleted: boolean
  lockUntil: string | null
  status: string
  failedLoginAttempts: number
  roles: Array<{
    id: string
    name: string
    permissions: Array<{
      id: string
      action: string
      resource: string
      scope: string
    }>
  }>
  instructorInfo: any
  userPersonalInfo: any
  turistInfo: any
  userSettings: any
}

type LoginResponse = {
  success: boolean
  message: string
  code: number
  meta: any
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await apiPublic.post<LoginResponse>("/auth/login", payload)
      return res.data
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Logged in successfully!")

        // Store tokens from response data
        if (res.data?.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken)
        }
        if (res.data?.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken)
        }

        // Clear previous user data queries
        queryClient.clear()

        // Navigate to the dashboard or home
        navigate("/")
      } else {
        toast.error(res.message || "Login failed")
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

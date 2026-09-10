import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export type LogoutPayload = {
  allDevices?: boolean
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (payload?: LogoutPayload) => {
      const refreshToken = localStorage.getItem("refreshToken")
      const res = await apiPrivate.post("/auth/logout", {
        allDevices: payload?.allDevices || false,
        refreshToken: refreshToken || undefined,
      })
      return res.data
    },
    onSuccess: (data) => {
      // Clear tokens & session state
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("sessionInfo")

      // Clear all react-query cache
      queryClient.clear()

      toast.success(data?.message || "Logged out successfully")
      navigate("/login")
    },
    onError: () => {
      // Even if API errors (e.g., token already invalid), safely clear local storage & redirect
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("sessionInfo")

      queryClient.clear()
      toast.success("Logged out successfully")
      navigate("/login")
    },
  })
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api-error"

export type SessionItem = {
  id: string
  deviceName: string
  browser?: string
  os?: string
  deviceType?: "mobile" | "tablet" | "desktop"
  userAgent?: string | null
  ipAddress?: string | null
  rememberMe: boolean
  expiresAt: string
  lastUsedAt?: string | null
  createdAt: string
  isOnline: boolean
}

export type SessionStatsData = {
  totalActiveDevices: number
  onlineDevices: number
  sessions: SessionItem[]
}

export type SessionsApiResponse = {
  success: boolean
  message: string
  code: number
  data: SessionStatsData
}

export function useUserSessions() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

  return useQuery({
    queryKey: ["USER_SESSIONS"],
    queryFn: async () => {
      const res = await apiPrivate.get<SessionsApiResponse>("/auth/sessions")
      return res.data.data
    },
    enabled: Boolean(token),
    staleTime: 1000 * 15, // 15 seconds
    refetchInterval: 1000 * 30, // 30 seconds polling for real-time device status
    refetchOnWindowFocus: true,
  })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await apiPrivate.delete(`/auth/sessions/${sessionId}`)
      return res.data
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Device session removed successfully")
      queryClient.invalidateQueries({ queryKey: ["USER_SESSIONS"] })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

export function useRevokeAllOtherSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem("refreshToken")
      const res = await apiPrivate.delete("/auth/sessions/all-other", {
        data: { refreshToken: refreshToken || undefined },
      })
      return res.data
    },
    onSuccess: (data) => {
      toast.success(data?.message || "All other devices removed successfully")
      queryClient.invalidateQueries({ queryKey: ["USER_SESSIONS"] })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

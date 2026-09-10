import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type SessionItem = {
  id: string
  deviceName: string
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

import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type Permission = {
  id: string
  action: string
  resource: string
  scope: string
}

export type Role = {
  id: string
  name: string
  permissions?: Permission[]
}

export type UserPersonalInfo = {
  firstName: string | null
  lastName: string | null
  about: string | null
  photoUrl: string[]
  phone: string | null
  whatsapp: string | null
  isWhatsappVerified: boolean
}

export type UserSettings = {
  emailNotification: boolean
  whatsappNotification: boolean
  platfromNotification: boolean
  smsNotification: boolean
  orderNotification: boolean
  orderStatusNotification: boolean
  platfromUpdateNotification: boolean
}

export type ProfileSteps = {
  emailVerified: boolean
  personalInfo: boolean
  phone: boolean
  whatsapp: boolean
  photo: boolean
  about: boolean
  instructorInfo: boolean
  license: boolean
}

export type UserDashboardInfo = {
  accountStatus: string
  licenseVerified: boolean
  profileCompletion: number
  profileSteps: ProfileSteps
}

export type AuthUser = {
  id: string
  email: string
  isVerified: boolean
  status: string
  createdAt?: string
  isDeleted?: boolean
  lockUntil?: string | null
  failedLoginAttempts?: number
  roles: Role[]
  userPersonalInfo: UserPersonalInfo | null
  userSettings?: UserSettings | null
  instructorInfo?: unknown | null
  turistInfo?: unknown | null
  dashboard?: UserDashboardInfo | null
  iat?: number
  exp?: number
}

export type MeResponse = {
  success: boolean
  message: string
  code: number
  meta: unknown
  data: AuthUser
}

export function useMe() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

  return useQuery({
    queryKey: ["GET_ME"],
    queryFn: async () => {
      const res = await apiPrivate.get<MeResponse>("/auth/me")
      return res.data.data
    },
    enabled: Boolean(token),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type Role = {
  id: string
  name: string
}

export type UserPersonalInfo = {
  firstName: string | null
  lastName: string | null
  photoUrl: string[]
}

export type InstructorInfo = {
  id: string
  userId: string
  skill: string
  experience: string | null
  license: string[]
  languages: string[]
  preferredTime: string
  free_lead_used: boolean
  creditBalance: number
  open_pending_leads: number
  createdAt: string
  updatedAt: string
}

export type RequestUser = {
  id: string
  email: string
  roles: Role[]
  isVerified: boolean
  userPersonalInfo: UserPersonalInfo
  instructorInfo: InstructorInfo | null
}

export type GetRequestsResponse = {
  success: boolean
  message: string
  code: number
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: RequestUser[]
}

export function useGetRequests(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["requests", page, limit],
    queryFn: async () => {
      const res = await apiPrivate.get<GetRequestsResponse>("/request", {
        params: {
          page,
          limit,
          role: "INSTRUCTOR",
          status: "PENDING",
          isDeleted: "false",
        },
      })
      return res.data
    },
  })
}

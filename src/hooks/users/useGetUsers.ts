import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type UserItem = {
  id: string
  email: string
  status: "ACTIVE" | "INACTIVE" | "DEACTIVE" | "BLOCKED" | "SUSPENDED" | "PENDING" | "DELETED" | "ARCHIVED" | string
  isVerified: boolean
  isDeleted: boolean
  roles: string
  roleId?: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  photoUrl: string | null
  bookingsCount?: number
  createdAt: string
  updatedAt?: string
}

export type UserStats = {
  totalUsers: number
  activeUsers: number
  verifiedUsers: number
  adminUsers: number
}

export type GetUsersResponse = {
  success: boolean
  message: string
  code: number
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    stats?: UserStats
  }
  data: UserItem[]
}

export type UserFilters = {
  search?: string
  role?: string
  status?: string
  isVerified?: boolean | string
}

export function useGetUsers(page: number = 1, limit: number = 10, filters?: UserFilters) {
  return useQuery({
    queryKey: ["users", page, limit, filters?.search, filters?.role, filters?.status, filters?.isVerified],
    queryFn: async () => {
      const params: Record<string, any> = { page, limit }
      if (filters?.search) params.search = filters.search
      if (filters?.role && filters.role !== "ALL") params.role = filters.role
      if (filters?.status && filters.status !== "ALL") params.status = filters.status
      if (filters?.isVerified !== undefined && filters?.isVerified !== "ALL" && filters?.isVerified !== "") {
        params.isVerified = filters.isVerified
      }

      const res = await apiPrivate.get<GetUsersResponse>("/users", { params })
      return res.data
    },
  })
}

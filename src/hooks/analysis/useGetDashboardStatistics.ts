import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type DashboardTopBeach = {
  id: string
  name: string
  tag: string
  slug: string
  beachImage: string[]
  description: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
  _count: {
    leads: number
  }
}

export type DashboardAlerts = {
  pendingMoreThan24h: number
  instructorsWith3OpenLeads: any
  instructorsBelow20Acceptance: number
  suspiciousWhatsapp: Array<{
    _count: {
      whatsapp: number
    }
    whatsapp: string
  }>
}

export type DashboardChartPoint = {
  name: string
  total: number
}

export type DashboardRecentPurchase = {
  id: string
  name: string
  email: string
  credits: number
  amount: number
  createdAt: string
}

export type DashboardInstructorRating = {
  averageRating: number
  totalReviews: number
  topInstructors: Array<{
    id: string
    name: string
    rating: number
    reviews: number
  }>
}

export type DashboardOverview = {
  totalLeadsToday: number
  totalLeadsLast7Days: number
  totalLeadsLast30Days: number
  totalLeads: number
  pendingLeads: number
  acceptedLeads: number
  declinedLeads: number
  expiredLeads: number
  leadAcceptanceRate: number
  activeInstructors: number
  instructorsWithZeroCredits: number
  creditsPurchased: number
  creditPacksSold: number
  totalRevenue: number
  topBeaches: DashboardTopBeach[]
}

export type DashboardStatistics = {
  overview: DashboardOverview
  charts: {
    revenueOverview: DashboardChartPoint[]
    monthlyBookings: DashboardChartPoint[]
  }
  recentPurchases: DashboardRecentPurchase[]
  instructorRatings: DashboardInstructorRating
  alerts: DashboardAlerts
}

type DashboardStatisticsResponse = {
  success: boolean
  message: string
  code: number
  meta: unknown
  data: DashboardStatistics
}

export function useGetDashboardStatistics() {
  return useQuery({
    queryKey: ["dashboard", "statistics"],
    queryFn: async () => {
      const res = await apiPrivate.get<DashboardStatisticsResponse>(
        "/dashboard/statastics"
      )
      return res.data.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

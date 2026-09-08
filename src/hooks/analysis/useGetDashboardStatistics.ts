import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type DashboardChartPoint = {
  name: string
  total: number
}

export type DashboardRecentActivity = {
  id: string
  bookingNumber: string
  travelerName: string
  travelerEmail: string
  journeyTitle: string
  amount: number
  currency: string
  bookingStatus: string
  paymentStatus: string
  createdAt: string
}

export type DashboardBookingStatus = {
  confirmed: number
  underReview: number
  depositDue: number
  cancelled: number
}

export type DashboardOverview = {
  totalBookings: number
  totalRevenue: number
  totalTravelers: number
  activeTravelers: number
  verifiedTravelers: number
  totalJourneys: number
  totalStories: number
  totalLocations: number
  pendingReviewBookings: number
  confirmedBookings: number
  depositDueBookings: number
  cancelledBookings: number
}

export type DashboardStatistics = {
  overview: DashboardOverview
  charts: {
    revenueOverview: DashboardChartPoint[]
    monthlyBookings: DashboardChartPoint[]
  }
  bookingStatus: DashboardBookingStatus
  recentActivity: DashboardRecentActivity[]
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
      const res = await apiPrivate.get<DashboardStatisticsResponse>("/statistics")
      return res.data.data
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

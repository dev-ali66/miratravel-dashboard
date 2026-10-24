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
  avgTicket?: number
  confirmationRate?: number
}

export type DashboardModules = {
  bookings: {
    title: string
    route: string
    total: number
    pending: number
    confirmed: number
    depositDue: number
    cancelled: number
    revenue: number
    sparkline?: number[]
  }
  journeyRequests: {
    title: string
    route: string
    total: number
    new: number
    inReview: number
    completed: number
    sparkline?: number[]
  }
  inquiries: {
    title: string
    route: string
    total: number
    new: number
    inReview: number
    contacted: number
    closed: number
    sparkline?: number[]
  }
  locations: {
    title: string
    route: string
    total: number
    continents: number
    countries: number
    regions: number
    places: number
    landmarks?: number
    accommodations?: number
    sparkline?: number[]
  }
  journeys: {
    title: string
    route: string
    total: number
    published: number
    featured: number
    drafts: number
    sparkline?: number[]
  }
  experiences: {
    title: string
    route: string
    total: number
    published: number
    featured: number
    drafts: number
    sparkline?: number[]
  }
  stories: {
    title: string
    route: string
    total: number
    published: number
    featured: number
    drafts: number
    sparkline?: number[]
  }
  users: {
    title: string
    route: string
    total: number
    active: number
    verified: number
    sparkline?: number[]
  }
  newsletter: {
    title: string
    route: string
    total: number
    active: number
    unsubscribed: number
    sparkline?: number[]
  }
  media: {
    title: string
    route: string
    total: number
    sparkline?: number[]
  }
  systemHealth: {
    title: string
    route: string
    status: string
    uptimeSeconds: number
    memoryMb: number
    dbLatencyMs?: number
    vps?: {
      cpuPercent: number
      totalMemoryGb: number
      usedMemoryGb: number
      freeMemoryGb: number
      memoryPercent: number
      cpuCores: number
      platform: string
    }
    pm2?: {
      isPm2: boolean
      backendInstances: number
      frontendInstances: number
      totalProcesses: number
      onlineProcesses: number
      fleet: Array<{
        name: string
        pm_id?: number
        status: string
        type?: string
        cpu?: number
        memoryMb?: number
        port?: number | string
      }>
    }
  }
  auditLogs: {
    title: string
    route: string
    totalEvents?: number
    streamStatus: string
    securityLevel: string
  }
  cms: {
    title: string
    route: string
    total: number
  }
}

export type DashboardStatistics = {
  overview: DashboardOverview
  charts: {
    revenueOverview: DashboardChartPoint[]
    monthlyBookings: DashboardChartPoint[]
  }
  bookingStatus: DashboardBookingStatus
  recentActivity: DashboardRecentActivity[]
  modules?: DashboardModules
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

import { CalendarDays, DollarSign, Users, Compass } from "lucide-react"
import { CompactStatCard } from "@/components/shared/PageHeader"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"

export default function StatCards() {
  const { data, isLoading } = useGetDashboardStatistics()
  const overview = data?.overview

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
      <CompactStatCard
        label="Bookings"
        value={isLoading ? "..." : (overview?.totalBookings?.toLocaleString() ?? "0")}
        subtext={`${overview?.pendingReviewBookings ?? 0} pending`}
        icon={CalendarDays}
        iconColor="text-chart-5"
      />
      <CompactStatCard
        label="Revenue"
        value={isLoading ? "..." : `$${(overview?.totalRevenue ?? 0).toLocaleString()}`}
        subtext={`${overview?.confirmedBookings ?? 0} confirmed`}
        icon={DollarSign}
        iconColor="text-chart-4"
      />
      <CompactStatCard
        label="Travelers"
        value={isLoading ? "..." : (overview?.totalTravelers?.toLocaleString() ?? "0")}
        subtext={`${overview?.verifiedTravelers ?? 0} verified`}
        icon={Users}
        iconColor="text-chart-2"
      />
      <CompactStatCard
        label="Journeys"
        value={isLoading ? "..." : (overview?.totalJourneys?.toLocaleString() ?? "0")}
        subtext={`${overview?.totalStories ?? 0} stories`}
        icon={Compass}
        iconColor="text-chart-3"
      />
    </div>
  )
}

import { CalendarDays, DollarSign, Users, Compass } from "lucide-react"
import { SlideBottom } from "@/components/animation"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"

export default function StatCards() {
  const { data, isLoading } = useGetDashboardStatistics()
  const overview = data?.overview

  const stats = [
    {
      title: "Total Bookings",
      value: overview?.totalBookings?.toLocaleString() ?? "0",
      change: `${overview?.pendingReviewBookings ?? 0} pending review`,
      icon: CalendarDays,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Gross Revenue",
      value: `$${(overview?.totalRevenue ?? 0).toLocaleString()}`,
      change: `${overview?.confirmedBookings ?? 0} confirmed / paid`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Registered Travelers",
      value: overview?.totalTravelers?.toLocaleString() ?? "0",
      change: `${overview?.verifiedTravelers ?? 0} verified accounts`,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Curated Journeys",
      value: overview?.totalJourneys?.toLocaleString() ?? "0",
      change: `${overview?.totalStories ?? 0} published stories`,
      icon: Compass,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <SlideBottom
            key={stat.title}
            delay={i * 0.1}
            className="rounded-xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl transition-all hover:border-border hover:shadow-md"
          >
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </h3>
              <div className={`flex size-10 items-center justify-center rounded-xl border ${stat.bg} ${stat.border} ${stat.color}`}>
                <Icon className="size-5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <span className="inline-block h-8 w-20 animate-pulse rounded bg-muted/60"></span>
                ) : (
                  stat.value
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80">
                  {stat.change}
                </span>
              </p>
            </div>
          </SlideBottom>
        )
      })}
    </div>
  )
}

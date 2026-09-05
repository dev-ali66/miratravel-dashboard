import { Users, DollarSign, GraduationCap, CalendarCheck } from "lucide-react"
import { SlideBottom } from "@/components/animation"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"

export default function StatCards() {
  const { data, isLoading } = useGetDashboardStatistics()

  const overview = data?.overview

  const stats = [
    {
      title: "Leads (7 days)",
      value: overview?.totalLeadsLast7Days?.toLocaleString() ?? "0",
      change: `${overview?.totalLeadsToday ?? 0} today`,
      icon: Users,
      trend: "up" as const,
    },
    {
      title: "Active instructors",
      value: overview?.activeInstructors?.toLocaleString() ?? "0",
      change: `${overview?.instructorsWithZeroCredits ?? 0} with 0 credits`,
      icon: GraduationCap,
      trend: "up" as const,
    },
    {
      title: "Accepted leads",
      value: overview?.acceptedLeads?.toLocaleString() ?? "0",
      change: `${overview?.leadAcceptanceRate?.toFixed(2) ?? "0.00"}% acceptance rate`,
      icon: CalendarCheck,
      trend: "up" as const,
    },
    {
      title: "Revenue",
      value: `$${(overview?.totalRevenue ?? 0).toLocaleString()}`,
      change: `${overview?.creditPacksSold ?? 0} packs sold`,
      icon: DollarSign,
      trend: "up" as const,
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <SlideBottom
          key={stat.title}
          delay={i * 0.1}
          className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md"
        >
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </h3>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <stat.icon className="size-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {isLoading ? "—" : stat.value}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              <span
                className={
                  stat.trend === "up"
                    ? "font-medium text-primary"
                    : "font-medium text-destructive"
                }
              >
                {stat.change}
              </span>
            </p>
          </div>
        </SlideBottom>
      ))}
    </div>
  )
}

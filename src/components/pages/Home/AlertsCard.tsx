import { AlertTriangle, Clock3, MessageSquareWarning, Users } from "lucide-react"
import { SlideBottom } from "@/components/animation"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"

export default function AlertsCard() {
  const { data, isLoading } = useGetDashboardStatistics()
  const alerts = data?.alerts

  // console.log(alerts?.instructorsWith3OpenLeads?.count)

  const alertItems = [
    {
      title: "Pending over 24h",
      value: alerts?.pendingMoreThan24h ?? 0,
      icon: Clock3,
    },
    {
      title: "Below 20% acceptance",
      value: alerts?.instructorsBelow20Acceptance ?? 0,
      icon: AlertTriangle,
    },
    {
      title: "3+ open leads",
      value: alerts?.instructorsWith3OpenLeads?.count ?? 0,
      icon: Users,
    },
    {
      title: "Suspicious WhatsApp",
      value: alerts?.suspiciousWhatsapp.length ?? 0,
      icon: MessageSquareWarning,
    },
  ]

  return (
    <SlideBottom delay={0.2} className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Alerts</h3>
          <p className="mt-1 text-sm text-muted-foreground">Operational warnings from the latest dashboard statistics</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading alerts…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {alertItems.map((item) => (
            <div key={item.title} className="rounded-lg border border-border/70 bg-background/70 p-4">
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <item.icon className="size-5" />
              </div>
              <div className="text-2xl font-semibold text-foreground">{item.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{item.title}</div>
            </div>
          ))}
        </div>
      )}
    </SlideBottom>
  )
}

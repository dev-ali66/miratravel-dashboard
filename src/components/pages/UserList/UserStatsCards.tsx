import { Users, UserCheck, ShieldCheck, Crown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { UserStats } from "@/hooks/users/useGetUsers"

interface UserStatsCardsProps {
  stats?: UserStats
  isLoading?: boolean
}

export default function UserStatsCards({ stats, isLoading }: UserStatsCardsProps) {
  const cards = [
    {
      title: "Total Registered",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Active Accounts",
      value: stats?.activeUsers ?? 0,
      icon: UserCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Verified Users",
      value: stats?.verifiedUsers ?? 0,
      icon: ShieldCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Administrators",
      value: stats?.adminUsers ?? 0,
      icon: Crown,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card
            key={idx}
            className="border-border/60 bg-card/60 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-border hover:shadow-md"
          >
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </span>
                <span className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {isLoading ? (
                    <span className="inline-block h-7 w-12 animate-pulse rounded bg-muted"></span>
                  ) : (
                    card.value
                  )}
                </span>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${card.bg} ${card.border} ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

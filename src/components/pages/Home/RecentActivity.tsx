import { SlideBottom, SlideLeft } from "@/components/animation"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"

export default function RecentActivity({ className }: { className?: string }) {
  const { data, isLoading } = useGetDashboardStatistics()
  const purchases = data?.recentPurchases ?? []

  return (
    <SlideBottom
      delay={0.4}
      className={`rounded-xl border border-border bg-card shadow-sm flex flex-col ${className || ""}`}
    >
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Recent Purchases</h3>
          <p className="text-sm text-muted-foreground mt-1">Latest instructor credit purchases</p>
        </div>
      </div>

      <div className="flex-1 p-6 pt-0">
        {isLoading ? (
          <div className="mt-4 text-sm text-muted-foreground">Loading purchases…</div>
        ) : purchases.length === 0 ? (
          <div className="mt-4 text-sm text-muted-foreground">No recent purchases found.</div>
        ) : (
          <div className="space-y-6 mt-4">
            {purchases.map((purchase, index) => (
              <SlideLeft
                delay={0.5 + index * 0.1}
                key={purchase.id}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 font-semibold text-sm text-primary transition-transform group-hover:scale-110">
                    {purchase.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{purchase.name}</span>
                    <span className="text-xs text-muted-foreground">{purchase.email}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">${purchase.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{purchase.credits} credits</div>
                </div>
              </SlideLeft>
            ))}
          </div>
        )}
      </div>
    </SlideBottom>
  )
}

import { SlideBottom, SlideLeft } from "@/components/animation"
import { useGetDashboardStatistics, type DashboardRecentActivity } from "@/hooks/analysis/useGetDashboardStatistics"
import { CalendarDays, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

const statusBadgeStyles: Record<string, string> = {
  REQUEST_SUBMITTED: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  UNDER_REVIEW: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  APPROVED: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  CONFIRMED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  REJECTED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
}

export default function RecentActivity({ className }: { className?: string }) {
  const { data, isLoading } = useGetDashboardStatistics()
  const bookings: DashboardRecentActivity[] = data?.recentActivity ?? []

  return (
    <SlideBottom
      delay={0.4}
      className={`flex flex-col rounded-xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl ${className || ""}`}
    >
      <div className="flex items-center justify-between pb-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Recent Bookings
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Latest travel inquiries and confirmed bookings
          </p>
        </div>
        <Link
          to="/bookings"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex-1 pt-2">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
            <span className="inline-block h-6 w-32 animate-pulse rounded bg-muted/60"></span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <CalendarDays className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium">No bookings yet</p>
            <p className="text-xs">Incoming travel requests will appear here in real-time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking, index) => {
              const travelerName = booking.travelerName || "Guest Traveler"
              const journeyTitle = booking.journeyTitle || "Custom Journey"
              const statusStyle = statusBadgeStyles[booking.bookingStatus] || "bg-muted text-muted-foreground"

              return (
                <SlideLeft
                  delay={0.5 + index * 0.08}
                  key={booking.id}
                  className="group flex items-center justify-between rounded-lg border border-border/40 bg-background/40 p-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {travelerName[0]?.toUpperCase() || "T"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-foreground truncate max-w-[150px]">
                        {travelerName}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[170px]">
                        {journeyTitle} • {booking.bookingNumber}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">
                      {booking.currency} {booking.amount.toLocaleString()}
                    </div>
                    <span className={cn("inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", statusStyle)}>
                      {booking.bookingStatus.replace("_", " ")}
                    </span>
                  </div>
                </SlideLeft>
              )
            })}
          </div>
        )}
      </div>
    </SlideBottom>
  )
}

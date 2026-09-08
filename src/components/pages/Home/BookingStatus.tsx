import { motion } from "framer-motion"
import { SlideLeft } from "@/components/animation"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"

export default function BookingStatus({ className }: { className?: string }) {
  const { data, isLoading } = useGetDashboardStatistics()
  const bStatus = data?.bookingStatus
  const totalBookings = data?.overview?.totalBookings ?? 0

  const confirmedCount = bStatus?.confirmed ?? 0
  const underReviewCount = bStatus?.underReview ?? 0
  const depositDueCount = bStatus?.depositDue ?? 0
  const cancelledCount = bStatus?.cancelled ?? 0

  const statuses = [
    {
      name: "Confirmed",
      value: confirmedCount,
      color: "text-emerald-500",
      stroke: "stroke-emerald-500",
    },
    {
      name: "Under Review",
      value: underReviewCount,
      color: "text-blue-500",
      stroke: "stroke-blue-500",
    },
    {
      name: "Deposit / Due",
      value: depositDueCount,
      color: "text-purple-500",
      stroke: "stroke-purple-500",
    },
    {
      name: "Cancelled",
      value: cancelledCount,
      color: "text-rose-500",
      stroke: "stroke-rose-500",
    },
  ]

  const totalValue = Math.max(
    statuses.reduce((sum, status) => sum + status.value, 0),
    1
  )
  const c = 251.2
  let offset = 0

  return (
    <SlideLeft
      delay={0.5}
      className={`flex flex-col rounded-xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl ${className || ""}`}
    >
      <div className="mb-2">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Booking Distribution
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Current booking workflow status breakdown
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center py-6">
        <div className="relative size-48">
          <svg
            className="size-full -rotate-90 transform drop-shadow-md"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeWidth="12"
              className="stroke-muted/40"
            />
            {statuses.map((status, index) => {
              const strokeDasharray = `${(status.value / totalValue) * c} ${c}`
              const strokeDashoffset = -offset
              offset += (status.value / totalValue) * c

              return (
                <motion.circle
                  key={status.name}
                  initial={{ strokeDasharray: `0 ${c}` }}
                  animate={{ strokeDasharray }}
                  transition={{
                    duration: 1.8,
                    delay: 0.6 + index * 0.15,
                    type: "spring",
                    bounce: 0.15,
                    stiffness: 40,
                    damping: 12,
                  }}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeWidth="12"
                  className={status.stroke}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {isLoading ? (
                <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted/60"></span>
              ) : (
                totalBookings
              )}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Total Bookings
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/60 pt-4">
        {statuses.map((status) => (
          <div
            key={status.name}
            className="flex flex-col items-center gap-1 pt-2"
          >
            <div
              className={`size-3 rounded-full bg-current ${status.color} shadow-sm`}
            />
            <span className="text-xs font-semibold text-foreground">
              {status.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {totalBookings > 0 ? Math.round((status.value / totalValue) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </SlideLeft>
  )
}

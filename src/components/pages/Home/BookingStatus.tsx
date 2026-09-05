import { motion } from "framer-motion"
import { SlideLeft } from "@/components/animation"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"

export default function BookingStatus({ className }: { className?: string }) {
  const { data } = useGetDashboardStatistics()
  const overview = data?.overview

  const statuses = [
    {
      name: "Accepted",
      value: overview?.acceptedLeads ?? 0,
      color: "text-primary",
      stroke: "stroke-primary",
    },
    {
      name: "Pending",
      value: overview?.pendingLeads ?? 0,
      color: "text-amber-500",
      stroke: "stroke-amber-500",
    },
    {
      name: "Declined",
      value: overview?.declinedLeads ?? 0,
      color: "text-destructive",
      stroke: "stroke-destructive",
    },
    {
      name: "Expired",
      value: overview?.expiredLeads ?? 0,
      color: "text-slate-500",
      stroke: "stroke-slate-500",
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
      delay={0.6}
      className={`flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm ${className || ""}`}
    >
      <div className="mb-2">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Lead Status
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Current lead distribution
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
              className="stroke-muted"
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
              {overview?.totalLeads ?? 0}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Total Leads
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border pt-4">
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
              {Math.round((status.value / totalValue) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </SlideLeft>
  )
}

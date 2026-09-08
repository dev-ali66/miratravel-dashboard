import { motion } from "framer-motion"
import { SlideBottom } from "@/components/animation"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"

export default function OverviewChart({ className }: { className?: string }) {
  const { data, isLoading } = useGetDashboardStatistics()
  const chartData = data?.charts?.revenueOverview ?? []
  const max = Math.max(...chartData.map((item) => item.total), 1)

  return (
    <SlideBottom
      delay={0.3}
      className={`rounded-xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl ${className || ""}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Revenue Overview
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Monthly gross booking revenue across the year
          </p>
        </div>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          Live Sync
        </span>
      </div>

      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center text-xs text-muted-foreground">
          <span className="inline-block h-6 w-32 animate-pulse rounded bg-muted/60"></span>
        </div>
      ) : (
        <div className="flex h-[300px] items-end justify-between gap-1 pt-6 sm:gap-2">
          {chartData.map((item, index) => {
            const heightPercent = item.total > 0 ? Math.max((item.total / max) * 100, 4) : 2

            return (
              <div
                key={item.name}
                className="group relative flex h-full w-full flex-col items-center justify-end gap-2"
              >
                {/* Tooltip */}
                <div className="pointer-events-none absolute -top-9 z-20 hidden rounded-md bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background opacity-0 shadow-lg transition-opacity group-hover:block group-hover:opacity-100 whitespace-nowrap">
                  ${item.total.toLocaleString()}
                </div>

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.04 + 0.3,
                    type: "spring",
                    stiffness: 60,
                    damping: 15,
                  }}
                  className={`w-full max-w-[36px] rounded-t-md transition-all duration-200 ${
                    item.total > 0
                      ? "bg-primary/40 group-hover:bg-primary shadow-xs"
                      : "bg-muted/40 group-hover:bg-muted"
                  }`}
                />

                {/* Month Label */}
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.name}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </SlideBottom>
  )
}

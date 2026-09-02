import { motion } from "framer-motion"
import { SlideBottom } from "@/components/animation"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"

export default function OverviewChart({ className }: { className?: string }) {
  const { data, isLoading } = useGetDashboardStatistics()
  const chartData = data?.charts?.revenueOverview ?? []
  const max = Math.max(...chartData?.map((item) => item.total), 1)
//  console.log("....")
  return (
    <SlideBottom
      delay={0.3}
      className={`rounded-xl border border-border bg-card p-6 shadow-sm ${className || ""}`}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Revenue Overview</h3>
        <p className="text-sm text-muted-foreground mt-1">Monthly revenue from the latest dashboard data</p>
      </div>

      {isLoading ? (
        <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
          Loading chart…
        </div>
      ) : (
        <div className="flex h-[320px] items-end justify-between gap-1 sm:gap-2 pt-4">
          {chartData.map((item, index) => (
            <div key={item.name} className="group relative flex h-full w-full flex-col items-center justify-end gap-2">
              <div className="absolute -top-10 hidden rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-lg opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-10 pointer-events-none">
                ${item.total.toLocaleString()}
              </div>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.total / max) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.5, type: "spring", stiffness: 50 }}
                className="w-full max-w-[40px] rounded-t-md bg-primary/20 transition-colors group-hover:bg-primary"
              />

              <span className="text-xs text-muted-foreground font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </SlideBottom>
  )
}

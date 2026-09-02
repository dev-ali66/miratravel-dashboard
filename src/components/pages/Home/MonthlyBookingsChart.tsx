import { motion } from "framer-motion"
import { SlideBottom } from "@/components/animation"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"

export default function MonthlyBookingsChart({ className }: { className?: string }) {
  const { data, isLoading } = useGetDashboardStatistics()
  const chartData = data?.charts?.monthlyBookings ?? []
  const max = Math.max(...chartData.map((item) => item.total), 1)

  return (
    <SlideBottom
      delay={0.4}
      className={`rounded-xl border border-border bg-card p-6 shadow-sm ${className || ""}`}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Monthly Bookings</h3>
        <p className="text-sm text-muted-foreground mt-1">Lead bookings across the year</p>
      </div>

      {isLoading ? (
        <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
          Loading chart…
        </div>
      ) : (
        <div className="flex h-80 items-end justify-between gap-1 sm:gap-2 pt-4">
          {chartData.map((item, index) => (
            <div key={item.name} className="group relative flex h-full w-full flex-col items-center justify-end gap-2">
              <div className="absolute -top-10 hidden rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-10 pointer-events-none">
                {item.total} Bookings
              </div>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.total / max) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.5, type: "spring", stiffness: 50 }}
                className="w-full max-w-10 rounded-t-md bg-secondary transition-all group-hover:bg-secondary/80 group-hover:shadow-[0_0_15px_rgba(var(--secondary),0.3)]"
              />

              <span className="text-xs text-muted-foreground font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </SlideBottom>
  )
}

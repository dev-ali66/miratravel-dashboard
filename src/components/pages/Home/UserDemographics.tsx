import { motion } from "framer-motion"
import { SlideBottom } from "@/components/animation"
import { Users } from "lucide-react"

const demographics = [
  { group: "18-24", value: 15, color: "bg-muted" },
  { group: "25-34", value: 45, color: "bg-primary" },
  { group: "35-44", value: 25, color: "bg-secondary" },
  { group: "45-54", value: 10, color: "bg-accent" },
  { group: "55+", value: 5, color: "bg-destructive" },
]

export default function UserDemographics({ className }: { className?: string }) {
  return (
    <SlideBottom 
      delay={0.5}
      className={`rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col ${className || ''}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">User Demographics</h3>
          <p className="text-sm text-muted-foreground mt-1">Age distribution of your visitors</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Users className="size-5" />
        </div>
      </div>

      <div className="flex flex-col gap-6 pt-2">
        {/* Stacked Progress Bar */}
        <div className="h-6 w-full flex overflow-hidden rounded-full border border-border/50">
          {demographics.map((demo, i) => (
            <motion.div
              key={demo.group}
              initial={{ width: 0 }}
              animate={{ width: `${demo.value}%` }}
              transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
              className={`h-full ${demo.color} border-r border-background/20 last:border-0 relative group`}
            >
              {/* Tooltip for small segments */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-lg opacity-0 transition-opacity group-hover:block group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                {demo.group}: {demo.value}%
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 mt-auto border-t border-border">
          {demographics.map((demo) => (
            <div key={demo.group} className="flex items-center gap-2">
              <div className={`size-3 rounded-sm ${demo.color}`} />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">{demo.group}</span>
                <span className="text-xs text-muted-foreground">{demo.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideBottom>
  )
}

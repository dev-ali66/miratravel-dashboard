import { motion } from "framer-motion"
import { SlideBottom } from "@/components/animation"

const data = [
  { day: "1", rate: 2.1 },
  { day: "5", rate: 2.4 },
  { day: "10", rate: 2.8 },
  { day: "15", rate: 3.2 },
  { day: "20", rate: 3.5 },
  { day: "25", rate: 4.1 },
  { day: "30", rate: 4.5 },
]

const max = 5

export default function ConversionRate({ className }: { className?: string }) {
  return (
    <SlideBottom 
      delay={0.3}
      className={`rounded-xl border border-border bg-card p-6 shadow-sm ${className || ''}`}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Conversion Rate</h3>
        <p className="text-sm text-muted-foreground mt-1">Visitor to booking conversion over 30 days</p>
      </div>
      
      <div className="flex h-[320px] items-end justify-between gap-2 pt-4 relative">
        {/* Y-axis guidelines */}
        <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
          {[5, 4, 3, 2, 1, 0].map(val => (
            <div key={val} className="flex items-center w-full gap-2 opacity-30">
              <span className="text-xs font-medium w-4">{val}%</span>
              <div className="h-px flex-1 border-t border-dashed border-foreground/30" />
            </div>
          ))}
        </div>

        {data.map((item, i) => (
          <div key={item.day} className="group relative z-10 flex h-full w-full flex-col items-center justify-end gap-2">
            {/* Tooltip */}
            <div className="absolute -top-10 hidden rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-lg opacity-0 transition-opacity group-hover:block group-hover:opacity-100 pointer-events-none whitespace-nowrap">
              Day {item.day}: {item.rate}%
            </div>
            
            {/* Bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.rate / max) * 100}%` }}
              transition={{ duration: 1, delay: i * 0.1 + 0.4, type: "spring", stiffness: 50 }}
              className="w-full max-w-[40px] rounded-t-md bg-primary/40 transition-colors group-hover:bg-primary"
            />
            
            {/* Label */}
            <span className="text-xs text-muted-foreground font-medium">{item.day}</span>
          </div>
        ))}
      </div>
    </SlideBottom>
  )
}

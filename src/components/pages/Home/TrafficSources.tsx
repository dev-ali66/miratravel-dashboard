import { motion } from "framer-motion"
import { SlideLeft } from "@/components/animation"
import { Globe, Search, Share2 } from "lucide-react"

const sources = [
  {
    name: "Organic Search",
    value: 45,
    icon: Search,
    color: "text-primary",
    bg: "bg-primary/10",
    bar: "bg-primary",
  },
  {
    name: "Social Media",
    value: 35,
    icon: Share2,
    color: "text-secondary-foreground",
    bg: "bg-secondary",
    bar: "bg-secondary-foreground",
  },
  {
    name: "Direct Traffic",
    value: 20,
    icon: Globe,
    color: "text-accent",
    bg: "bg-accent/10",
    bar: "bg-accent",
  },
]

export default function TrafficSources({ className }: { className?: string }) {
  return (
    <SlideLeft
      delay={0.4}
      className={`flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm ${className || ""}`}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Traffic Sources
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Where your visitors are coming from
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-6 pt-2">
        {sources.map((source, i) => (
          <div key={source.name} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-lg ${source.bg} ${source.color}`}
              >
                <source.icon className="size-5" />
              </div>
              <div className="flex-1">
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-semibold text-foreground">
                    {source.name}
                  </span>
                  <span className="font-bold">{source.value}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${source.value}%` }}
                    transition={{
                      duration: 1,
                      delay: i * 0.15 + 0.6,
                      ease: "easeOut",
                    }}
                    className={`h-full rounded-full ${source.bar}`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SlideLeft>
  )
}

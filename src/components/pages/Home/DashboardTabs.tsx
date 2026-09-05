import { motion } from "framer-motion"

export const tabs = ["Overview", "Analytics", "Reports"] as const
export type TabType = (typeof tabs)[number]

interface DashboardTabsProps {
  activeTab: TabType
  onChange: (tab: TabType) => void
}

export default function DashboardTabs({
  activeTab,
  onChange,
}: DashboardTabsProps) {
  return (
    <div className="hidden items-center rounded-lg border border-border bg-muted/40 p-1 shadow-sm md:flex">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTab === tab
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 rounded-md border border-border/50 bg-background shadow-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  )
}

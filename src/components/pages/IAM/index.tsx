import RolesTable from "./RolesTable"
import PermissionsTable from "./PermissionsTable"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Shield, Key } from "lucide-react"
import { motion } from "framer-motion"

type Tab = "roles" | "permissions"

export default function IAMPage() {
  const [activeTab, setActiveTab] = useState<Tab>("roles")

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "roles", label: "Roles", icon: Shield },
    { key: "permissions", label: "Permissions", icon: Key },
  ]

  return (
    <div className="w-full animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          IAM – Roles & Permissions
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage roles, assign permissions, and control access across the
          platform.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="mb-6 flex items-center gap-1 rounded-xl border border-border/60 bg-muted/20 p-1 backdrop-blur-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="iam-tab-pill"
                  className="absolute inset-0 rounded-lg bg-background shadow-sm border border-border/60"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.5,
                  }}
                />
              )}

              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === "roles" ? <RolesTable /> : <PermissionsTable />}
    </div>
  )
}

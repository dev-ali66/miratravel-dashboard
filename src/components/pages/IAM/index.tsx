import RolesTable from "./RolesTable"
import PermissionsTable from "./PermissionsTable"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Shield, Key, ShieldCheck, Lock } from "lucide-react"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import { motion } from "framer-motion"
import { useGetRoles } from "@/hooks/role/useRoles"
import { useGetPermissions } from "@/hooks/permission/usePermissions"

type Tab = "roles" | "permissions"

export default function IAMPage() {
  const [activeTab, setActiveTab] = useState<Tab>("roles")
  const { data: rolesData } = useGetRoles(1, 100)
  const { data: permsData } = useGetPermissions(1, 100)

  const totalRoles = rolesData?.meta?.total ?? rolesData?.data?.length ?? 0
  const totalPerms = permsData?.meta?.total ?? permsData?.data?.length ?? 0

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "roles", label: "Roles", icon: Shield },
    { key: "permissions", label: "Permissions", icon: Key },
  ]

  return (
    <div className="w-full animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={ShieldCheck}
        title="Roles & Permissions"
        subtitle="Manage roles, assign permissions, and control access across the platform."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Roles"
              value={totalRoles}
              subtext="Access tiers"
              icon={Shield}
              iconColor="text-indigo-500"
            />
            <CompactStatCard
              label="Permissions"
              value={totalPerms}
              subtext="Action scopes"
              icon={Key}
              iconColor="text-amber-500"
            />
            <CompactStatCard
              label="Engine"
              value="RBAC v2"
              subtext="Role verification"
              icon={ShieldCheck}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Security"
              value="Strict"
              subtext="Zero-trust auth"
              icon={Lock}
              iconColor="text-purple-500"
            />
          </div>
        }
      />

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

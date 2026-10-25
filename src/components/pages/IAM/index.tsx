import RolesTable from "./RolesTable"
import PermissionsTable from "./PermissionsTable"
import { useState } from "react"
import { Shield, Key, ShieldCheck, Lock, Plus } from "lucide-react"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import {
  FilterToolbar,
  FilterGroup,
  FilterTabs,
  FilterActions,
  FilterCreateButton,
  FilterResetButton,
} from "@/components/shared/FilterToolbar"
import { useGetRoles } from "@/hooks/role/useRoles"
import { useGetPermissions } from "@/hooks/permission/usePermissions"

type Tab = "roles" | "permissions"

export default function IAMPage() {
  const [activeTab, setActiveTab] = useState<Tab>("roles")
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false)
  const [showCreatePermModal, setShowCreatePermModal] = useState(false)

  const { data: rolesData, refetch: refetchRoles } = useGetRoles(1, 100)
  const { data: permsData, refetch: refetchPerms } = useGetPermissions(1, 100)

  const totalRoles = rolesData?.meta?.total ?? rolesData?.data?.length ?? 0
  const totalPerms = permsData?.meta?.total ?? permsData?.data?.length ?? 0

  return (
    <div className="w-full space-y-6 animate-in pt-2 duration-500 fade-in">
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

      {/* Unified Tab & Action Toolbar */}
      <FilterToolbar>
        <FilterGroup>
          <FilterTabs
            tabs={[
              { key: "roles", label: "Roles", icon: Shield, count: totalRoles },
              { key: "permissions", label: "Permissions", icon: Key, count: totalPerms },
            ]}
            activeTab={activeTab}
            onChange={(key) => setActiveTab(key as Tab)}
          />
        </FilterGroup>

        <FilterActions>
          {activeTab === "roles" ? (
            <FilterCreateButton
              onClick={() => setShowCreateRoleModal(true)}
              label="Create Role"
              icon={Plus}
            />
          ) : (
            <FilterCreateButton
              onClick={() => setShowCreatePermModal(true)}
              label="Create Permission"
              icon={Plus}
            />
          )}

          <FilterResetButton
            onClick={() => {
              if (activeTab === "roles") refetchRoles?.()
              else refetchPerms?.()
            }}
            title="Refresh"
          />
        </FilterActions>
      </FilterToolbar>

      {/* Content */}
      {activeTab === "roles" ? (
        <RolesTable
          showCreateModal={showCreateRoleModal}
          setShowCreateModal={setShowCreateRoleModal}
        />
      ) : (
        <PermissionsTable
          showCreateModal={showCreatePermModal}
          setShowCreateModal={setShowCreatePermModal}
        />
      )}
    </div>
  )
}

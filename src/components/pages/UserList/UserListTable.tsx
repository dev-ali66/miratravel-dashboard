import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useListingPagination } from "@/hooks/ui/useListingPagination"
import {
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  UserPlus,
  Crown,
  ShieldCheck,
  Shield,
  User,
  Compass,
  MoreVertical,
  Users,
  UserCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pagination } from "@/components/shared/Pagination"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import {
  FilterToolbar,
  FilterGroup,
  FilterSearch,
  FilterSelect,
  FilterActions,
  FilterExportButton,
  FilterCreateButton,
  FilterResetButton,
} from "@/components/shared/FilterToolbar"
import { useGetUsers, type UserItem } from "@/hooks/users/useGetUsers"
import { useEditUser } from "@/hooks/users/useEditUser"
import { triggerCsvExport, exportToCsv } from "@/lib/exportUtils"
import CreateUserModal from "./CreateUserModal"
import EditUserModal from "./EditUserModal"
import DeleteUserModal from "./DeleteUserModal"

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  INACTIVE: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  DEACTIVE: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  BLOCKED: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  SUSPENDED: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  PENDING: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  DELETED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  ARCHIVED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

const roleStyles: Record<string, { bg: string; icon: any }> = {
  ADMIN: { bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25", icon: Crown },
  MANAGER: { bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25", icon: ShieldCheck },
  EDITOR: { bg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25", icon: Shield },
  USER: { bg: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/25", icon: User },
}

export default function UserListTable() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [verifiedFilter, setVerifiedFilter] = useState("ALL")

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserItem | null>(null)
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<UserItem | null>(null)

  const filterKey = `${search}-${roleFilter}-${statusFilter}-${verifiedFilter}`

  const {
    mode,
    currentPage,
    setCurrentPage,
    setTargetItems,
    effectiveLimit,
    pageSizeOptions,
    displayItems: currentUsers,
    hasMore,
    isLoadingMore,
    handleLoadMore,
    setIncomingData,
  } = useListingPagination<UserItem>({
    mode: "infinite",
    initialTargetItems: 10,
    isGrid: false,
    filterKey,
    keyExtractor: (u) => u.id,
  })

  const { data, isLoading, isFetching, refetch } = useGetUsers(currentPage, effectiveLimit, {
    search: search || undefined,
    role: roleFilter,
    status: statusFilter,
    isVerified: verifiedFilter === "ALL" ? undefined : verifiedFilter,
  })

  useEffect(() => {
    if (data) {
      setIncomingData(data.data, data.meta?.total)
    }
  }, [data, setIncomingData])

  const { mutate: editUser } = useEditUser()

  const totalPages = data?.meta?.totalPages || 1
  const stats = data?.meta?.stats

  const handleStatusChange = (userId: string, newStatus: string) => {
    editUser({
      id: userId,
      status: newStatus,
    })
  }

  const handleResetFilters = () => {
    setSearch("")
    setRoleFilter("ALL")
    setStatusFilter("ALL")
    setVerifiedFilter("ALL")
    setCurrentPage(1)
  }

  // Rich Users CSV Export Handler
  const handleExportCSV = async () => {
    await triggerCsvExport({
      endpoint: "users",
      params: {
        search: search.trim() || undefined,
        role: roleFilter !== "ALL" ? roleFilter : undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        isVerified: verifiedFilter !== "ALL" ? verifiedFilter : undefined,
      },
      defaultFilename: `mira_users_export_${new Date().toISOString().split("T")[0]}.csv`,
      entityName: "Users",
      fallback: () => {
        const headers = [
          "User ID",
          "Email Address",
          "Full Name",
          "First Name",
          "Last Name",
          "Phone Number",
          "Role(s)",
          "Account Status",
          "Email Verified",
          "Total Bookings",
          "Registration Date",
        ]
        const rows = currentUsers.map((u) => [
          u.id,
          u.email,
          `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email.split("@")[0],
          u.firstName || "",
          u.lastName || "",
          u.phone || "",
          u.roles || "USER",
          u.status || "ACTIVE",
          u.isVerified ? "YES" : "NO",
          u.bookingsCount ?? 0,
          u.createdAt ? new Date(u.createdAt).toISOString() : "",
        ])
        exportToCsv(`mira_users_export_${new Date().toISOString().split("T")[0]}.csv`, headers, rows)
      },
    })
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Universal Page Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={User}
        title="Users"
        subtitle="Manage registered travelers, team roles, and account access."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Registered"
              value={stats?.totalUsers ?? 0}
              subtext="Total accounts"
              icon={Users}
              iconColor="text-primary"
            />
            <CompactStatCard
              label="Active Status"
              value={stats?.activeUsers ?? 0}
              subtext="Platform active"
              icon={UserCheck}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Verified"
              value={stats?.verifiedUsers ?? 0}
              subtext="Identity verified"
              icon={ShieldCheck}
              iconColor="text-purple-500"
            />
            <CompactStatCard
              label="Admins"
              value={stats?.adminUsers ?? 0}
              subtext="Staff & superadmin"
              icon={Crown}
              iconColor="text-amber-500"
            />
          </div>
        }
      />

      {/* Filter and Search Toolbar */}
      <FilterToolbar>
        <FilterGroup>
          {/* Search stretches to fill remaining space on the left */}
          <FilterSearch
            value={search}
            onChange={(val) => {
              setSearch(val)
              setCurrentPage(1)
            }}
            placeholder="Search users..."
            width="w-full flex-1 min-w-[200px]"
          />
        </FilterGroup>

        <FilterActions>
          {/* Role Filter */}
          <FilterSelect
            value={roleFilter}
            onChange={(val) => {
              setRoleFilter(val)
              setCurrentPage(1)
            }}
            options={[
              { label: "Admin", value: "ADMIN" },
              { label: "Manager", value: "MANAGER" },
              { label: "Editor", value: "EDITOR" },
              { label: "User", value: "USER" },
            ]}
            allLabel="All Roles"
            allValue="ALL"
            placeholder="All Roles"
            width="min-w-[105px] max-w-[130px]"
          />

          {/* Status Filter */}
          <FilterSelect
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val)
              setCurrentPage(1)
            }}
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
              { label: "Blocked", value: "BLOCKED" },
              { label: "Suspended", value: "SUSPENDED" },
              { label: "Pending", value: "PENDING" },
            ]}
            allLabel="All Statuses"
            allValue="ALL"
            placeholder="All Statuses"
            width="min-w-[105px] max-w-[130px]"
          />

          {/* Verification Filter */}
          <FilterSelect
            value={verifiedFilter}
            onChange={(val) => {
              setVerifiedFilter(val)
              setCurrentPage(1)
            }}
            options={[
              { label: "Verified", value: "true" },
              { label: "Unverified", value: "false" },
            ]}
            allLabel="All Verification"
            allValue="ALL"
            placeholder="All Verification"
            width="min-w-[110px] max-w-[140px]"
          />

          {/* Borderless Segmented Export CSV Button */}
          <FilterExportButton onClick={handleExportCSV} label="Export CSV" />

          <FilterCreateButton
            onClick={() => setIsCreateModalOpen(true)}
            label="User"
            icon={UserPlus}
          />

          {/* Far-Right Refresh Button */}
          <FilterResetButton
            onClick={() => {
              handleResetFilters()
              refetch?.()
            }}
            title="Refresh & Reset"
          />
        </FilterActions>
      </FilterToolbar>

      {/* Table Card */}
      <div className="rounded-md border border-border/60 bg-card/60 shadow-xs backdrop-blur-xl">
        <div className="overflow-x-clip">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-[96px] z-10 border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
              <tr>
                <th className="sticky top-[96px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3.5 font-semibold first:rounded-tl-md">User</th>
                <th className="sticky top-[96px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3.5 font-semibold">Role</th>
                <th className="sticky top-[96px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3.5 font-semibold">Status</th>
                <th className="sticky top-[96px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3.5 font-semibold">Verification</th>
                <th className="sticky top-[96px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3.5 font-semibold">Bookings</th>
                <th className="sticky top-[96px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3.5 font-semibold">Joined</th>
                <th className="sticky top-[96px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3.5 text-right font-semibold last:rounded-tr-md">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {isLoading && currentPage === 1 && currentUsers.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                        <div className="space-y-1.5">
                          <div className="h-4 w-28 rounded bg-muted"></div>
                          <div className="h-3 w-40 rounded bg-muted"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="h-6 w-16 rounded bg-muted"></div></td>
                    <td className="px-5 py-4"><div className="h-6 w-20 rounded bg-muted"></div></td>
                    <td className="px-5 py-4"><div className="h-6 w-20 rounded bg-muted"></div></td>
                    <td className="px-5 py-4"><div className="h-6 w-12 rounded bg-muted"></div></td>
                    <td className="px-5 py-4"><div className="h-4 w-20 rounded bg-muted"></div></td>
                    <td className="px-5 py-4 text-right"><div className="ml-auto h-8 w-8 rounded bg-muted"></div></td>
                  </tr>
                ))
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Compass className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-base font-medium">No users found</p>
                      <p className="text-xs">Try adjusting your search criteria or create a new user account.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => {
                  const displayName = user.firstName
                    ? `${user.firstName} ${user.lastName || ""}`.trim()
                    : user.email.split("@")[0]
                  const roleUpper = (user.roles || "USER").toUpperCase()
                  const roleConfig = roleStyles[roleUpper] || roleStyles.USER
                  const RoleIcon = roleConfig.icon

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      {/* User Info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary border border-primary/20">
                            {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground truncate max-w-[180px]">
                              {displayName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-5 py-3.5">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-semibold", roleConfig.bg)}>
                          <RoleIcon className="h-3 w-3" />
                          {roleUpper}
                        </span>
                      </td>

                      {/* Status Dropdown Pill */}
                      <td className="px-5 py-3.5">
                        <Select
                          value={user.status}
                          onValueChange={(val) => handleStatusChange(user.id, val)}
                        >
                          <SelectTrigger className={cn("h-7 w-[110px] text-xs font-semibold border rounded-full px-2.5", statusStyles[user.status] || "bg-muted")}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                            <SelectItem value="BLOCKED">Blocked</SelectItem>
                            <SelectItem value="SUSPENDED">Suspended</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Verification Status */}
                      <td className="px-5 py-3.5">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                            <XCircle className="h-4 w-4" />
                            Unverified
                          </span>
                        )}
                      </td>

                      {/* Bookings Count */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {user.bookingsCount ?? 0} bookings
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedUserForEdit(user)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title="Edit User"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => setSelectedUserForEdit(user)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit Account
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    user.id,
                                    user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"
                                  )
                                }
                              >
                                {user.status === "ACTIVE" ? (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4 text-rose-500" />
                                    Block User
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                                    Activate User
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setSelectedUserForDelete(user)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}

              {/* Subtle inline skeleton row during background fetch */}
              {Boolean(isLoadingMore || (isFetching && currentPage > 1)) && (
                <tr className="animate-pulse bg-muted/20 border-b border-border/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted/60" />
                      <div className="space-y-1">
                        <div className="h-4 w-28 rounded bg-muted/60" />
                        <div className="h-3 w-36 rounded bg-muted/40" />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><div className="h-6 w-16 rounded bg-muted/60" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-20 rounded bg-muted/60" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-20 rounded bg-muted/60" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-12 rounded bg-muted/60" /></td>
                  <td className="px-5 py-4"><div className="h-4 w-20 rounded bg-muted/60" /></td>
                  <td className="px-5 py-4 text-right"><div className="ml-auto h-8 w-8 rounded bg-muted/60" /></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        {(data?.meta?.total ?? 0) > 0 && (
          <Pagination
            mode={mode}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={data?.meta?.total}
            pageSize={effectiveLimit}
            pageSizeOptions={pageSizeOptions}
            onPageChange={setCurrentPage}
            onPageSizeChange={setTargetItems}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore || (isFetching && currentPage > 1)}
            onLoadMore={handleLoadMore}
            loadedCount={currentUsers.length}
            fixed={false}
            isTable
          />
        )}
      </div>

      {/* Modals */}
      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditUserModal
        user={selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
      />

      <DeleteUserModal
        user={selectedUserForDelete}
        onClose={() => setSelectedUserForDelete(null)}
      />
    </div>
  )
}

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, Loader2, Inbox, Users, Clock, CheckCircle2, ShieldAlert } from "lucide-react"
import { Pagination } from "@/components/shared/Pagination"
import { useListingPagination } from "@/hooks/ui/useListingPagination"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import {
  FilterToolbar,
  FilterGroup,
  FilterSearch,
  FilterTabs,
  FilterActions,
  FilterResetButton,
} from "@/components/shared/FilterToolbar"
import { useGetRequests } from "@/hooks/requests/useGetRequests"
import { useUpdateRequestStatus } from "@/hooks/requests/useUpdateRequestStatus"
import RequestDetailsModal from "./RequestDetailsModal"

export default function RequestListTable() {
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [verifiedFilter, setVerifiedFilter] = useState<string>("ALL")

  const {
    mode,
    currentPage,
    setCurrentPage,
    setTargetItems,
    effectiveLimit,
    pageSizeOptions,
    displayItems: requestList,
    hasMore,
    isLoadingMore,
    handleLoadMore,
    setIncomingData,
  } = useListingPagination<any>({
    mode: "infinite",
    initialTargetItems: 10,
    isGrid: false,
    keyExtractor: (r) => r.id,
  })

  const { data, isLoading, isFetching, isError, refetch } = useGetRequests(currentPage, effectiveLimit)
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateRequestStatus()

  useEffect(() => {
    if (data) {
      setIncomingData(data.data, data.meta?.total)
    }
  }, [data, setIncomingData])

  const totalPages = data?.meta?.totalPages || 1
  const totalCount = data?.meta?.total || requestList.length

  const metrics = useMemo(() => {
    const pending = requestList.filter((r: any) => r.status === "PENDING").length
    const approved = requestList.filter((r: any) => r.status === "APPROVED").length
    const rejected = requestList.filter((r: any) => r.status === "REJECTED").length
    return { pending, approved, rejected }
  }, [requestList])

  const filteredRequests = useMemo(() => {
    return requestList.filter((user: any) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const name = user.userPersonalInfo?.firstName
          ? `${user.userPersonalInfo.firstName} ${user.userPersonalInfo.lastName || ""}`.toLowerCase()
          : ""
        const email = (user.email || "").toLowerCase()
        const role = (user.roles?.[0]?.name || "").toLowerCase()
        if (!name.includes(q) && !email.includes(q) && !role.includes(q)) {
          return false
        }
      }
      if (verifiedFilter === "VERIFIED" && !user.isVerified) return false
      if (verifiedFilter === "PENDING" && user.isVerified) return false
      return true
    })
  }, [requestList, searchQuery, verifiedFilter])

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Universal Page Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={Inbox}
        title="Instructor Requests"
        subtitle="Review incoming requests to become an instructor."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Total Requests"
              value={totalCount}
              subtext="Applicant profiles"
              icon={Users}
              iconColor="text-primary"
            />
            <CompactStatCard
              label="Pending Review"
              value={metrics.pending}
              subtext="Awaiting decision"
              icon={Clock}
              iconColor="text-amber-500"
            />
            <CompactStatCard
              label="Approved"
              value={metrics.approved}
              subtext="Active instructors"
              icon={CheckCircle2}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Declined"
              value={metrics.rejected}
              subtext="Ineligible"
              icon={ShieldAlert}
              iconColor="text-rose-500"
            />
          </div>
        }
      />

      {/* Controls Bar */}
      <FilterToolbar>
        <FilterGroup>
          {/* Search expands to take all remaining space on left */}
          <FilterSearch
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder="Search by name, email, role..."
            width="w-full flex-1 min-w-[200px]"
          />
        </FilterGroup>

        <FilterActions>
          {/* Filter Tabs aligned to right */}
          <FilterTabs
            tabs={[
              { key: "ALL", label: "All Applicants" },
              { key: "PENDING", label: "Pending Review" },
              { key: "VERIFIED", label: "Verified / Approved" },
            ]}
            activeTab={verifiedFilter}
            onChange={(key) => setVerifiedFilter(key)}
          />

          {/* Far-Right Refresh Button */}
          <FilterResetButton
            onClick={() => {
              setSearchQuery("")
              setVerifiedFilter("ALL")
              refetch?.()
            }}
            title="Refresh & Reset"
          />
        </FilterActions>
      </FilterToolbar>

      <div className="min-h-100 overflow-hidden rounded-xl border border-border/60 bg-background/50 backdrop-blur-xl">
        {isLoading && currentPage === 1 && requestList.length === 0 ? (
          <div className="w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Skill Level
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right font-semibold tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted/60" />
                          <div className="flex w-full flex-col gap-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-muted/60" />
                            <div className="h-3 w-48 animate-pulse rounded bg-muted/40" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-20 animate-pulse rounded bg-muted/60" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-20 animate-pulse rounded-full bg-muted/60" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-8 w-8 animate-pulse rounded-sm bg-muted/60" />
                          <div className="h-8 w-8 animate-pulse rounded-sm bg-muted/60" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : isError ? (
          <div className="flex h-64 items-center justify-center text-rose-500">
            Failed to load requests.
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            No matching requests found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full overflow-hidden text-left text-sm">
                <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Skill Level
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right font-semibold tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((user, idx) => {
                    const name = user.userPersonalInfo?.firstName
                      ? `${user.userPersonalInfo.firstName} ${user.userPersonalInfo.lastName || ""}`
                      : "No Name"
                    const avatar =
                      user.userPersonalInfo?.photoUrl?.[0] ||
                      "https://i.pravatar.cc/150?u=default"
                    const role = user.roles?.[0]?.name || "USER"
                    const skillData = user.instructorInfo?.skill
                    const skill =
                      (Array.isArray(skillData)
                        ? skillData.join(", ")
                        : skillData) || "N/A"
                    const status = user.isVerified ? "Verified" : "Pending"

                    return (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        key={user.id}
                        className="group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30"
                      >
                        <td
                          className="cursor-pointer px-6 py-4 transition-colors hover:bg-muted/10"
                          onClick={() => setSelectedUser(user)}
                          title="View Details"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/20">
                              <img
                                src={avatar}
                                alt={name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
                                {name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-foreground capitalize">
                            {role.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground capitalize">
                          {skill.toLowerCase()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.isVerified
                              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                              : "border border-amber-500/20 bg-amber-500/10 text-amber-500"
                              }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <button
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-500 disabled:opacity-50"
                              title="Approve Request"
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus({
                                  id: user.id,
                                  isVerified: true,
                                  status: "ACTIVE",
                                })
                              }
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-50"
                              title="Reject Request"
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus({
                                  id: user.id,
                                  isVerified: false,
                                  status: "INACTIVE",
                                })
                              }
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}

                  {/* Subtle inline skeleton row during background fetch */}
                  {Boolean(isLoadingMore || (isFetching && currentPage > 1)) && (
                    <tr className="animate-pulse bg-muted/20 border-b border-border/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-muted/60" />
                          <div className="space-y-1">
                            <div className="h-4 w-28 rounded bg-muted/60" />
                            <div className="h-3 w-40 rounded bg-muted/40" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-muted/60" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 rounded bg-muted/60" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-16 rounded-full bg-muted/60" /></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 w-16 rounded-sm bg-muted/60 ml-auto" /></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

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
                loadedCount={requestList.length}
                fixed={false}
                isTable
              />
            )}
          </>
        )}
      </div>

      <RequestDetailsModal
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        isUpdating={isUpdating}
        updateStatus={updateStatus}
      />
    </div>
  )
}

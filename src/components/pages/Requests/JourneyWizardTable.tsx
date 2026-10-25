import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Compass, Calendar, Euro, Sparkles, Eye, Trash2, CheckCircle2, Mail, User, Phone, Clock } from "lucide-react"
import { Pagination } from "@/components/shared/Pagination"
import { useListingPagination } from "@/hooks/ui/useListingPagination"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import {
  FilterToolbar,
  FilterGroup,
  FilterSearch,
  FilterTabs,
  FilterResetButton,
} from "@/components/shared/FilterToolbar"
import {
  useGetJourneyWizardRequests,
  useUpdateJourneyWizardRequestStatus,
  useDeleteJourneyWizardRequest,
  type JourneyWizardRequestItem,
} from "@/hooks/requests/useGetJourneyWizardRequests"
import JourneyWizardDetailsModal from "./JourneyWizardDetailsModal"

export default function JourneyWizardTable() {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedRequest, setSelectedRequest] = useState<JourneyWizardRequestItem | null>(null)

  const filterKey = `${searchQuery}-${selectedStatusFilter}`

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
  } = useListingPagination<JourneyWizardRequestItem>({
    mode: "infinite",
    initialTargetItems: 10,
    isGrid: false,
    filterKey,
    keyExtractor: (r) => r.id,
  })

  const { data, isLoading, isFetching, isError } = useGetJourneyWizardRequests(
    currentPage,
    effectiveLimit,
    selectedStatusFilter || undefined,
    searchQuery || undefined
  )
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateJourneyWizardRequestStatus()
  const { mutate: deleteRequest } = useDeleteJourneyWizardRequest()

  const rawData = data as any
  const totalPages =
    rawData?.meta?.totalPages || rawData?.data?.pagination?.totalPages || 1
  const totalItems =
    rawData?.meta?.total || rawData?.data?.pagination?.total || 0

  useEffect(() => {
    if (rawData) {
      const items = Array.isArray(rawData?.data)
        ? rawData.data
        : rawData?.data?.items || []
      setIncomingData(items, totalItems)
    }
  }, [rawData, totalItems, setIncomingData])

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this wizard request?")) {
      deleteRequest(id)
    }
  }

  const newCount = requestList.filter((r) => r.status === "NEW").length
  const contactedCount = requestList.filter((r) => r.status === "CONTACTED").length
  const inProgressCount = requestList.filter((r) => r.status === "IN_PROGRESS").length
  const closedCount = requestList.filter((r) => r.status === "CLOSED").length

  return (
    <div className="w-full space-y-6 animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Universal Page Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={Compass}
        title="Journey Requests"
        subtitle="Travel wizard preference submissions from frontend explorers."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Total Requests"
              value={totalItems}
              subtext="Wizard submissions"
              icon={Compass}
              iconColor="text-primary"
            />
            <CompactStatCard
              label="New / Unread"
              value={newCount}
              subtext="Awaiting contact"
              icon={Sparkles}
              iconColor="text-blue-500"
            />
            <CompactStatCard
              label="In Follow-Up"
              value={contactedCount + inProgressCount}
              subtext="In proposal stage"
              icon={Clock}
              iconColor="text-amber-500"
            />
            <CompactStatCard
              label="Completed"
              value={closedCount}
              subtext="Finalized & booked"
              icon={CheckCircle2}
              iconColor="text-emerald-500"
            />
          </div>
        }
      />

      {/* Controls Bar */}
      <FilterToolbar>
        <FilterGroup>
          <FilterSearch
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val)
              setCurrentPage(1)
            }}
            placeholder="Search by name, email, phone..."
            width="w-44 sm:w-60 shrink-0"
          />

          <FilterTabs
            tabs={[
              { key: "", label: "All Requests" },
              { key: "NEW", label: "New" },
              { key: "CONTACTED", label: "Contacted" },
              { key: "IN_PROGRESS", label: "In Progress" },
              { key: "CLOSED", label: "Closed" },
            ]}
            activeTab={selectedStatusFilter}
            onChange={(key) => {
              setSelectedStatusFilter(key)
              setCurrentPage(1)
            }}
          />

          {(searchQuery || selectedStatusFilter !== "") && (
            <FilterResetButton
              onClick={() => {
                setSearchQuery("")
                setSelectedStatusFilter("")
                setCurrentPage(1)
              }}
            />
          )}
        </FilterGroup>
      </FilterToolbar>

      {/* Table Container */}
      <div className="min-h-100 overflow-hidden rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xl">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            Loading journey wizard submissions...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-xs text-destructive">
            Failed to load journey wizard submissions.
          </div>
        ) : requestList.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-2">
            <Compass className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-semibold text-foreground">No submissions found</p>
            <p className="text-xs text-muted-foreground">
              {searchQuery
                ? `No submissions match "${searchQuery}".`
                : selectedStatusFilter
                ? `No submissions match status filter "${selectedStatusFilter}".`
                : "No journey wizard submissions received yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 bg-muted/40 text-[11px] text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Date Received</th>
                    <th className="px-5 py-3.5 font-semibold">Requester Contact</th>
                    <th className="px-5 py-3.5 font-semibold">Duration & Budget</th>
                    <th className="px-5 py-3.5 font-semibold">Journey Types</th>
                    <th className="px-5 py-3.5 font-semibold">Styles & Pace</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {requestList.map((req, idx) => {
                    const formattedDate = new Date(req.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })

                    return (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.2 }}
                        onClick={() => setSelectedRequest(req)}
                        className="group hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        {/* Date */}
                        <td className="px-5 py-3.5 font-medium text-foreground whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* Requester Contact */}
                        <td className="px-5 py-3.5 max-w-[220px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-foreground truncate flex items-center gap-1">
                              <User className="h-3 w-3 text-primary shrink-0" />
                              <span className="truncate">{req.name || "Explorer"}</span>
                            </span>
                            {req.email ? (
                              <a
                                href={`mailto:${req.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11px] text-primary hover:underline truncate flex items-center gap-1"
                              >
                                <Mail className="h-2.5 w-2.5 shrink-0" />
                                <span className="truncate">{req.email}</span>
                              </a>
                            ) : (
                              <span className="text-[11px] text-muted-foreground italic">No email</span>
                            )}
                            {req.phone && (
                              <span className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                                <Phone className="h-2.5 w-2.5 text-emerald-600 shrink-0" />
                                {req.phone}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Duration & Budget */}
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-primary" />
                              {req.duration || "Custom Days"}
                            </span>
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                              <Euro className="h-3 w-3" />
                              {req.budgetText || (req.budget ? `€${req.budget}` : "Not set")}
                            </span>
                          </div>
                        </td>

                        {/* Journey Types */}
                        <td className="px-5 py-3.5 max-w-[180px]">
                          {req.journeyTypes && req.journeyTypes.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {req.journeyTypes.slice(0, 2).map((t) => (
                                <span
                                  key={t}
                                  className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary"
                                >
                                  {t}
                                </span>
                              ))}
                              {req.journeyTypes.length > 2 && (
                                <span className="text-[10px] text-muted-foreground font-medium">
                                  +{req.journeyTypes.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Any</span>
                          )}
                        </td>

                        {/* Styles & Pace */}
                        <td className="px-5 py-3.5 max-w-[180px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-foreground truncate font-medium">
                              {req.travelStyles && req.travelStyles.length > 0
                                ? req.travelStyles.join(", ")
                                : "General Discovery"}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                              {req.pace || "Balanced"} • {req.comfortLevel || "Comfort"}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                              req.status === "NEW"
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : req.status === "CONTACTED"
                                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                : req.status === "IN_PROGRESS"
                                ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                                : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedRequest(req)}
                              className="rounded-md border border-border bg-background p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="h-3.5 w-3.5 text-primary" />
                            </button>

                            {req.status !== "CLOSED" && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => updateStatus({ id: req.id, status: "CLOSED" })}
                                className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-1.5 text-emerald-600 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                                title="Mark as Closed"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => handleDelete(req.id, e)}
                              className="rounded-md border border-destructive/30 bg-destructive/10 p-1.5 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
                              title="Delete Submission"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Universal Pagination */}
            {totalItems > 0 && (
              <div className="border-t border-border/60 bg-background/50 p-4">
                <Pagination
                  mode={mode}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={effectiveLimit}
                  pageSizeOptions={pageSizeOptions}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setTargetItems}
                  hasMore={hasMore}
                  isLoadingMore={isLoadingMore || (isFetching && currentPage > 1)}
                  onLoadMore={handleLoadMore}
                  loadedCount={requestList.length}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      <JourneyWizardDetailsModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  )
}

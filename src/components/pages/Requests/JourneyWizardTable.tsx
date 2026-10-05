import { useState } from "react"
import { motion } from "framer-motion"
import { Compass, Calendar, Euro, Sparkles, Eye, Trash2, CheckCircle2, Search, X, Mail, User, Phone } from "lucide-react"
import Pagination from "@/components/pages/UserList/Pagination"
import {
  useGetJourneyWizardRequests,
  useUpdateJourneyWizardRequestStatus,
  useDeleteJourneyWizardRequest,
  type JourneyWizardRequestItem,
} from "@/hooks/requests/useGetJourneyWizardRequests"
import JourneyWizardDetailsModal from "./JourneyWizardDetailsModal"

export default function JourneyWizardTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedRequest, setSelectedRequest] = useState<JourneyWizardRequestItem | null>(null)
  const limit = 10

  const { data, isLoading, isError } = useGetJourneyWizardRequests(
    currentPage,
    limit,
    selectedStatusFilter || undefined,
    searchQuery || undefined
  )
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateJourneyWizardRequestStatus()
  const { mutate: deleteRequest } = useDeleteJourneyWizardRequest()

  const rawData = data as any
  const requestList: JourneyWizardRequestItem[] = Array.isArray(rawData?.data)
    ? rawData.data
    : rawData?.data?.items || []

  const totalPages =
    rawData?.meta?.totalPages || rawData?.data?.pagination?.totalPages || 1

  const totalItems =
    rawData?.meta?.total || rawData?.data?.pagination?.total || (Array.isArray(rawData?.data) ? rawData.data.length : 0)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this wizard request?")) {
      deleteRequest(id)
    }
  }

  return (
    <div className="w-full animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Header & Controls Bar */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground">
            <Compass className="h-7 w-7 text-primary" /> Journey Planner Submissions ({totalItems})
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Curated travel wizard preference submissions received from frontend explorers.
          </p>
        </div>

        {/* Search Bar and Status Filter Badges */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by name, email, phone..."
              className="w-full rounded-xl border border-border/60 bg-background/80 pl-9 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setCurrentPage(1)
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Badges */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border/60 bg-muted/20 p-1">
            {[
              { label: "All Requests", value: "" },
              { label: "New", value: "NEW" },
              { label: "Contacted", value: "CONTACTED" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Closed", value: "CLOSED" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setSelectedStatusFilter(tab.value)
                  setCurrentPage(1)
                }}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedStatusFilter === tab.value
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-border/60 bg-background/50 p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
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

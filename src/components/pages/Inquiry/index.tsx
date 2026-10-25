import { useState, useEffect } from "react"
import {
  Inbox,
  Eye,
  Trash2,
  Calendar,
  Mail,
  Phone,
  User,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { Pagination } from "@/components/shared/Pagination"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import {
  FilterToolbar,
  FilterGroup,
  FilterSearch,
  FilterSelect,
  FilterActions,
  FilterExportButton,
  FilterResetButton,
} from "@/components/shared/FilterToolbar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useListingPagination } from "@/hooks/ui/useListingPagination"
import {
  useGetInquiries,
  useUpdateInquiryStatus,
  useDeleteInquiry,
  type InquiryItem,
} from "@/hooks/inquiry/useInquiries"

const statusStyles: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  IN_REVIEW: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  CONTACTED: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  CLOSED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
}

export default function InquiryPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null)

  const filterKey = `${search}-${statusFilter}`

  const {
    mode,
    currentPage,
    setCurrentPage,
    setTargetItems,
    effectiveLimit,
    pageSizeOptions,
    displayItems: inquiries,
    hasMore,
    isLoadingMore,
    handleLoadMore,
    setIncomingData,
  } = useListingPagination<InquiryItem>({
    mode: "infinite",
    initialTargetItems: 10,
    isGrid: false,
    filterKey,
    keyExtractor: (i) => i.id,
  })

  const { data, isLoading, isFetching, isError, refetch } = useGetInquiries({
    page: currentPage,
    limit: effectiveLimit,
    search: search.trim() || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
  })

  const updateMutation = useUpdateInquiryStatus()
  const deleteMutation = useDeleteInquiry()

  useEffect(() => {
    if (data?.data) {
      setIncomingData(data.data, data.meta?.total)
    }
  }, [data, setIncomingData])

  const totalItems = data?.meta?.total ?? inquiries.length
  const totalPages = data?.meta?.totalPages ?? Math.max(1, Math.ceil(totalItems / effectiveLimit))

  const handleExportCSV = () => {
    if (!inquiries.length) return
    const headers = [
      "Inquiry Number",
      "Full Name",
      "Email",
      "Phone",
      "Destination",
      "Travel Date",
      "Travelers",
      "Status",
      "Message",
      "Created At",
    ]
    const rows = inquiries.map((i) => [
      i.inquiryNumber || i.id,
      `"${i.fullName || ""}"`,
      i.email || "",
      i.phone || "",
      `"${i.destination || ""}"`,
      `"${i.travelDate || ""}"`,
      `"${i.travelers || ""}"`,
      i.status,
      `"${(i.message || "").replace(/"/g, '""')}"`,
      i.createdAt ? new Date(i.createdAt).toISOString() : "",
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `mira_inquiries_export_${new Date().toISOString().split("T")[0]}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleStatusChange = (inquiryId: string, newStatus: string) => {
    updateMutation.mutate({ id: inquiryId, status: newStatus })
    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null))
    }
  }

  const handleDelete = (inquiryId: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return
    deleteMutation.mutate(inquiryId)
    if (selectedInquiry?.id === inquiryId) setSelectedInquiry(null)
  }

  const newCount = inquiries.filter((i) => i.status === "NEW").length
  const inReviewCount = inquiries.filter((i) => i.status === "IN_REVIEW").length
  const contactedCount = inquiries.filter((i) => i.status === "CONTACTED").length
  const closedCount = inquiries.filter((i) => i.status === "CLOSED").length

  // Only consider loading on initial batch 1 when no items are present yet
  const isInitialLoading = isLoading && currentPage === 1 && inquiries.length === 0

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Universal Page Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={Inbox}
        title="Travel Inquiries"
        subtitle='Visitor requests submitted via the "Plan your escape" form.'
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="New Inquiries"
              value={`${newCount} Pending`}
              subtext="Unread leads"
              icon={Inbox}
              iconColor="text-blue-500"
            />
            <CompactStatCard
              label="In Review"
              value={`${inReviewCount} Active`}
              subtext="Staff assigned"
              icon={Clock}
              iconColor="text-amber-500"
            />
            <CompactStatCard
              label="Contacted"
              value={`${contactedCount} Travelers`}
              subtext="Follow-up sent"
              icon={Users}
              iconColor="text-purple-500"
            />
            <CompactStatCard
              label="Closed"
              value={`${closedCount} Resolved`}
              subtext="Archived records"
              icon={CheckCircle2}
              iconColor="text-emerald-500"
            />
          </div>
        }
      />

      {/* Filter & Search Toolbar */}
      <FilterToolbar>
        <FilterGroup>
          {/* Search expands to take all remaining space on left */}
          <FilterSearch
            value={search}
            onChange={(val) => {
              setSearch(val)
              setCurrentPage(1)
            }}
            placeholder="Search by name, email, ref #..."
            width="w-full flex-1 min-w-[200px]"
          />
        </FilterGroup>

        <FilterActions>
          {/* Status Filter */}
          <FilterSelect
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val)
              setCurrentPage(1)
            }}
            options={[
              { label: "New Leads", value: "NEW" },
              { label: "In Review", value: "IN_REVIEW" },
              { label: "Contacted", value: "CONTACTED" },
              { label: "Closed", value: "CLOSED" },
            ]}
            allLabel="All Inquiries"
            allValue="ALL"
            placeholder="Filter Status"
            width="min-w-[130px] max-w-[160px]"
          />

          {/* Download CSV Button */}
          <FilterExportButton
            onClick={handleExportCSV}
            label="Download CSV"
            disabled={inquiries.length === 0}
          />

          {/* Universal Far-Right Refresh Button */}
          <FilterResetButton
            onClick={() => {
              setSearch("")
              setStatusFilter("ALL")
              setCurrentPage(1)
              refetch?.()
            }}
            title="Refresh & Reset"
          />
        </FilterActions>
      </FilterToolbar>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Ref #</th>
                <th className="px-5 py-3.5">Traveler Name & Email</th>
                <th className="px-5 py-3.5">Destination & Travel Date</th>
                <th className="px-5 py-3.5">Travelers & Types</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Submitted At</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {isInitialLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 w-20 rounded bg-muted"></div></td>
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="h-4 w-28 rounded bg-muted"></div>
                        <div className="h-3 w-36 rounded bg-muted/50"></div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="h-4 w-28 rounded bg-muted"></div></td>
                    <td className="px-5 py-4"><div className="h-4 w-20 rounded bg-muted"></div></td>
                    <td className="px-5 py-4"><div className="h-6 w-20 rounded-full bg-muted"></div></td>
                    <td className="px-5 py-4"><div className="h-4 w-24 rounded bg-muted"></div></td>
                    <td className="px-5 py-4 text-right"><div className="ml-auto h-7 w-16 rounded bg-muted"></div></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-rose-500">
                    Failed to load inquiries. Please check your backend connection.
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No travel inquiries found. Submissions from "Plan your escape" will appear here.
                  </td>
                </tr>
              ) : (
                <>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold">
                        {inquiry.inquiryNumber || `INQ-${inquiry.id.slice(-6)}`}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-xs">{inquiry.fullName}</span>
                          <span className="text-[11px] text-muted-foreground">{inquiry.email}</span>
                          {inquiry.phone && <span className="text-[10px] text-muted-foreground/80">{inquiry.phone}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col text-xs">
                          <span className="font-semibold text-foreground">{inquiry.destination || "Not specified"}</span>
                          <span className="text-muted-foreground text-[11px]">{inquiry.travelDate || "Date TBD"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col text-xs gap-1">
                          <span className="font-medium text-foreground">{inquiry.travelers ? `${inquiry.travelers} Guests` : "Guests TBD"}</span>
                          {inquiry.journeyTypes && inquiry.journeyTypes.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {inquiry.journeyTypes.map((type, idx) => (
                                <span key={idx} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                  {type}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Select
                          value={inquiry.status}
                          onValueChange={(val) => handleStatusChange(inquiry.id, val)}
                          disabled={updateMutation.isPending}
                        >
                          <SelectTrigger className={cn("h-7 w-[120px] text-xs font-semibold uppercase border px-2 py-0.5", statusStyles[inquiry.status])}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="IN_REVIEW">In Review</SelectItem>
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="h-7 text-xs"
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deleteMutation.isPending}
                            onClick={() => handleDelete(inquiry.id)}
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Subtle inline skeleton row when fetching next batch (Zero height collapse!) */}
                  {Boolean(isLoadingMore || (isFetching && currentPage > 1)) && (
                    <tr className="animate-pulse bg-muted/20">
                      <td className="px-5 py-3"><div className="h-3.5 w-16 rounded bg-muted/60"></div></td>
                      <td className="px-5 py-3">
                        <div className="space-y-1">
                          <div className="h-3.5 w-24 rounded bg-muted/60"></div>
                          <div className="h-3 w-32 rounded bg-muted/40"></div>
                        </div>
                      </td>
                      <td className="px-5 py-3"><div className="h-3.5 w-20 rounded bg-muted/60"></div></td>
                      <td className="px-5 py-3"><div className="h-3.5 w-16 rounded bg-muted/60"></div></td>
                      <td className="px-5 py-3"><div className="h-5 w-16 rounded-full bg-muted/60"></div></td>
                      <td className="px-5 py-3"><div className="h-3.5 w-20 rounded bg-muted/60"></div></td>
                      <td className="px-5 py-3 text-right"><div className="ml-auto h-6 w-12 rounded bg-muted/60"></div></td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        {inquiries.length > 0 && (
          <Pagination
            mode={mode}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={effectiveLimit}
            pageSizeOptions={pageSizeOptions}
            loadedCount={inquiries.length}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore || (isFetching && currentPage > 1)}
            onLoadMore={handleLoadMore}
            onPageChange={setCurrentPage}
            onPageSizeChange={setTargetItems}
          />
        )}
      </div>

      {/* Inspection Modal */}
      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-primary" />
              Inquiry Details: {selectedInquiry?.inquiryNumber || selectedInquiry?.id}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Full submission details from "Plan your escape" travel inquiry form.
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="mt-3 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-muted/30 p-3.5">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="block font-semibold text-foreground">Traveler Name</span>
                    <span>{selectedInquiry.fullName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="block font-semibold text-foreground">Email Address</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">
                      {selectedInquiry.email}
                    </a>
                  </div>
                </div>

                {selectedInquiry.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="block font-semibold text-foreground">Phone Number</span>
                      <span>{selectedInquiry.phone}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="block font-semibold text-foreground">Estimated Travel Date</span>
                    <span>{selectedInquiry.travelDate || "Date TBD"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border border-border/60 bg-card p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Destination:</span>
                  <span className="font-medium text-primary">{selectedInquiry.destination || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Party Size:</span>
                  <span>{selectedInquiry.travelers ? `${selectedInquiry.travelers} Guests` : "TBD"}</span>
                </div>
                {selectedInquiry.journeyTypes && selectedInquiry.journeyTypes.length > 0 && (
                  <div>
                    <span className="block font-semibold text-foreground mb-1">Preferred Journey Types:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedInquiry.journeyTypes.map((type, idx) => (
                        <span key={idx} className="rounded-sm border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedInquiry.message && (
                <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 space-y-1">
                  <span className="block font-semibold text-foreground">Vision & Special Requests:</span>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-muted-foreground">Change Status:</span>
                <Select
                  value={selectedInquiry.status}
                  onValueChange={(val) => handleStatusChange(selectedInquiry.id, val)}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger className={cn("h-8 w-[140px] text-xs font-semibold uppercase border px-2.5", statusStyles[selectedInquiry.status])}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="IN_REVIEW">In Review</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

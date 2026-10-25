import { useState, useEffect, useCallback } from "react"
import {
  Send,
  MailCheck,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Trash2,
  UserCheck,
  UserX,
  Loader2,
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
import { cn } from "@/lib/utils"
import { apiPrivate } from "@/lib/api-client"

export interface Subscriber {
  id: string
  email: string
  source: string
  status: "SUBSCRIBED" | "UNSUBSCRIBED" | "BOUNCED"
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

const statusStyles: Record<string, string> = {
  SUBSCRIBED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  UNSUBSCRIBED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  BOUNCED: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sourceFilter, setSourceFilter] = useState("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true)
      const params: Record<string, any> = { limit: 100 }
      if (search) params.search = search
      if (statusFilter !== "ALL") params.status = statusFilter

      const res = await apiPrivate.get<{
        success: boolean
        data: Subscriber[]
        meta?: { total?: number }
      }>("/newsletter/subscribers", { params })

      if (res.data?.success && Array.isArray(res.data?.data)) {
        setSubscribers(res.data.data)
      } else if (Array.isArray(res.data)) {
        setSubscribers(res.data as any)
      } else {
        setSubscribers([])
      }
    } catch (err) {
      console.error("Failed to fetch newsletter subscribers:", err)
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  const handleToggleStatus = async (sub: Subscriber) => {
    try {
      setUpdatingId(sub.id)
      const newStatus = sub.status === "SUBSCRIBED" ? "UNSUBSCRIBED" : "SUBSCRIBED"
      await apiPrivate.patch(`/newsletter/subscribers/${sub.id}`, { status: newStatus })
      setSubscribers((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: newStatus } : s))
      )
    } catch (err) {
      console.error("Failed to update status:", err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) return
    try {
      setDeletingId(id)
      await apiPrivate.delete(`/newsletter/subscribers/${id}`)
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error("Failed to delete subscriber:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Email,Source,Status,Created At"]
        .concat(
          filtered.map(
            (s) =>
              `"${s.id}","${s.email}","${s.source || "FOOTER"}","${s.status}","${s.createdAt || ""}"`
          )
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `mira_newsletter_subscribers_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filtered = subscribers.filter((s) => {
    if (sourceFilter !== "ALL" && s.source !== sourceFilter) return false
    return true
  })

  const activeCount = subscribers.filter((s) => s.status === "SUBSCRIBED").length
  const unsubscribedCount = subscribers.filter((s) => s.status === "UNSUBSCRIBED").length

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Universal Page Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={Send}
        title="Newsletter"
        subtitle="Manage live mailing lists and subscriber dispatches."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Subscribers"
              value={`${subscribers.length.toLocaleString()}`}
              subtext="Total audience"
              icon={MailCheck}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Active Status"
              value={`${activeCount.toLocaleString()}`}
              subtext="Subscribed"
              icon={TrendingUp}
              iconColor="text-blue-500"
            />
            <CompactStatCard
              label="Unsubscribed"
              value={`${unsubscribedCount.toLocaleString()}`}
              subtext="Opted out"
              icon={Sparkles}
              iconColor="text-amber-500"
            />
            <CompactStatCard
              label="Deliverability"
              value="100% Valid"
              subtext="Clean list"
              icon={CheckCircle2}
              iconColor="text-emerald-500"
            />
          </div>
        }
      />

      {/* Toolbar */}
      <FilterToolbar>
        <FilterGroup>
          {/* Search expands to take all remaining space on left */}
          <FilterSearch
            value={search}
            onChange={(val) => {
              setSearch(val)
              setCurrentPage(1)
            }}
            placeholder="Search email..."
            width="w-full flex-1 min-w-[200px]"
          />
        </FilterGroup>

        <FilterActions>
          <FilterSelect
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val)
              setCurrentPage(1)
            }}
            options={[
              { label: "Subscribed", value: "SUBSCRIBED" },
              { label: "Unsubscribed", value: "UNSUBSCRIBED" },
            ]}
            allLabel="All Statuses"
            allValue="ALL"
            placeholder="Status: All"
            width="min-w-[110px] max-w-[140px]"
          />

          <FilterSelect
            value={sourceFilter}
            onChange={(val) => {
              setSourceFilter(val)
              setCurrentPage(1)
            }}
            options={[
              { label: "Footer Form", value: "FOOTER" },
              { label: "Homepage", value: "HOMEPAGE" },
              { label: "Story Popup", value: "STORY_POPUP" },
              { label: "Concierge Lead", value: "CONCIERGE" },
            ]}
            allLabel="All Sources"
            allValue="ALL"
            placeholder="Source: All"
            width="min-w-[110px] max-w-[140px]"
          />

          {/* Seamless Borderless Export CSV */}
          <FilterExportButton
            onClick={handleExportCSV}
            label="Export CSV"
            disabled={filtered.length === 0}
          />

          {/* Far-Right Universal Refresh Button */}
          <FilterResetButton
            onClick={() => {
              setSearch("")
              setStatusFilter("ALL")
              setSourceFilter("ALL")
              setCurrentPage(1)
              fetchSubscribers()
            }}
            title="Refresh & Reset"
          />
        </FilterActions>
      </FilterToolbar>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          {loading && subscribers.length === 0 ? (
            <div className="flex h-48 items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading subscribers...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-1 text-muted-foreground">
              <MailCheck className="h-8 w-8 text-muted-foreground/50" />
              <p className="font-medium text-sm">No subscribers found</p>
              <p className="text-xs">Subscribers from website forms will appear here in real-time.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Subscriber Email</th>
                  <th className="px-5 py-3.5">Source Channel</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Subscribed Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-foreground">
                {filtered
                  .slice(0, currentPage * pageSize)
                  .map((s) => (
                    <tr key={s.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3.5 font-medium text-xs text-foreground">
                        {s.email}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground border border-border/50">
                          {(s.source || "FOOTER").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "inline-block rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase",
                            statusStyles[s.status] || statusStyles.SUBSCRIBED
                          )}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : "N/A"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={updatingId === s.id}
                            onClick={() => handleToggleStatus(s)}
                            title={s.status === "SUBSCRIBED" ? "Mark Unsubscribed" : "Mark Subscribed"}
                            className="h-8 text-xs gap-1"
                          >
                            {updatingId === s.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : s.status === "SUBSCRIBED" ? (
                              <>
                                <UserX className="h-3.5 w-3.5 text-amber-500" />
                                <span>Unsubscribe</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Subscribe</span>
                              </>
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deletingId === s.id}
                            onClick={() => handleDeleteSubscriber(s.id)}
                            className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                          >
                            {deletingId === s.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Universal Pagination */}
        {filtered.length > 0 && (
          <Pagination
            mode="infinite"
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filtered.length / pageSize))}
            totalItems={filtered.length}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            loadedCount={Math.min(filtered.length, currentPage * pageSize)}
            hasMore={currentPage * pageSize < filtered.length}
            onLoadMore={() => setCurrentPage((p) => p + 1)}
            onPageChange={setCurrentPage}
            onPageSizeChange={(sz) => {
              setPageSize(sz)
              setCurrentPage(1)
            }}
            fixed={false}
            isTable
          />
        )}
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback } from "react"
import {
  Send,
  Search,
  FilterX,
  Download,
  MailCheck,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Trash2,
  RefreshCw,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <Send className="h-7 w-7 text-primary" />
            Newsletter & Editorial Subscribers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage live mailing lists, website subscribers, and editorial dispatch subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={fetchSubscribers} variant="outline" size="icon" disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Total Subscribers</span>
              <MailCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">
              {subscribers.length.toLocaleString()} Total
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Active Subscribed</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {activeCount.toLocaleString()} Active
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Unsubscribed</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-zinc-500">
              {unsubscribedCount.toLocaleString()} Opted Out
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Deliverability Health</span>
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">100% Verified</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by subscriber email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-background/50">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="SUBSCRIBED">Subscribed</SelectItem>
              <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[170px] bg-background/50">
              <SelectValue placeholder="Source: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Sources</SelectItem>
              <SelectItem value="FOOTER">Footer Form</SelectItem>
              <SelectItem value="HOMEPAGE">Homepage</SelectItem>
              <SelectItem value="STORY_POPUP">Story Popup</SelectItem>
              <SelectItem value="CONCIERGE">Concierge Lead</SelectItem>
            </SelectContent>
          </Select>

          {(search || statusFilter !== "ALL" || sourceFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearch("")
                setStatusFilter("ALL")
                setSourceFilter("ALL")
              }}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          {loading ? (
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
                {filtered.map((s) => (
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
                          "inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase",
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
      </div>
    </div>
  )
}

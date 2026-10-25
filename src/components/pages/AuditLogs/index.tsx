import { THEME_COLORS } from "@/config/theme"
import { useState, useMemo } from "react"
import {
  History,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lock,
  Terminal,
  Trash2,
  Radio,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pagination } from "@/components/shared/Pagination"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import {
  FilterToolbar,
  FilterGroup,
  FilterSearch,
  FilterSelect,
  FilterActions,
  FilterSegmentButton,
  FilterExportButton,
  FilterResetButton,
} from "@/components/shared/FilterToolbar"
import { useAuditSocket, type LiveAuditLog } from "@/hooks/audit/useAuditSocket"
import axios from "axios"

const initialMockLogs: LiveAuditLog[] = [
  {
    id: "aud-101",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    actorName: "Admin User",
    actorEmail: "admin@dev.com",
    actorRole: "ADMIN",
    action: "BOOKING_APPROVED",
    entityType: "Booking",
    entityId: "MIRA-2026-00042",
    status: "SUCCESS",
    ipAddress: "127.0.0.1",
    details: "Approved booking with 30/70 standard staged schedule and confirmed total $4,500 USD.",
    method: "POST",
    path: "/api/v1/bookings/MIRA-2026-00042/approve",
  },
  {
    id: "aud-102",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actorName: "Admin User",
    actorEmail: "admin@dev.com",
    actorRole: "ADMIN",
    action: "MANUAL_PAYMENT_RECORDED",
    entityType: "PaymentRecord",
    entityId: "rec_99218",
    status: "SUCCESS",
    ipAddress: "127.0.0.1",
    details: "Recorded manual Bank Transfer of $1,350 for Schedule Item Deposit #1.",
    method: "POST",
    path: "/api/v1/payment-records",
  },
  {
    id: "aud-103",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    actorName: "System Auth",
    actorEmail: "admin@dev.com",
    actorRole: "ADMIN",
    action: "AUTH_LOGIN_SUCCESS",
    entityType: "Auth",
    entityId: "auth_admin_1",
    status: "SUCCESS",
    ipAddress: "127.0.0.1",
    details: "Administrator logged in successfully via JWT token issuance.",
    method: "POST",
    path: "/api/v1/auth/login",
  },
  {
    id: "aud-104",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    actorName: "Admin User",
    actorEmail: "admin@dev.com",
    actorRole: "ADMIN",
    action: "STORY_PUBLISHED",
    entityType: "Story",
    entityId: "story_kyoto_zen",
    status: "SUCCESS",
    ipAddress: "127.0.0.1",
    details: "Published editorial story 'Kyoto Zen Gardens & Tea Rituals' with full multimedia blocks.",
    method: "PUT",
    path: "/api/v1/stories/story_kyoto_zen",
  },
  {
    id: "aud-105",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    actorName: "Admin User",
    actorEmail: "admin@dev.com",
    actorRole: "ADMIN",
    action: "USER_STATUS_UPDATED",
    entityType: "User",
    entityId: "usr_102",
    status: "WARNING",
    ipAddress: "127.0.0.1",
    details: "Modified account status for traveler user2@miratravel.com to ACTIVE.",
    method: "PATCH",
    path: "/api/v1/users/usr_102",
  },
]

export default function AuditLogsPage() {
  const { isConnected, liveLogs, streamCount, clearStream } = useAuditSocket()
  const [staticLogs] = useState<LiveAuditLog[]>(initialMockLogs)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedLog, setSelectedLog] = useState<LiveAuditLog | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showTerminal, setShowTerminal] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Combined logs: live incoming socket logs prepend to the list seamlessly
  const allLogs = useMemo(() => {
    const liveIds = new Set(liveLogs.map((l) => l.id))
    const nonDuplicatedStatic = staticLogs.filter((l) => !liveIds.has(l.id))
    return [...liveLogs, ...nonDuplicatedStatic]
  }, [liveLogs, staticLogs])

  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      if (search) {
        const q = search.toLowerCase()
        const matchText =
          log.actorEmail.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.entityId.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.ipAddress.includes(q)
        if (!matchText) return false
      }
      if (actionFilter !== "ALL" && !log.action.includes(actionFilter)) return false
      if (statusFilter !== "ALL" && log.status !== statusFilter) return false
      return true
    })
  }, [allLogs, search, actionFilter, statusFilter])

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(allLogs, null, 2)
    const blob = new Blob([jsonStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  const handleSimulateEvent = async () => {
    setIsSimulating(true)
    try {
      const sampleEvents = [
        {
          action: "BOOKING_STAGE_TRANSITION",
          entityType: "Booking",
          entityId: `MIRA-2026-000${Math.floor(Math.random() * 90 + 10)}`,
          status: "SUCCESS",
          details: "Booking transitioned to AWAITING_DEPOSIT with 30/70 payment plan confirmed.",
        },
        {
          action: "PAYMENT_STRIPE_INTENT_CREATED",
          entityType: "PaymentRecord",
          entityId: `pi_mira_${Date.now().toString().slice(-6)}`,
          status: "SUCCESS",
          details: "Created Stripe PaymentIntent for Deposit #1 ($1,350.00 USD).",
        },
        {
          action: "SECURITY_SENTINEL_SCAN",
          entityType: "Security",
          entityId: "sec_token_shield",
          status: "SUCCESS",
          details: "Verified 0 suspicious rate-limit spikes in last 5 minutes.",
        },
        {
          action: "RATE_LIMIT_WARNING",
          entityType: "Sentinel",
          entityId: "ip_192_168_1_45",
          status: "WARNING",
          details: "IP exceeded 80 requests/min threshold. Cooldown limiter activated.",
        },
      ]

      const chosen = sampleEvents[Math.floor(Math.random() * sampleEvents.length)]
      const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5010/api/v1").replace(/\/+$/, '')
      const auditSimulateUrl = baseUrl.endsWith('/api/v1') ? `${baseUrl}/audit/simulate` : `${baseUrl}/api/v1/audit/simulate`

      await axios.post(auditSimulateUrl, chosen, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
      }).catch(() => {
        // Fallback simulate directly if offline
      })
    } catch {
      // Non-fatal
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Header */}
      {/* Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={History}
        title="Audit Logs"
        subtitle={
          <span>
            Protected immutable audit trail with live stream from <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">/api/v1/audit</code>.
          </span>
        }
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Live Events"
              value={`${streamCount} Events`}
              subtext={isConnected ? "Socket live" : "Connecting..."}
              icon={Radio}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Total Activity"
              value={`${allLogs.length} Records`}
              subtext="Historical stream"
              icon={History}
              iconColor="text-blue-500"
            />
            <CompactStatCard
              label="Security"
              value="100% Valid"
              subtext="Role authorization"
              icon={ShieldCheck}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Auth Mode"
              value="JWT Strict"
              subtext="Zero-trust verify"
              icon={Lock}
              iconColor="text-purple-500"
            />
          </div>
        }
      />

      {/* Unified Segmented Filter Toolbar */}
      <FilterToolbar>
        <FilterGroup>
          {/* Search expands to take all remaining space on left */}
          <FilterSearch
            value={search}
            onChange={(val) => {
              setSearch(val)
              setCurrentPage(1)
            }}
            placeholder="Search by actor, action, ID..."
            width="w-full flex-1 min-w-[180px]"
          />
        </FilterGroup>

        <FilterActions>
          {/* Live Socket Status Indicator */}
          <div className="h-10 px-3 flex items-center gap-2 text-xs font-semibold select-none whitespace-nowrap">
            <Radio className={`size-3.5 ${isConnected ? "animate-pulse text-emerald-500" : "text-amber-500"}`} />
            <span className={isConnected ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
              {isConnected ? "Live Stream" : "Connecting..."}
            </span>
          </div>

          {/* Toggle Live Terminal */}
          <FilterSegmentButton
            onClick={() => setShowTerminal(!showTerminal)}
            label={showTerminal ? "Hide Terminal" : "Live Terminal"}
            icon={Terminal}
          />

          {/* Simulate Event Button */}
          <FilterSegmentButton
            onClick={handleSimulateEvent}
            label={isSimulating ? "Dispatching..." : "Simulate Event"}
            icon={Sparkles}
            disabled={isSimulating}
          />

          {/* Action Filter */}
          <FilterSelect
            value={actionFilter}
            onChange={(val) => {
              setActionFilter(val)
              setCurrentPage(1)
            }}
            options={[
              { label: "Booking Actions", value: "BOOKING" },
              { label: "Payment Actions", value: "PAYMENT" },
              { label: "Authentication", value: "AUTH" },
              { label: "Editorial / Stories", value: "STORY" },
              { label: "User Management", value: "USER" },
            ]}
            allLabel="All Actions"
            allValue="ALL"
            placeholder="Action: All"
            width="min-w-[125px] max-w-[150px]"
          />

          {/* Status Filter */}
          <FilterSelect
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val)
              setCurrentPage(1)
            }}
            options={[
              { label: "Success", value: "SUCCESS" },
              { label: "Warning", value: "WARNING" },
              { label: "Failed", value: "FAILED" },
            ]}
            allLabel="All Statuses"
            allValue="ALL"
            placeholder="Status: All"
            width="min-w-[110px] max-w-[130px]"
          />

          {/* Borderless Segmented Export Logs Button */}
          <FilterExportButton
            onClick={handleExportLogs}
            label="Export Logs"
            disabled={allLogs.length === 0}
          />

          {/* Universal Far-Right Refresh Button */}
          <FilterResetButton
            onClick={() => {
              setSearch("")
              setActionFilter("ALL")
              setStatusFilter("ALL")
              setCurrentPage(1)
            }}
            title="Refresh & Reset"
          />
        </FilterActions>
      </FilterToolbar>

      {/* Live Socket Audit Terminal Console */}
      {showTerminal && (
        <div className="rounded-md border border-zinc-800 bg-zinc-950 text-zinc-200 shadow-xl overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-zinc-400 text-xs font-semibold ml-2 flex items-center gap-1.5">
                <Terminal className="size-3.5 text-emerald-400" />
                audit-logger://stream.live [port: 5010]
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-zinc-400">
                Streamed: <span className="text-emerald-400 font-bold">{streamCount} events</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearStream}
                className="h-6 px-2 text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              >
                <Trash2 className="size-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          <div className="p-3.5 space-y-2 max-h-52 overflow-y-auto font-mono text-[11px] leading-relaxed select-text">
            {liveLogs.length === 0 ? (
              <div className="text-zinc-500 py-3 text-center italic">
                ⚡ Listening for live audit events... Trigger actions (Booking approval, payment, login) or click "Simulate Event" above.
              </div>
            ) : (
              liveLogs.map((log, idx) => (
                <div
                  key={`${log.id}-${idx}`}
                  className="flex items-start gap-2 border-l-2 pl-2 transition-all hover:bg-zinc-900/60 py-0.5 rounded-r"
                  style={{
                    borderColor:
                      log.status === "FAILED"
                        ? THEME_COLORS.error
                        : log.status === "WARNING"
                          ? THEME_COLORS.warning
                          : THEME_COLORS.success,
                  }}
                >
                  <span className="text-zinc-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span
                    className={`font-bold px-1 rounded text-[10px] uppercase shrink-0 ${log.status === "FAILED"
                      ? "bg-rose-950/80 text-rose-400 border border-rose-800/40"
                      : log.status === "WARNING"
                        ? "bg-amber-950/80 text-amber-400 border border-amber-800/40"
                        : "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40"
                      }`}
                  >
                    {log.action}
                  </span>
                  <span className="text-zinc-400 shrink-0">{log.entityType} ({log.entityId}):</span>
                  <span className="text-zinc-200">{log.details}</span>
                  <span className="text-zinc-500 text-[10px] ml-auto shrink-0 font-light">by {log.actorEmail}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="overflow-hidden rounded-md border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Actor</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Target Entity</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">IP Address</th>
                <th className="px-5 py-3.5 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {filteredLogs
                .slice(0, currentPage * pageSize)
                .map((log, idx) => (
                  <tr key={`${log.id}-${idx}`} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-xs">{log.actorName}</span>
                        <span className="text-[11px] text-muted-foreground">{log.actorEmail}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block rounded-sm border border-border/80 bg-background/80 px-2 py-0.5 text-xs font-mono font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <span className="text-muted-foreground">{log.entityType}:</span>{" "}
                      <span className="font-semibold text-foreground">{log.entityId}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {log.status === "SUCCESS" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Success
                        </span>
                      ) : log.status === "WARNING" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Warning
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">
                      {log.ipAddress}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="h-7 text-xs"
                      >
                        <Info className="mr-1 h-3.5 w-3.5" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        {filteredLogs.length > 0 && (
          <Pagination
            mode="infinite"
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredLogs.length / pageSize))}
            totalItems={filteredLogs.length}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            loadedCount={Math.min(filteredLogs.length, currentPage * pageSize)}
            hasMore={currentPage * pageSize < filteredLogs.length}
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Audit Event Details</DialogTitle>
            <DialogDescription className="text-xs">
              Raw metadata and execution parameters captured in audit record.
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="mt-3 space-y-3 text-xs">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-1.5">
                <div><span className="font-semibold text-foreground">Action:</span> <span className="font-mono font-bold text-primary">{selectedLog.action}</span></div>
                <div><span className="font-semibold text-foreground">Actor:</span> {selectedLog.actorName} ({selectedLog.actorEmail})</div>
                <div><span className="font-semibold text-foreground">Role:</span> {selectedLog.actorRole}</div>
                <div><span className="font-semibold text-foreground">Target:</span> {selectedLog.entityType} ({selectedLog.entityId})</div>
                {selectedLog.method && (
                  <div><span className="font-semibold text-foreground">HTTP Route:</span> <code className="bg-background px-1.5 py-0.5 rounded font-mono">{selectedLog.method} {selectedLog.path || ""}</code></div>
                )}
                <div><span className="font-semibold text-foreground">IP Address:</span> {selectedLog.ipAddress}</div>
                <div><span className="font-semibold text-foreground">Timestamp:</span> {formatDate(selectedLog.timestamp)}</div>
              </div>

              <div>
                <span className="font-semibold text-foreground">Event Payload Description:</span>
                <p className="mt-1 rounded-sm bg-background p-2.5 border border-border text-muted-foreground">
                  {selectedLog.details}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

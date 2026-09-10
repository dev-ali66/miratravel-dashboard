import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  useUserSessions,
  useRevokeSession,
  useRevokeAllOtherSessions,
  type SessionItem,
} from "@/hooks/auth/useUserSessions"
import {
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react"

interface ActiveDevicesModalProps {
  open: boolean
  onClose: () => void
  onOpenLogoutModal?: () => void
}

export function ActiveDevicesModal({
  open,
  onClose,
  onOpenLogoutModal,
}: ActiveDevicesModalProps) {
  const { data: sessionStats, isLoading } = useUserSessions()
  const { mutate: revokeSession, isPending: isRevokingOne } = useRevokeSession()
  const { mutate: revokeAllOthers, isPending: isRevokingOthers } =
    useRevokeAllOtherSessions()

  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [confirmBulk, setConfirmBulk] = useState(false)

  const sessions = sessionStats?.sessions || []
  const totalActive = sessionStats?.totalActiveDevices ?? sessions.length
  const onlineCount = sessionStats?.onlineDevices ?? 1

  const getDeviceIcon = (item: SessionItem) => {
    if (item.deviceType === "mobile") {
      return <Smartphone className="h-5 w-5 text-primary" />
    }
    if (item.deviceType === "tablet") {
      return <Tablet className="h-5 w-5 text-indigo-500" />
    }
    return <Laptop className="h-5 w-5 text-primary" />
  }

  const handleRevokeSingle = (sessionId: string) => {
    setRevokingId(sessionId)
    revokeSession(sessionId, {
      onSettled: () => {
        setRevokingId(null)
      },
    })
  }

  const handleRevokeAllOtherDevices = () => {
    revokeAllOthers(undefined, {
      onSettled: () => {
        setConfirmBulk(false)
      },
    })
  }

  const formatLastActive = (dateStr?: string | null) => {
    if (!dateStr) return "Just now"
    try {
      const d = new Date(dateStr)
      const diffMs = Date.now() - d.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      if (diffMins < 2) return "Just now"
      if (diffMins < 60) return `${diffMins} mins ago`
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    } catch {
      return "Recently"
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-xl rounded-2xl p-6 sm:p-7 shadow-2xl border-border/80 bg-card max-h-[85vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Active Devices & Sessions
              </DialogTitle>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {totalActive} Active
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {onlineCount} Online
              </span>
            </div>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Manage all browsers and devices where you are currently signed in. You can remove individual sessions or disconnect all other devices.
          </DialogDescription>
        </DialogHeader>

        {/* Bulk Action Bar (if more than 1 device) */}
        {sessions.length > 1 && (
          <div className="my-1 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-xs text-muted-foreground truncate">
                Signed in on <strong className="text-foreground">{sessions.length} devices</strong>.
              </p>
            </div>

            {confirmBulk ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConfirmBulk(false)}
                  className="h-7 text-[11px] px-2"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isRevokingOthers}
                  onClick={handleRevokeAllOtherDevices}
                  className="h-7 text-[11px] px-2.5 flex items-center gap-1"
                >
                  {isRevokingOthers ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                  <span>Confirm Revoke All</span>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmBulk(true)}
                className="h-7 text-[11px] px-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 cursor-pointer"
              >
                <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                <span>Remove Other Devices</span>
              </Button>
            )}
          </div>
        )}

        {/* Device Cards List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 my-2 pr-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs">Loading active devices...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
              <Laptop className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-xs font-medium">No active sessions found.</p>
            </div>
          ) : (
            sessions.map((item, index) => {
              const isFirst = index === 0
              const isRemoving = revokingId === item.id

              return (
                <div
                  key={item.id}
                  className={`group relative flex items-start justify-between gap-3 rounded-xl border p-3.5 transition-all ${
                    isFirst
                      ? "border-primary/40 bg-primary/[0.02] shadow-2xs ring-1 ring-primary/20"
                      : "border-border/70 bg-card hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Device Icon */}
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted border border-border/60">
                      {getDeviceIcon(item)}
                    </div>

                    {/* Device Details */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-[260px]">
                          {item.deviceName}
                        </span>

                        {isFirst && (
                          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold text-primary">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Current Device
                          </span>
                        )}

                        {item.isOnline ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Online Now
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {formatLastActive(item.lastUsedAt)}
                          </span>
                        )}
                      </div>

                      {/* IP & Remember Mode */}
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1 truncate">
                          <Globe className="h-3 w-3 shrink-0" />
                          <span className="font-mono text-[10px]">
                            {item.ipAddress || "127.0.0.1"}
                          </span>
                        </span>

                        <span className="text-border">•</span>

                        <span className="text-[10px]">
                          {item.rememberMe ? "Persistent (30d)" : "Ephemeral (30m)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Revoke / Remove Button */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    {isFirst ? (
                      onOpenLogoutModal && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            onClose()
                            onOpenLogoutModal()
                          }}
                          className="h-8 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer px-2"
                        >
                          Sign Out
                        </Button>
                      )
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isRemoving || isRevokingOne}
                        onClick={() => handleRevokeSingle(item.id)}
                        className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg cursor-pointer transition-colors"
                      >
                        {isRemoving ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            <span>Remove</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex-row justify-between items-center pt-2 border-t border-border/40">
          <p className="text-[10px] text-muted-foreground">
            Revoking a device will immediately sign it out.
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs px-4 cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

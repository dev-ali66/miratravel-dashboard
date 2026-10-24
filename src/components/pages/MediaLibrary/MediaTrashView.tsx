import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MediaAsset } from "@/services/mediaService"
import {
  useMediaWorkerStatus,
  useRestoreMedia,
  usePermanentDelete,
  useEmptyTrash,
  useTriggerMediaWorker,
} from "@/hooks/media/useMediaLibrary"

interface MediaTrashViewProps {
  assets: MediaAsset[]
  isLoading?: boolean
}

function getDaysRemaining(deletedAt?: string | null): number {
  if (!deletedAt) return 30
  try {
    const deleted = new Date(deletedAt).getTime()
    const expires = deleted + 30 * 24 * 60 * 60 * 1000
    const diff = expires - Date.now()
    const days = Math.ceil(diff / (24 * 60 * 60 * 1000))
    return Math.max(0, days)
  } catch {
    return 30
  }
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export const MediaTrashView: React.FC<MediaTrashViewProps> = ({ assets, isLoading }) => {
  const { data: workerStatus } = useMediaWorkerStatus()
  const restoreMutation = useRestoreMedia()
  const permanentDeleteMutation = usePermanentDelete()
  const emptyTrashMutation = useEmptyTrash()
  const triggerWorkerMutation = useTriggerMediaWorker()

  const handleEmptyTrash = () => {
    if (
      window.confirm(
        "Are you sure you want to empty the trash bin? All unreferenced files currently in trash will be permanently purged from VPS disk."
      )
    ) {
      emptyTrashMutation.mutate()
    }
  }

  const handlePermanentDelete = (id: string, fileName: string) => {
    if (
      window.confirm(
        `Permanently purge '${fileName}' from disk? This action cannot be undone.`
      )
    ) {
      permanentDeleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-4 py-2">
      {/* 30-Day Policy Info Banner & Outbox Worker Widget */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">30-Day Safety Grace Period Active</h4>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
              Deleted files remain recoverable here for 30 days. If an asset is re-used in any Journey or Story during this time, it is automatically restored. Otherwise, our scheduled outbox worker purges it from VPS disk.
            </p>
          </div>
        </div>

        {/* Worker Status & Empty Trash Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerWorkerMutation.mutate()}
            disabled={triggerWorkerMutation.isPending}
            className="text-xs h-8 gap-1.5 border-border/60"
            title="Trigger automated outbox cleanup sweep now"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5",
                triggerWorkerMutation.isPending && "animate-spin text-primary"
              )}
            />
            Run Worker Now
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleEmptyTrash}
            disabled={assets.length === 0 || emptyTrashMutation.isPending}
            className="text-xs h-8 gap-1.5 shadow-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {emptyTrashMutation.isPending ? "Emptying..." : `Empty Trash (${assets.length})`}
          </Button>
        </div>
      </div>

      {/* Outbox Worker Status Badge Bar */}
      {workerStatus && (
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-muted/30 border border-border/40 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                workerStatus.isRunning ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
              )}
            />
            <span>
              Outbox Cleaner:{" "}
              <strong className="text-foreground">
                {workerStatus.isRunning ? "Active & Sleeping until next due date" : "Idle"}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Pending In Outbox: <strong className="text-foreground">{workerStatus.pendingJobsCount}</strong>
            </span>
            {workerStatus.nextRunAt && (
              <span>
                Next Automated Purge:{" "}
                <strong className="text-foreground">
                  {new Date(workerStatus.nextRunAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Trashed Assets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/40 bg-muted/30 aspect-[4/5] animate-pulse"
            />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/60 rounded-2xl bg-muted/10 my-4">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
            <Sparkles className="h-7 w-7 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Trash bin is clean</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            There are no deleted media assets in the 30-day trash grace period.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-1">
          {assets.map((asset) => {
            const daysLeft = getDaysRemaining(asset.deletedAt)
            const isVideo = asset.mimeType.startsWith("video/")

            return (
              <div
                key={asset.id}
                className="group relative flex flex-col rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden shadow-xs hover:border-border transition-all"
              >
                {/* Countdown Badge Top Right */}
                <div className="absolute top-2 right-2 z-20">
                  <Badge
                    variant={daysLeft <= 3 ? "destructive" : "secondary"}
                    className="text-[10px] font-semibold px-1.5 py-0 h-5 shadow-xs backdrop-blur-sm gap-1"
                  >
                    <Clock className="h-2.5 w-2.5" />
                    {daysLeft === 0 ? "Purging today" : `${daysLeft}d left`}
                  </Badge>
                </div>

                {/* Thumbnail (Greyscale hint) */}
                <div className="relative aspect-square w-full bg-muted/40 overflow-hidden flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  {isVideo ? (
                    <Video className="h-10 w-10 text-muted-foreground/60 stroke-[1.2]" />
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.fileName}
                      className="h-full w-full object-cover filter grayscale-30 group-hover:grayscale-0 transition-all"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Bottom Details & Quick Restore / Purge Buttons */}
                <div className="p-2.5 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <p className="text-xs font-medium text-foreground truncate" title={asset.fileName}>
                      {asset.title || asset.fileName}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">{formatBytes(asset.size)}</p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => restoreMutation.mutate(asset.id)}
                      disabled={restoreMutation.isPending}
                      className="flex-1 text-[11px] h-7 gap-1 hover:bg-primary hover:text-primary-foreground border-border/60"
                      title="Restore to active library"
                    >
                      <RotateCcw className="h-3 w-3" /> Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePermanentDelete(asset.id, asset.fileName)}
                      disabled={permanentDeleteMutation.isPending}
                      className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                      title="Purge immediately from disk"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

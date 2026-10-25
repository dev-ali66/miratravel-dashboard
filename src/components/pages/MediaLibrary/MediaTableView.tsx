import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MediaAsset } from "@/services/mediaService"

interface MediaTableViewProps {
  assets: MediaAsset[]
  selectedAssetId?: string | null
  selectedIds: string[]
  onSelectAsset: (asset: MediaAsset) => void
  onToggleSelectId: (id: string, e: React.MouseEvent) => void
  onToggleSelectAll: () => void
  onSoftDelete: (id: string) => void
  isLoading?: boolean
}

function formatBytes(bytes?: number | null, decimals = 1): string {
  if (!bytes || bytes <= 0) return "—"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

export const MediaTableView: React.FC<MediaTableViewProps> = ({
  assets,
  selectedAssetId,
  selectedIds,
  onSelectAsset,
  onToggleSelectId,
  onToggleSelectAll,
  onSoftDelete,
  isLoading,
}) => {
  const isAllSelected = assets.length > 0 && assets.every((a) => selectedIds.includes(a.id))

  if (isLoading) {
    return (
      <div className="space-y-2 p-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-muted/40 animate-pulse border border-border/40" />
        ))}
      </div>
    )
  }

  if (assets.length === 0) {
    return null
  }

  return (
    <div className="rounded-md border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-medium select-none">
              <th className="py-3 px-4 w-10">
                <Checkbox checked={isAllSelected} onCheckedChange={onToggleSelectAll} />
              </th>
              <th className="py-3 px-3 w-16">Preview</th>
              <th className="py-3 px-3">File Name / Title</th>
              <th className="py-3 px-3">Format</th>
              <th className="py-3 px-3">Dimensions</th>
              <th className="py-3 px-3">Size</th>
              <th className="py-3 px-3">Usage</th>
              <th className="py-3 px-3">Date Added</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {assets.map((asset) => {
              const isChecked = selectedIds.includes(asset.id)
              const isSelected = selectedAssetId === asset.id
              const isVideo = asset.mimeType.startsWith("video/")

              return (
                <tr
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className={cn(
                    "hover:bg-muted/40 transition-colors cursor-pointer group",
                    isSelected && "bg-primary/5 font-medium",
                    isChecked && "bg-primary/10"
                  )}
                >
                  <td
                    className="py-2.5 px-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleSelectId(asset.id, e)
                    }}
                  >
                    <Checkbox checked={isChecked} />
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="h-10 w-10 rounded-sm border border-border/40 bg-zinc-950 overflow-hidden flex items-center justify-center relative">
                      {isVideo ? (
                        <video
                          src={asset.url}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={asset.url}
                          alt={asset.fileName}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </td>

                  <td className="py-2.5 px-3 max-w-[200px]">
                    <p className="font-medium text-foreground truncate" title={asset.title || asset.fileName}>
                      {asset.title || asset.fileName}
                    </p>
                    {asset.title && (
                      <p className="text-[11px] text-muted-foreground truncate" title={asset.fileName}>
                        {asset.fileName}
                      </p>
                    )}
                  </td>

                  <td className="py-2.5 px-3">
                    <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                      {asset.mimeType.split("/")[1] || "FILE"}
                    </Badge>
                  </td>

                  <td className="py-2.5 px-3 text-muted-foreground">
                    {asset.width && asset.height ? `${asset.width} × ${asset.height}` : "—"}
                  </td>

                  <td className="py-2.5 px-3 text-muted-foreground font-mono">
                    {formatBytes(asset.size)}
                  </td>

                  <td className="py-2.5 px-3">
                    {asset.usageCount > 0 ? (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full text-[11px] font-medium">
                        <AlertCircle className="h-3 w-3" />
                        In use ({asset.usageCount})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[11px] font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Unused
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-muted-foreground">
                    {formatDate(asset.createdAt)}
                  </td>

                  <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Open direct URL"
                        onClick={() => window.open(asset.url, "_blank")}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                        title="Move to trash"
                        onClick={() => onSoftDelete(asset.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

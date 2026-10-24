import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Copy, X, Check, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import type { MediaAsset } from "@/services/mediaService"

interface MediaBulkActionBarProps {
  selectedIds: string[]
  assets: MediaAsset[]
  onClearSelection: () => void
  onBulkTrash: (ids: string[]) => void
  isDeleting?: boolean
}

export const MediaBulkActionBar: React.FC<MediaBulkActionBarProps> = ({
  selectedIds,
  assets,
  onClearSelection,
  onBulkTrash,
  isDeleting,
}) => {
  const [copied, setCopied] = useState(false)

  if (selectedIds.length === 0) return null

  const selectedAssets = assets.filter((a) => selectedIds.includes(a.id))
  const inUseCount = selectedAssets.filter((a) => a.usageCount > 0).length

  const handleCopyUrls = async () => {
    const urls = selectedAssets.map((a) => a.url).join("\n")
    await navigator.clipboard.writeText(urls)
    setCopied(true)
    toast.success(`Copied ${selectedAssets.length} URL(s) to clipboard`)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBulkTrash = () => {
    if (inUseCount > 0) {
      toast.error(
        `Cannot delete: ${inUseCount} of the selected assets are actively in use across the system.`
      )
      return
    }
    onBulkTrash(selectedIds)
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card/90 dark:bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-full px-5 py-2.5 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2 font-medium text-foreground pr-2 border-r border-border/60">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span>{selectedIds.length} selected</span>
      </div>

      {inUseCount > 0 && (
        <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium px-2">
          <AlertTriangle className="h-3 w-3" />
          <span>{inUseCount} in use</span>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyUrls}
        className="h-7 text-xs rounded-full gap-1.5 hover:bg-muted/60"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        Copy Links
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={handleBulkTrash}
        disabled={isDeleting || inUseCount > 0}
        className="h-7 text-xs rounded-full gap-1.5 shadow-xs"
        title={inUseCount > 0 ? "Cannot delete active assets" : "Move selected to trash"}
      >
        <Trash2 className="h-3.5 w-3.5" />
        {isDeleting ? "Moving..." : "Move to Trash"}
      </Button>

      <button
        onClick={onClearSelection}
        className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-1"
        title="Clear selection"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Copy, X, Check, AlertTriangle, Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { mediaService, type MediaAsset } from "@/services/mediaService"

interface MediaBulkActionBarProps {
  selectedIds: string[]
  assets: MediaAsset[]
  onClearSelection: () => void
  onBulkTrash: (ids: string[]) => void
  onToggleSelectAll?: () => void
  isDeleting?: boolean
}

export const MediaBulkActionBar: React.FC<MediaBulkActionBarProps> = ({
  selectedIds,
  assets,
  onClearSelection,
  onBulkTrash,
  onToggleSelectAll,
  isDeleting,
}) => {
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 })

  if (selectedIds.length === 0) return null

  const selectedAssets = assets.filter((a) => selectedIds.includes(a.id))
  const inUseCount = selectedAssets.filter((a) => a.usageCount > 0).length
  const isAllSelected = assets.length > 0 && assets.every((a) => selectedIds.includes(a.id))
  const isPartiallySelected = selectedIds.length > 0 && !isAllSelected

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

  const handleBulkDownload = async () => {
    if (selectedAssets.length === 0) return
    setIsDownloading(true)
    setDownloadProgress({ current: 0, total: selectedAssets.length })

    const toastId = toast.loading(
      selectedAssets.length === 1
        ? "Downloading file..."
        : `Downloading 1 of ${selectedAssets.length} file(s)...`
    )

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < selectedAssets.length; i++) {
      const asset = selectedAssets[i]
      setDownloadProgress({ current: i + 1, total: selectedAssets.length })

      if (selectedAssets.length > 1) {
        toast.loading(`Downloading ${i + 1} of ${selectedAssets.length} file(s)...`, {
          id: toastId,
        })
      }

      try {
        await mediaService.downloadAsset(asset)
        successCount++
        // Sequential delay to prevent browser download throttling
        if (i < selectedAssets.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 350))
        }
      } catch (err) {
        console.error(`Failed to download ${asset.fileName}:`, err)
        failCount++
      }
    }

    if (failCount === 0) {
      toast.success(
        selectedAssets.length === 1
          ? "Download completed!"
          : `Successfully downloaded ${successCount} file(s)!`,
        { id: toastId }
      )
    } else {
      toast.info(`Downloaded ${successCount} file(s), ${failCount} failed.`, {
        id: toastId,
      })
    }

    setIsDownloading(false)
    setDownloadProgress({ current: 0, total: 0 })
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card/90 dark:bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-full px-4 py-2 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Select All Checkbox & Count */}
      <div className="flex items-center gap-2 font-medium text-foreground pr-3 border-r border-border/60">
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(el) => {
              if (el) el.indeterminate = isPartiallySelected
            }}
            onChange={onToggleSelectAll}
            className="h-4 w-4 rounded border-border/80 text-primary accent-primary cursor-pointer transition-colors"
            title={isAllSelected ? "Deselect all" : "Select all"}
          />
          <span className="text-xs group-hover:text-primary transition-colors">
            {isAllSelected ? `All (${assets.length})` : `${selectedIds.length} selected`}
          </span>
        </label>
      </div>

      {inUseCount > 0 && (
        <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium px-1.5">
          <AlertTriangle className="h-3 w-3" />
          <span>{inUseCount} in use</span>
        </div>
      )}

      {/* Single-Click Bulk Download Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleBulkDownload}
        disabled={isDownloading}
        className="h-7 text-xs rounded-full gap-1.5 border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-medium shadow-xs"
        title="Download selected files directly to your computer"
      >
        {isDownloading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        <span>
          {isDownloading
            ? `Downloading (${downloadProgress.current}/${downloadProgress.total})...`
            : `Download (${selectedAssets.length})`}
        </span>
      </Button>

      {/* Copy CDN Links Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyUrls}
        className="h-7 text-xs rounded-full gap-1.5 hover:bg-muted/60"
        title="Copy CDN links"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        Copy Links
      </Button>

      {/* Move to Trash Button */}
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

      {/* Clear Selection Button */}
      <button
        onClick={onClearSelection}
        className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-0.5"
        title="Clear selection"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

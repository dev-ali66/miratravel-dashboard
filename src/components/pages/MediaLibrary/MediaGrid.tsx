import React, { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Play, Image as ImageIcon, Video, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MediaAsset } from "@/services/mediaService"

interface MediaGridProps {
  assets: MediaAsset[]
  selectedAssetId?: string | null
  selectedIds: string[]
  onSelectAsset: (asset: MediaAsset) => void
  onToggleSelectId: (id: string, e: React.MouseEvent) => void
  isLoading?: boolean
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

function getFormatLabel(mimeType: string, fileName: string): string {
  if (mimeType.includes("webp")) return "WEBP"
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "JPG"
  if (mimeType.includes("png")) return "PNG"
  if (mimeType.includes("svg")) return "SVG"
  if (mimeType.includes("mp4")) return "MP4"
  if (mimeType.includes("webm")) return "WEBM"
  const ext = fileName.split(".").pop()?.toUpperCase()
  return ext || "FILE"
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  assets,
  selectedAssetId,
  selectedIds,
  onSelectAsset,
  onToggleSelectId,
  isLoading,
}) => {
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div
        className={cn(
          "grid gap-4 p-1",
          selectedAssetId
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        )}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/40 bg-muted/30 overflow-hidden animate-pulse flex flex-col aspect-[4/5]"
          >
            <div className="flex-1 bg-muted/60" />
            <div className="p-3 space-y-2">
              <div className="h-3.5 bg-muted/80 rounded w-3/4" />
              <div className="h-3 bg-muted/60 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/60 rounded-2xl bg-muted/10 my-4">
        <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
          <ImageIcon className="h-7 w-7 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No media assets found</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1">
          No files match your current filter or search criteria. Try clearing filters or drag and drop new files to upload.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid gap-4 p-1 transition-all duration-300",
        selectedAssetId
          ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      )}
    >
      {assets.map((asset) => {
        const isChecked = selectedIds.includes(asset.id)
        const isSelected = selectedAssetId === asset.id
        const isVideo = asset.mimeType.startsWith("video/")
        const format = getFormatLabel(asset.mimeType, asset.fileName)

        return (
          <div
            key={asset.id}
            onClick={() => onSelectAsset(asset)}
            onMouseEnter={() => isVideo && setHoveredVideoId(asset.id)}
            onMouseLeave={() => isVideo && setHoveredVideoId(null)}
            className={cn(
              "group relative flex flex-col rounded-xl border bg-card/60 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-200 select-none hover:shadow-md hover:border-primary/50",
              isSelected
                ? "ring-2 ring-primary border-primary shadow-sm shadow-primary/20"
                : "border-border/60",
              isChecked && "bg-primary/5 border-primary/40"
            )}
          >
            {/* Top-Left Selection Checkbox */}
            <div
              onClick={(e) => {
                e.stopPropagation()
                onToggleSelectId(asset.id, e)
              }}
              className={cn(
                "absolute top-2 left-2 z-20 rounded-md p-1 transition-opacity",
                isChecked || isSelected
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
            >
              <div className="bg-background/90 backdrop-blur-sm p-1 rounded-md shadow-sm border border-border/40">
                <Checkbox checked={isChecked} />
              </div>
            </div>

            {/* Top-Right Badges (Format + Usage Status) */}
            <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 pointer-events-none">
              <Badge
                variant="secondary"
                className="bg-background/90 backdrop-blur-sm text-[10px] font-bold px-1.5 py-0 h-5 border border-border/40 shadow-xs"
              >
                {format}
              </Badge>
              {asset.usageCount > 0 ? (
                <span
                  title={`Used in ${asset.usageCount} place(s)`}
                  className="inline-flex items-center gap-0.5 bg-amber-500/90 text-white text-[10px] font-medium px-1.5 py-0 h-5 rounded-full shadow-xs backdrop-blur-sm"
                >
                  <AlertCircle className="h-2.5 w-2.5" />
                  {asset.usageCount}
                </span>
              ) : (
                <span
                  title="Unused (Safe to remove)"
                  className="inline-flex items-center gap-0.5 bg-emerald-500/90 text-white text-[10px] font-medium px-1.5 py-0 h-5 rounded-full shadow-xs backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-2.5 w-2.5" />
                </span>
              )}
            </div>

            {/* Visual Thumbnail Area */}
            <div className="relative aspect-square w-full bg-muted/40 overflow-hidden flex items-center justify-center">
              {isVideo ? (
                hoveredVideoId === asset.id ? (
                  <video
                    src={asset.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover transition-transform duration-300"
                  />
                ) : (
                  <div className="relative h-full w-full flex items-center justify-center bg-black/5 dark:bg-black/30">
                    <Video className="h-10 w-10 text-muted-foreground/60 stroke-[1.2]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md text-foreground">
                        <Play className="h-4 w-4 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <img
                  src={asset.url}
                  alt={asset.altText || asset.title || asset.fileName}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback visual if broken image
                    ;(e.target as HTMLElement).style.display = "none"
                  }}
                />
              )}
            </div>

            {/* Bottom Metadata Info */}
            <div className="p-2.5 flex flex-col justify-between flex-1 gap-1">
              <p
                className="text-xs font-medium text-foreground truncate"
                title={asset.title || asset.fileName}
              >
                {asset.title || asset.fileName}
              </p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{formatBytes(asset.size)}</span>
                {asset.width && asset.height ? (
                  <span>
                    {asset.width}×{asset.height}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

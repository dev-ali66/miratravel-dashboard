import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Copy,
  ExternalLink,
  Trash2,
  Check,
  Layers,
  Maximize2,
  FileCode,
  Sparkles,
  Download,
  Loader2,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { mediaService, type MediaAsset } from "@/services/mediaService"
import { useMediaUsage, useUpdateMediaMetadata } from "@/hooks/media/useMediaLibrary"

interface MediaInspectorDrawerProps {
  asset: MediaAsset | null
  onClose: () => void
  onSoftDelete: (id: string) => void
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

function getAspectRatio(w?: number | null, h?: number | null): string | null {
  if (!w || !h) return null
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const divisor = gcd(w, h)
  const rw = w / divisor
  const rh = h / divisor
  if ((rw === 16 && rh === 9) || (rw === 4 && rh === 3) || (rw === 1 && rh === 1)) {
    return `${rw}:${rh}`
  }
  const ratio = (w / h).toFixed(2)
  return `${ratio}:1`
}

export const MediaInspectorDrawer: React.FC<MediaInspectorDrawerProps> = ({
  asset,
  onClose,
  onSoftDelete,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [title, setTitle] = useState("")
  const [altText, setAltText] = useState("")
  const [caption, setCaption] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  const { data: usageReport, isLoading: isUsageLoading } = useMediaUsage(asset?.id)
  const updateMetadata = useUpdateMediaMetadata()

  const handleDownload = async () => {
    if (!asset) return
    try {
      setIsDownloading(true)
      await mediaService.downloadAsset(asset)
      toast.success("Download started")
    } catch (err) {
      console.error("Download failed:", err)
      toast.error("Failed to download file")
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    if (asset) {
      setTitle(asset.title || "")
      setAltText(asset.altText || "")
      setCaption(asset.caption || "")
      setIsExpanded(false)
      setIsPinned(false)
    }
  }, [asset?.id])

  if (!asset) return null

  const isVideo = asset.mimeType.startsWith("video/")
  const ratio = getAspectRatio(asset.width, asset.height)
  const isDirty =
    title !== (asset.title || "") ||
    altText !== (asset.altText || "") ||
    caption !== (asset.caption || "")

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(asset.url)
    setCopiedUrl(true)
    toast.success("CDN URL copied to clipboard")
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const handleCopyNextImage = async () => {
    const code = isVideo
      ? `<video src="${asset.url}" controls className="w-full h-auto rounded-lg" />`
      : `<Image src="${asset.url}" alt="${altText || asset.fileName}" width={${
          asset.width || 1200
        }} height={${asset.height || 800}} />`
    await navigator.clipboard.writeText(code)
    setCopiedCode(true)
    toast.success(isVideo ? "Video tag copied to clipboard" : "Next.js <Image> tag copied to clipboard")
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleSaveMetadata = () => {
    updateMetadata.mutate({
      id: asset.id,
      metadata: {
        title: title.trim() || null,
        altText: altText.trim() || null,
        caption: caption.trim() || null,
      },
    })
  }

  return (
    <>
      {/* Mobile Backdrop (only on screens smaller than lg) */}
      <div
        className="fixed inset-0 bg-background/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="fixed top-14 bottom-0 right-0 z-40 w-full sm:w-[400px] xl:w-[440px] flex flex-col border-l border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-2xl transition-transform duration-300 ease-in-out overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/60 bg-muted/20 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Media Details</h2>
            <Badge variant="outline" className="text-[10px] font-mono uppercase">
              {asset.mimeType.split("/")[1]}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={onClose}
            title="Close inspector and expand gallery"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Drawer Body Container */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Main Content Area (Media Preview + Compact Specs Arrow Button) */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col justify-between">
            {/* High-res Media Preview Card */}
            <div>
              <div className="relative rounded-xl border border-border/60 bg-muted/30 overflow-hidden flex items-center justify-center min-h-[220px] max-h-[360px] shadow-sm">
                {isVideo ? (
                  <video
                    src={asset.url}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="max-h-[360px] w-full object-contain"
                  />
                ) : (
                  <img
                    src={asset.url}
                    alt={asset.title || asset.fileName}
                    className="max-h-[360px] w-full object-contain"
                  />
                )}

                {/* Floating Top-Right Action Toolbar (Download, Copy, Embed, Fullscreen, Delete) */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-background/85 backdrop-blur-md p-1 rounded-lg border border-border/50 shadow-md">
                  {/* 1. Direct Download */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted text-foreground transition-all cursor-pointer disabled:opacity-50"
                    title={`Download ${asset.originalName || asset.fileName}`}
                  >
                    {isDownloading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* 2. Copy CDN URL */}
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted text-foreground transition-all cursor-pointer"
                    title={copiedUrl ? "Copied CDN URL!" : "Copy CDN URL"}
                  >
                    {copiedUrl ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600 animate-in zoom-in-50 duration-150" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* 3. Copy Embed Tag / Code */}
                  <button
                    type="button"
                    onClick={handleCopyNextImage}
                    className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted text-foreground transition-all cursor-pointer"
                    title={copiedCode ? "Copied Embed Tag!" : isVideo ? "Copy <video> tag" : "Copy Next.js <Image /> tag"}
                  >
                    {copiedCode ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600 animate-in zoom-in-50 duration-150" />
                    ) : (
                      <FileCode className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* 4. Open Full Size in New Tab */}
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted text-foreground transition-all"
                    title="Open full size in new tab"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </a>

                  {/* Divider */}
                  <div className="h-3.5 w-[1px] bg-border/60 mx-0.5" />

                  {/* 5. Delete Asset (Relocated from bottom footer) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (asset.usageCount > 0) {
                        toast.error(
                          `Cannot delete: asset is in active use across ${asset.usageCount} location${
                            asset.usageCount > 1 ? "s" : ""
                          }`
                        )
                        return
                      }
                      onSoftDelete(asset.id)
                    }}
                    disabled={asset.usageCount > 0}
                    className={cn(
                      "h-7 w-7 rounded-md flex items-center justify-center transition-all",
                      asset.usageCount > 0
                        ? "opacity-40 cursor-not-allowed text-muted-foreground hover:bg-transparent"
                        : "hover:bg-destructive/15 text-destructive/80 hover:text-destructive cursor-pointer"
                    )}
                    title={
                      asset.usageCount > 0
                        ? `Cannot delete: in use (${asset.usageCount} reference${
                            asset.usageCount > 1 ? "s" : ""
                          })`
                        : "Move to 30-day trash"
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Bottom subtle media badge */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-border/40 text-[11px] text-muted-foreground font-medium shadow-xs">
                  <span>{asset.width && asset.height ? `${asset.width} × ${asset.height} px` : asset.mimeType}</span>
                  <span className="text-border">•</span>
                  <span className="font-mono">{formatBytes(asset.size)}</span>
                </div>
              </div>
            </div>

            {/* Transparent Arrow Button (Collapsed State indicator) */}
            <div className="py-6 flex flex-col items-center justify-center">
              <button
                type="button"
                onMouseEnter={() => setIsExpanded(true)}
                onClick={() => {
                  setIsExpanded(true)
                  setIsPinned((prev) => !prev)
                }}
                className="group flex flex-col items-center gap-2 px-6 py-3 rounded-2xl bg-transparent hover:bg-muted/30 border border-border/40 hover:border-primary/40 backdrop-blur-xs transition-all duration-200 cursor-pointer text-muted-foreground hover:text-foreground w-full max-w-[280px]"
                title="Hover to swipe up specifications & system usage"
              >
                <div className="h-8 w-8 rounded-full bg-muted/20 group-hover:bg-primary/10 border border-border/50 group-hover:border-primary/40 flex items-center justify-center text-foreground group-hover:text-primary transition-all">
                  <ChevronUp className="h-4 w-4 animate-bounce group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-semibold block text-foreground group-hover:text-primary transition-colors">
                    Technical Specifications
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Hover to swipe up details & usage
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Swipe-Up Specifications Sheet */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 260 }}
                onMouseLeave={() => {
                  if (!isPinned) setIsExpanded(false)
                }}
                className="absolute inset-x-0 bottom-0 top-3 z-30 flex flex-col rounded-t-2xl border-t border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
              >
                {/* Swipe-Up Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-muted/30 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false)
                        setIsPinned(false)
                      }}
                      className="h-7 w-7 rounded-full bg-background/80 hover:bg-muted border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      title="Collapse details"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-semibold text-foreground">
                      Technical Specifications & Usage
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPinned((prev) => !prev)}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer",
                      isPinned
                        ? "bg-primary/15 text-primary border-primary/30 font-medium"
                        : "bg-muted/40 text-muted-foreground border-border/40 hover:text-foreground"
                    )}
                    title={isPinned ? "Click to unpin (auto-collapses on mouse leave)" : "Click to pin open"}
                  >
                    {isPinned ? "Pinned" : "Pin Open"}
                  </button>
                </div>

                {/* Scrollable details: Spec sheet, usage, SEO metadata */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Technical Spec Sheet */}
                  <div className="rounded-md border border-border/60 bg-card/60 p-3.5 space-y-2.5 text-xs">
                    <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" /> Technical Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-y-2 text-muted-foreground pt-1">
                      <div>
                        <span className="block text-[11px] text-muted-foreground/70">Dimensions</span>
                        <span className="font-medium text-foreground">
                          {asset.width && asset.height ? `${asset.width} × ${asset.height} px` : "Unknown"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-muted-foreground/70">Aspect Ratio</span>
                        <span className="font-medium text-foreground">{ratio || "—"}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-muted-foreground/70">File Size</span>
                        <span className="font-medium text-foreground font-mono">{formatBytes(asset.size)}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-muted-foreground/70">MIME Type</span>
                        <span className="font-medium text-foreground font-mono">{asset.mimeType}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[11px] text-muted-foreground/70">Original Name</span>
                        <span className="font-medium text-foreground truncate block" title={asset.fileName}>
                          {asset.fileName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Deep Usage Breakdown ("Used in X places") */}
                  <div className="rounded-md border border-border/60 bg-card/60 p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-primary" /> Active System Usage
                      </h3>
                      {asset.usageCount > 0 ? (
                        <Badge variant="warning" className="text-[10px]">
                          In Use ({asset.usageCount})
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-[10px]">
                          Unused (Safe)
                        </Badge>
                      )}
                    </div>

                    {isUsageLoading ? (
                      <div className="py-3 text-center text-xs text-muted-foreground animate-pulse">
                        Scanning references across database...
                      </div>
                    ) : usageReport && usageReport.references.length > 0 ? (
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {usageReport.references.map((ref) => (
                          <div
                            key={ref.id}
                            className="p-2 rounded-lg border border-border/40 bg-muted/30 flex items-center justify-between text-xs"
                          >
                            <div className="truncate mr-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-primary text-[11px] uppercase tracking-wider">
                                  {ref.entityType}
                                </span>
                                <span className="text-foreground truncate font-medium">{ref.entityTitle}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground block truncate">{ref.fieldPath}</span>
                            </div>
                            {ref.editUrl && (
                              <a
                                href={ref.editUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
                                title="Open in editor"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-2 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg">
                        Not referenced in any Journey, Location, Story, or CMS page. Safe to delete.
                      </div>
                    )}
                  </div>

                  {/* Inline SEO Metadata Editor */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-foreground">SEO & Accessibility Metadata</h3>
                      {isDirty && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium animate-pulse">
                          Unsaved changes
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-muted-foreground">Title</label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setIsPinned(true)}
                        placeholder="e.g. Mostar Old Bridge at Sunset"
                        className="h-8 text-xs bg-muted/20 border-border/60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
                        <span>Alt Text</span>
                        <span className="text-[10px] text-muted-foreground/70">Crucial for SEO</span>
                      </label>
                      <Input
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        onFocus={() => setIsPinned(true)}
                        placeholder="Descriptive text for screen readers"
                        className="h-8 text-xs bg-muted/20 border-border/60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-muted-foreground">Caption</label>
                      <Textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        onFocus={() => setIsPinned(true)}
                        placeholder="Optional editorial caption or credits"
                        rows={2}
                        className="text-xs bg-muted/20 border-border/60 resize-none"
                      />
                    </div>

                    <Button
                      size="sm"
                      onClick={handleSaveMetadata}
                      disabled={!isDirty || updateMetadata.isPending}
                      className="w-full text-xs h-8 cursor-pointer"
                    >
                      {updateMetadata.isPending ? "Saving..." : "Save Metadata"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </>
  )
}


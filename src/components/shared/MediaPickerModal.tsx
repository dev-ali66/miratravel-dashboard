import { useState, useEffect, useMemo, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  Image as ImageIcon,
  Video as VideoIcon,
  Check,
  Upload,
  ArrowUpDown,
  X,
  Loader2,
  FolderOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useMediaGallery } from "@/hooks/media/useMediaLibrary"
import { mediaService, type MediaAsset } from "@/services/mediaService"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export interface SelectedMediaAsset {
  id: string
  url: string
  fileName: string
  mimeType: string
  size: number
  width?: number | null
  height?: number | null
  altText?: string | null
  caption?: string | null
  title?: string | null
}

export interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (assets: SelectedMediaAsset[]) => void
  mode?: "single" | "multiple"
  allowedTypes?: ("image" | "video")[]
  title?: string
  initialSelectedUrl?: string
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  mode = "single",
  allowedTypes,
  title,
  initialSelectedUrl,
}: MediaPickerModalProps) {
  // Navigation & filter state
  const [activeTab, setActiveTab] = useState<"browse" | "upload">("browse")
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "size_desc" | "usage_desc">("newest")

  // Determine active media type filter
  const defaultType = useMemo(() => {
    if (allowedTypes && allowedTypes.length === 1) {
      return allowedTypes[0]
    }
    return "all"
  }, [allowedTypes])

  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">(defaultType)

  // Sync default type when allowedTypes changes
  useEffect(() => {
    setTypeFilter(defaultType)
  }, [defaultType])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
      setPage(1)
    }, 280)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Selected assets state (Map of id -> SelectedMediaAsset)
  const [selectedMap, setSelectedMap] = useState<Map<string, SelectedMediaAsset>>(new Map())

  // In-modal upload state
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const uploadInputRef = useRef<HTMLInputElement>(null)

  // Query gallery
  const galleryQuery = useMediaGallery({
    page,
    limit: 24,
    search: debouncedSearch || undefined,
    type: typeFilter,
    status: "ACTIVE",
    sortBy,
  })

  const { data: galleryData, isLoading } = galleryQuery
  const assets = galleryData?.data || []
  const meta = galleryData?.meta || { page: 1, limit: 24, total: 0, totalPages: 1 }

  // Pre-select initial URL if provided when modal opens
  useEffect(() => {
    if (isOpen && initialSelectedUrl && selectedMap.size === 0) {
      const matched = assets.find((a) => a.url === initialSelectedUrl)
      if (matched) {
        setSelectedMap(
          new Map([
            [
              matched.id,
              {
                id: matched.id,
                url: matched.url,
                fileName: matched.fileName,
                mimeType: matched.mimeType,
                size: matched.size,
                width: matched.width,
                height: matched.height,
                altText: matched.altText,
                caption: matched.caption,
                title: matched.title,
              },
            ],
          ])
        )
      }
    }
  }, [isOpen, initialSelectedUrl, assets])

  // Reset state when closing
  const handleClose = () => {
    setSelectedMap(new Map())
    setSearchInput("")
    setPage(1)
    setActiveTab("browse")
    onClose()
  }

  // Toggle or select an asset
  const handleToggleSelect = (asset: MediaAsset) => {
    const formatted: SelectedMediaAsset = {
      id: asset.id,
      url: asset.url,
      fileName: asset.fileName,
      mimeType: asset.mimeType,
      size: asset.size,
      width: asset.width,
      height: asset.height,
      altText: asset.altText,
      caption: asset.caption,
      title: asset.title,
    }

    if (mode === "single") {
      setSelectedMap(new Map([[asset.id, formatted]]))
    } else {
      setSelectedMap((prev) => {
        const next = new Map(prev)
        if (next.has(asset.id)) {
          next.delete(asset.id)
        } else {
          next.set(asset.id, formatted)
        }
        return next
      })
    }
  }

  // Double-click fast select in single mode
  const handleDoubleClick = (asset: MediaAsset) => {
    if (mode === "single") {
      const formatted: SelectedMediaAsset = {
        id: asset.id,
        url: asset.url,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
        size: asset.size,
        width: asset.width,
        height: asset.height,
        altText: asset.altText,
        caption: asset.caption,
        title: asset.title,
      }
      onSelect([formatted])
      handleClose()
    }
  }

  // Confirm selection
  const handleConfirm = () => {
    if (selectedMap.size === 0) return
    const selectedList = Array.from(selectedMap.values())
    onSelect(selectedList)
    handleClose()
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Enter" && selectedMap.size > 0 && activeTab === "browse") {
        e.preventDefault()
        handleConfirm()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedMap, activeTab])

  // In-modal file upload handler with client-side SHA-256 pre-check
  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return

    try {
      setIsUploading(true)
      setUploadProgress(10)

      const res = await mediaService.uploadFiles(fileArray, (progress) => {
        setUploadProgress(progress)
      })

      if (res.assets.length > 0) {
        toast.success(
          res.existingCount > 0
            ? `Reused ${res.existingCount} existing library asset(s)`
            : `Uploaded ${res.newlyUploadedCount} asset(s) successfully`
        )

        // Select the newly uploaded/reused asset(s)
        const newMap = new Map(mode === "single" ? [] : selectedMap)
        for (const a of res.assets) {
          newMap.set(a.id, {
            id: a.id,
            url: a.url,
            fileName: a.fileName,
            mimeType: a.mimeType,
            size: a.size,
            width: a.width,
            height: a.height,
            altText: a.altText,
            caption: a.caption,
            title: a.title,
          })
          if (mode === "single") break
        }
        setSelectedMap(newMap)

        // Refetch gallery to show newly uploaded file
        galleryQuery.refetch()
        setActiveTab("browse")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload file")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const modalTitle =
    title ||
    (mode === "multiple"
      ? "Select Media Assets from Library"
      : allowedTypes?.length === 1 && allowedTypes[0] === "video"
      ? "Choose Video from Library"
      : "Choose Image from Library")

  // First selected item for preview footer
  const firstSelected = useMemo(() => {
    const values = Array.from(selectedMap.values())
    return values.length > 0 ? values[0] : null
  }, [selectedMap])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-5xl h-[88vh] max-h-[820px] p-0 flex flex-col overflow-hidden bg-background/98 backdrop-blur-2xl border border-border shadow-2xl rounded-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
      >
        {/* Top Header Bar */}
        <DialogHeader className="flex flex-row items-center justify-between px-5 py-3.5 border-b border-border/70 shrink-0 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderOpen className="h-4.5 w-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground tracking-tight">
                {modalTitle}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                {mode === "multiple"
                  ? "Select one or more items to insert into the gallery."
                  : "Double-click an item or select and confirm to insert."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch: Browse vs Upload */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/50 p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab("browse")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer",
                  activeTab === "browse"
                    ? "bg-background text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FolderOpen className="h-3.5 w-3.5" />
                Browse Library
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer",
                  activeTab === "upload"
                    ? "bg-background text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload New
              </button>
            </div>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Tab 1: Browse Library View */}
        {activeTab === "browse" && (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 border-b border-border/50 bg-muted/10 shrink-0">
              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search file name, title..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="h-8.5 pl-8.5 pr-8 text-xs rounded-lg bg-background"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Media Type Filter Tabs (if not restricted to single type) */}
                {(!allowedTypes || allowedTypes.length > 1) && (
                  <div className="flex items-center rounded-lg border border-border/80 bg-background p-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setTypeFilter("all")
                        setPage(1)
                      }}
                      className={cn(
                        "rounded px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                        typeFilter === "all"
                          ? "bg-primary/15 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTypeFilter("image")
                        setPage(1)
                      }}
                      className={cn(
                        "flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors cursor-pointer",
                        typeFilter === "image"
                          ? "bg-primary/15 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ImageIcon className="h-3 w-3" />
                      Images
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTypeFilter("video")
                        setPage(1)
                      }}
                      className={cn(
                        "flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors cursor-pointer",
                        typeFilter === "video"
                          ? "bg-primary/15 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <VideoIcon className="h-3 w-3" />
                      Videos
                    </button>
                  </div>
                )}

                {/* Sort selector */}
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value as any)
                      setPage(1)
                    }}
                    className="h-8 rounded-lg border border-border/80 bg-background px-2 text-xs text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="usage_desc">Most Used</option>
                    <option value="size_desc">Largest Size</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Media Grid Body */}
            <div className="flex-1 overflow-y-auto p-5 min-h-0 bg-muted/5">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">Loading media library...</p>
                </div>
              ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 border border-border">
                    <ImageIcon className="h-7 w-7 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No media assets found</p>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting your search or upload a new file.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("upload")}
                    className="gap-1.5 mt-1"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload File
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                  {assets.map((asset) => {
                    const isSelected = selectedMap.has(asset.id)
                    const isVideo = asset.mimeType.startsWith("video/")

                    return (
                      <div
                        key={asset.id}
                        onClick={() => handleToggleSelect(asset)}
                        onDoubleClick={() => handleDoubleClick(asset)}
                        className={cn(
                          "group relative flex flex-col rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 select-none bg-card shadow-2xs hover:shadow-md",
                          isSelected
                            ? "border-primary ring-2 ring-primary/40 bg-primary/5"
                            : "border-border/80 hover:border-border"
                        )}
                      >
                        {/* Thumbnail Container */}
                        <div className="relative aspect-video w-full bg-muted/40 overflow-hidden">
                          {isVideo ? (
                            <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-white">
                              <VideoIcon className="h-6 w-6 opacity-80" />
                              <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 py-0.2 text-[9px] font-mono text-white">
                                VIDEO
                              </span>
                            </div>
                          ) : (
                            <img
                              src={asset.url}
                              alt={asset.altText || asset.title || asset.fileName}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}

                          {/* Top-Right Selection Pill / Checkmark */}
                          <div
                            className={cn(
                              "absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full transition-all duration-150",
                              isSelected
                                ? "bg-primary text-primary-foreground shadow-sm scale-100"
                                : "bg-black/40 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-black/60"
                            )}
                          >
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>

                          {/* Dimensions & Size Pill */}
                          <div className="absolute bottom-1 left-1 flex items-center gap-1">
                            {asset.width && asset.height && (
                              <span className="rounded bg-black/70 px-1 py-0.2 text-[9px] font-mono text-white/90">
                                {asset.width}×{asset.height}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* File Details Label */}
                        <div className="p-2 flex flex-col gap-0.5">
                          <p
                            className="text-[11px] font-medium text-foreground truncate"
                            title={asset.title || asset.fileName}
                          >
                            {asset.title || asset.fileName}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                            <span>{(asset.size / 1024).toFixed(0)} KB</span>
                            <span className="uppercase">{asset.mimeType.split("/")[1] || "file"}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Pagination footer inside browse */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-2 border-t border-border/50 bg-muted/10 shrink-0 text-xs text-muted-foreground">
                <span>
                  Showing {assets.length} of {meta.total} assets
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
                    Prev
                  </Button>
                  <span className="px-2 font-medium text-foreground">
                    {page} / {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upload New View */}
        {activeTab === "upload" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/5">
            <input
              type="file"
              ref={uploadInputRef}
              multiple={mode === "multiple"}
              accept={
                allowedTypes?.length === 1 && allowedTypes[0] === "video"
                  ? "video/*"
                  : allowedTypes?.length === 1 && allowedTypes[0] === "image"
                  ? "image/*"
                  : "image/*,video/*"
              }
              className="hidden"
              onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (e.dataTransfer.files) handleUploadFiles(e.dataTransfer.files)
              }}
              onClick={() => uploadInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center w-full max-w-xl h-80 rounded-2xl border-2 border-dashed border-border/80 bg-background p-8 text-center cursor-pointer transition-all hover:border-primary/60 hover:bg-muted/30 shadow-xs",
                isUploading && "pointer-events-none opacity-60"
              )}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-sm font-semibold text-foreground">Uploading and checking deduplication...</p>
                  <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{ width: `${uploadProgress || 35}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                    <Upload className="h-8 w-8" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Drop files here or click to browse
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-xs mb-4">
                    Instant client SHA-256 deduplication active. Files existing on server reuse zero extra bytes.
                  </p>
                  <Button variant="secondary" size="sm" className="gap-2 pointer-events-none">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Select File from Device
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Sticky Action Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/70 bg-card shrink-0">
          {/* Left: Selection summary & preview */}
          <div className="flex items-center gap-3 min-w-0">
            {selectedMap.size > 0 ? (
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-0.5">
                  {selectedMap.size} selected
                </span>
                {firstSelected && (
                  <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground truncate max-w-md">
                    <span className="font-medium text-foreground truncate">
                      {firstSelected.title || firstSelected.fileName}
                    </span>
                    {firstSelected.width && firstSelected.height && (
                      <span className="font-mono text-[11px]">
                        ({firstSelected.width}×{firstSelected.height})
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">
                No items selected. Click an item to select.
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleClose} className="text-xs h-8 px-3">
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={selectedMap.size === 0}
              onClick={handleConfirm}
              className="gap-1.5 text-xs h-8 px-4 font-semibold shadow-xs"
            >
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              {mode === "multiple"
                ? `Insert Selected (${selectedMap.size})`
                : "Select & Insert"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import {
  useMediaGallery,
  useMediaStats,
  useSoftDeleteMedia,
  useBulkSoftDelete,
  useStorageOptimizerScan,
} from "@/hooks/media/useMediaLibrary"
import { MediaGrid } from "./MediaGrid"
import { MediaTableView } from "./MediaTableView"
import { MediaFilters } from "./MediaFilters"
import { MediaInspectorDrawer } from "./MediaInspectorDrawer"
import { MediaBulkActionBar } from "./MediaBulkActionBar"
import { MediaDropzone } from "./MediaDropzone"
import { MediaTrashView } from "./MediaTrashView"
import { StorageOptimizerModal } from "./StorageOptimizerModal"
import { Pagination } from "@/components/shared/Pagination"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import {
  Image as ImageIcon,
  HardDrive,
  Trash2,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MediaAsset, MediaGalleryParams } from "@/services/mediaService"

export const MediaLibraryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Tab State: 'active' | 'trash'
  const [activeTab, setActiveTab] = useState<"active" | "trash">(
    () => (searchParams.get("tab") as "active" | "trash") || "active"
  )
  const [viewMode, setViewMode] = useState<"grid" | "table">(
    () => (searchParams.get("view") as "grid" | "table") || "grid"
  )

  // Filter params
  const [params, setParams] = useState<MediaGalleryParams>({
    page: Number(searchParams.get("page")) || 1,
    limit: 30,
    search: searchParams.get("search") || "",
    type: (searchParams.get("type") as any) || "all",
    inUse: (searchParams.get("inUse") as any) || "all",
    sortBy: (searchParams.get("sortBy") as any) || "newest",
    status: searchParams.get("tab") === "trash" ? "IN_TRASH" : "ACTIVE",
  })

  // Selection & Inspector state
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false)

  // Data queries
  const { data: stats, refetch: refetchStats } = useMediaStats()
  const { data: optimizerScan, refetch: refetchOptimizer } = useStorageOptimizerScan()
  const {
    data: galleryData,
    isLoading,
    isFetching,
    refetch: refetchGallery,
  } = useMediaGallery({
    ...params,
    status: activeTab === "trash" ? "IN_TRASH" : "ACTIVE",
  })

  // Mutations
  const softDeleteMutation = useSoftDeleteMedia()
  const bulkSoftDeleteMutation = useBulkSoftDelete()

  // Sync browser Back/Forward navigation into state
  useEffect(() => {
    const urlTab = (searchParams.get("tab") as "active" | "trash") || "active"
    if (urlTab !== activeTab) {
      setActiveTab(urlTab)
      setParams((prev) => ({
        ...prev,
        page: 1,
        status: urlTab === "trash" ? "IN_TRASH" : "ACTIVE",
      }))
    }
    const urlView = (searchParams.get("view") as "grid" | "table") || "grid"
    if (urlView !== viewMode) {
      setViewMode(urlView)
    }
  }, [searchParams])

  // Sync params, activeTab, and viewMode to URL cleanly
  useEffect(() => {
    const q = new URLSearchParams()
    if (activeTab === "trash") q.set("tab", "trash")
    if (viewMode !== "grid") q.set("view", viewMode)
    if (params.page && params.page > 1) q.set("page", String(params.page))
    if (params.search) q.set("search", params.search)
    if (params.type && params.type !== "all") q.set("type", params.type)
    if (params.inUse && params.inUse !== "all") q.set("inUse", params.inUse)
    if (params.sortBy && params.sortBy !== "newest") q.set("sortBy", params.sortBy)

    const currentStr = searchParams.toString()
    const nextStr = q.toString()
    if (currentStr !== nextStr) {
      setSearchParams(q, { replace: true })
    }
  }, [params, activeTab, viewMode, setSearchParams])

  const handleTabChange = (newTab: "active" | "trash") => {
    setSelectedIds([])
    setSelectedAsset(null)
    setActiveTab(newTab)
    setParams((prev) => ({
      ...prev,
      page: 1,
      status: newTab === "trash" ? "IN_TRASH" : "ACTIVE",
    }))
  }

  const handleViewModeChange = (mode: "grid" | "table") => {
    setViewMode(mode)
  }

  const handleToggleSelectId = (id: string, _e?: React.MouseEvent) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    const assets = galleryData?.data || []
    if (assets.every((a) => selectedIds.includes(a.id))) {
      setSelectedIds([])
    } else {
      setSelectedIds(assets.map((a) => a.id))
    }
  }

  const handleRefresh = () => {
    refetchGallery()
    refetchStats()
  }

  const [accumulatedAssets, setAccumulatedAssets] = useState<MediaAsset[]>([])

  // Reset or accumulate assets for infinite scroll stream
  useEffect(() => {
    if (galleryData?.data) {
      if ((params.page || 1) === 1) {
        setAccumulatedAssets(galleryData.data)
      } else {
        setAccumulatedAssets((prev) => {
          const ids = new Set(prev.map((a) => a.id))
          const fresh = galleryData.data.filter((a) => !ids.has(a.id))
          return [...prev, ...fresh]
        })
      }
    }
  }, [galleryData, params.page])

  // Reset accumulated assets on filter or tab change
  const filterKey = `${params.search}-${params.type}-${params.inUse}-${params.sortBy}-${activeTab}`
  useEffect(() => {
    setAccumulatedAssets([])
  }, [filterKey])

  const assets = accumulatedAssets.length > 0 ? accumulatedAssets : (galleryData?.data || [])
  const meta = galleryData?.meta || { page: 1, limit: 30, total: 0, totalPages: 1 }

  return (
    <div
      className={cn(
        "space-y-6 pb-20 transition-all duration-300",
        selectedAsset && "lg:pr-[390px] xl:pr-[430px]"
      )}
    >
      {/* Page Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={ImageIcon}
        title="Media Library"
        subtitle="Central storage with SHA-256 deduplication and asset tracking."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Total Storage"
              value={stats?.totalSizeFormatted || "0 MB"}
              subtext="Optimized space"
              icon={HardDrive}
              iconColor="text-primary"
            />
            <CompactStatCard
              label="Media Assets"
              value={`${stats?.imageCount ?? 0} Img / ${stats?.videoCount ?? 0} Vid`}
              subtext="Catalog items"
              icon={ImageIcon}
              iconColor="text-blue-500"
            />
            <CompactStatCard
              label="In Active Use"
              value={`${Math.max(0, (stats?.totalCount ?? meta.total ?? 0) - (stats?.unusedCount ?? 0))} Used`}
              subtext={`${stats?.unusedCount ?? 0} unused`}
              icon={Layers}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Trash Grace"
              value={`${stats?.trashCount ?? 0} Items`}
              subtext="Click trash tab"
              icon={Trash2}
              iconColor="text-amber-500"
              className="cursor-pointer"
            />
          </div>
        }
      />

      {/* Main Tabs (Active Library vs Trash Bin) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-1.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleTabChange("active")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === "active"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Active Library
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("trash")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === "trash"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Trash Bin
            {(stats?.trashCount ?? 0) > 0 ? (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0 rounded-full font-bold",
                  activeTab === "trash"
                    ? "bg-white/20 text-white"
                    : "bg-amber-500/20 text-amber-800 dark:text-amber-200"
                )}
              >
                {stats?.trashCount}
              </span>
            ) : null}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOptimizerOpen(true)}
            className="text-xs h-8 sm:h-8.5 gap-1.5 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 transition-all font-medium rounded-lg px-2.5"
            title="Scan and consolidate duplicate files into single masters"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500/40" />
            Optimize Storage
            {(optimizerScan?.totalDuplicateGroups ?? 0) > 0 && (
              <span className="ml-0.5 bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {optimizerScan?.totalDuplicateGroups}
              </span>
            )}
          </Button>

          <MediaDropzone
            onUploadSuccess={() => {
              refetchGallery()
              refetchStats()
              refetchOptimizer()
            }}
          />
        </div>
      </div>

      {/* Tab 1: Active Library */}
      {activeTab === "active" && (
        <div className="space-y-4">
          <MediaFilters
            params={params}
            viewMode={viewMode}
            onParamsChange={(newP) => setParams((prev) => ({ ...prev, ...newP }))}
            onViewModeChange={handleViewModeChange}
            onRefresh={handleRefresh}
            onToggleSelectAll={handleToggleSelectAll}
            isAllSelected={assets.length > 0 && assets.every((a) => selectedIds.includes(a.id))}
            selectedCount={selectedIds.length}
            isFetching={isFetching}
          />

          {viewMode === "grid" ? (
            <MediaGrid
              assets={assets}
              selectedAssetId={selectedAsset?.id}
              selectedIds={selectedIds}
              onSelectAsset={(a) => setSelectedAsset(a)}
              onToggleSelectId={handleToggleSelectId}
              isLoading={isLoading}
            />
          ) : (
            <MediaTableView
              assets={assets}
              selectedAssetId={selectedAsset?.id}
              selectedIds={selectedIds}
              onSelectAsset={(a) => setSelectedAsset(a)}
              onToggleSelectId={handleToggleSelectId}
              onToggleSelectAll={handleToggleSelectAll}
              onSoftDelete={(id) => softDeleteMutation.mutate(id)}
              isLoading={isLoading}
            />
          )}

          {/* Universal Pagination Bar */}
          {meta && (
            <Pagination
              mode="infinite"
              currentPage={meta.page}
              totalPages={meta.totalPages}
              totalItems={meta.total}
              pageSize={meta.limit}
              pageSizeOptions={[15, 30, 60, 120]}
              loadedCount={assets.length}
              hasMore={assets.length < meta.total}
              isLoadingMore={isFetching && meta.page > 1}
              onLoadMore={() => setParams((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
              onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
              onPageSizeChange={(sz) => {
                setAccumulatedAssets([])
                setParams((prev) => ({ ...prev, limit: sz, page: 1 }))
              }}
              className="mt-6"
            />
          )}
        </div>
      )}

      {/* Tab 2: Trash Recovery Bin */}
      {activeTab === "trash" && <MediaTrashView assets={assets} isLoading={isLoading} />}

      {/* Right-Side Fixed Inspector Sidebar (Mirrors Left Sidebar Architecture) */}
      <MediaInspectorDrawer
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onSoftDelete={(id) => {
          softDeleteMutation.mutate(id)
          setSelectedAsset(null)
        }}
      />

      {/* Multi-Select Floating Glassmorphism Bar */}
      <MediaBulkActionBar
        selectedIds={selectedIds}
        assets={assets}
        onClearSelection={() => setSelectedIds([])}
        onBulkTrash={(ids) => {
          bulkSoftDeleteMutation.mutate(ids)
          setSelectedIds([])
        }}
        onToggleSelectAll={handleToggleSelectAll}
        isDeleting={bulkSoftDeleteMutation.isPending}
      />

      {/* 1-Click Universal Storage Optimizer Modal */}
      <StorageOptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => {
          setIsOptimizerOpen(false)
          refetchGallery()
          refetchStats()
          refetchOptimizer()
        }}
      />
    </div>
  )
}

export default MediaLibraryPage

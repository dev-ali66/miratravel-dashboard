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
import { MediaTrashView } from "./MediaTrashView"
import { StorageOptimizerModal } from "./StorageOptimizerModal"
import { Pagination } from "@/components/shared/Pagination"
import { useListingPagination } from "@/hooks/ui/useListingPagination"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import {
  Image as ImageIcon,
  HardDrive,
  Trash2,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MediaAsset, MediaGalleryParams } from "@/services/mediaService"

export const MediaLibraryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Tab State & View Mode derived directly from searchParams (Single Source of Truth)
  const activeTab: "active" | "trash" = searchParams.get("tab") === "trash" ? "trash" : "active"
  const viewMode: "grid" | "table" = searchParams.get("view") === "table" ? "table" : "grid"

  // Filter params (search, type, inUse, sortBy)
  const [params, setParams] = useState<Omit<MediaGalleryParams, "page" | "limit">>({
    search: searchParams.get("search") || "",
    type: (searchParams.get("type") as any) || "all",
    inUse: (searchParams.get("inUse") as any) || "all",
    sortBy: (searchParams.get("sortBy") as any) || "newest",
  })

  // Selection & Inspector state
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false)

  // Data queries
  const { data: stats, refetch: refetchStats } = useMediaStats()
  const { data: optimizerScan, refetch: refetchOptimizer } = useStorageOptimizerScan()

  // Unified pagination manager with strict concurrency guard
  const filterKey = `${params.search}-${params.type}-${params.inUse}-${params.sortBy}-${activeTab}`

  const {
    mode,
    currentPage,
    setCurrentPage,
    setTargetItems,
    columns,
    effectiveLimit,
    pageSizeOptions,
    gridRef,
    displayItems: assets,
    hasMore,
    isLoadingMore,
    handleLoadMore,
    setIncomingData,
  } = useListingPagination<MediaAsset>({
    mode: "infinite",
    initialTargetItems: 30,
    isGrid: viewMode === "grid",
    gridColumns: { base: 2, sm: 3, md: 4, lg: 5, xl: 6 },
    filterKey,
    keyExtractor: (item) => item.id,
  })

  const {
    data: galleryData,
    isLoading,
    isFetching,
    refetch: refetchGallery,
  } = useMediaGallery({
    page: currentPage,
    limit: effectiveLimit,
    search: params.search,
    type: params.type,
    inUse: params.inUse,
    sortBy: params.sortBy,
    status: activeTab === "trash" ? "IN_TRASH" : "ACTIVE",
  })

  // Sync incoming data into pagination manager
  useEffect(() => {
    if (galleryData) {
      setIncomingData(galleryData.data, galleryData.meta?.total)
    }
  }, [galleryData, setIncomingData])

  // Mutations
  const softDeleteMutation = useSoftDeleteMedia()
  const bulkSoftDeleteMutation = useBulkSoftDelete()

  // Clean tab change: updates searchParams directly, no conflicting effects or blinking loops
  const handleTabChange = (newTab: "active" | "trash") => {
    setSelectedIds([])
    setSelectedAsset(null)
    setCurrentPage(1)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (newTab === "trash") {
          next.set("tab", "trash")
        } else {
          next.delete("tab")
        }
        return next
      },
      { replace: true }
    )
  }

  // Clean view mode change: updates searchParams directly
  const handleViewModeChange = (mode: "grid" | "table") => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (mode === "table") {
          next.set("view", "table")
        } else {
          next.delete("view")
        }
        return next
      },
      { replace: true }
    )
  }

  // Filter params change: updates internal state and URL parameters cleanly
  const handleParamsChange = (newP: Partial<MediaGalleryParams>) => {
    if (newP.page) setCurrentPage(newP.page)
    setParams((prev) => {
      const updated = { ...prev, ...newP }
      setSearchParams(
        (prevSp) => {
          const next = new URLSearchParams(prevSp)
          if (updated.search) next.set("search", updated.search); else next.delete("search")
          if (updated.type && updated.type !== "all") next.set("type", updated.type); else next.delete("type")
          if (updated.inUse && updated.inUse !== "all") next.set("inUse", updated.inUse); else next.delete("inUse")
          if (updated.sortBy && updated.sortBy !== "newest") next.set("sortBy", updated.sortBy); else next.delete("sortBy")
          return next
        },
        { replace: true }
      )
      return updated
    })
  }

  const handleToggleSelectId = (id: string, _e?: React.MouseEvent) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
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

  const meta = galleryData?.meta || { page: 1, limit: 30, total: 0, totalPages: 1 }

  return (
    <div
      className={cn(
        "space-y-6 transition-all duration-300",
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
              onClick={() => handleTabChange("trash")}
            />
          </div>
        }
      />

      {/* Unified Segmented Media Toolbar (Includes Search, Tabs, Types, Optimizer, Upload & Refresh) */}
      <MediaFilters
        params={{ ...params, page: currentPage, limit: effectiveLimit }}
        viewMode={viewMode}
        onParamsChange={handleParamsChange}
        onViewModeChange={handleViewModeChange}
        onRefresh={handleRefresh}
        isFetching={isFetching}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        trashCount={stats?.trashCount}
        optimizerCount={optimizerScan?.totalDuplicateGroups}
        onOpenOptimizer={() => setIsOptimizerOpen(true)}
        onUploadSuccess={() => {
          refetchGallery()
          refetchStats()
          refetchOptimizer()
        }}
      />

      {/* Tab 1: Active Library */}
      {activeTab === "active" && (
        <div className="space-y-4">

          {viewMode === "grid" ? (
            <div ref={gridRef}>
              <MediaGrid
                assets={assets}
                selectedAssetId={selectedAsset?.id}
                selectedIds={selectedIds}
                onSelectAsset={(a) => setSelectedAsset(a)}
                onToggleSelectId={handleToggleSelectId}
                isLoading={isLoading && currentPage === 1}
              />
            </div>
          ) : (
            <MediaTableView
              assets={assets}
              selectedAssetId={selectedAsset?.id}
              selectedIds={selectedIds}
              onSelectAsset={(a) => setSelectedAsset(a)}
              onToggleSelectId={handleToggleSelectId}
              onToggleSelectAll={handleToggleSelectAll}
              onSoftDelete={(id) => softDeleteMutation.mutate(id)}
              isLoading={isLoading && currentPage === 1}
            />
          )}

          {/* Universal Pagination Bar */}
          {galleryData?.meta && (
            <Pagination
              mode={mode}
              currentPage={currentPage}
              totalPages={galleryData.meta.totalPages}
              totalItems={galleryData.meta.total}
              pageSize={effectiveLimit}
              pageSizeOptions={pageSizeOptions}
              loadedCount={assets.length}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore || (isFetching && currentPage > 1)}
              onLoadMore={handleLoadMore}
              onPageChange={setCurrentPage}
              onPageSizeChange={setTargetItems}
              columns={columns}
              className="mt-6"
            />
          )}
        </div>
      )}

      {/* Tab 2: Trash Recovery Bin */}
      {activeTab === "trash" && (
        <div className="space-y-4">
          <MediaTrashView assets={assets} isLoading={isLoading && currentPage === 1} />
          {galleryData?.meta && galleryData.meta.total > 0 && (
            <Pagination
              mode={mode}
              currentPage={currentPage}
              totalPages={galleryData.meta.totalPages}
              totalItems={galleryData.meta.total}
              pageSize={effectiveLimit}
              pageSizeOptions={pageSizeOptions}
              loadedCount={assets.length}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore || (isFetching && currentPage > 1)}
              onLoadMore={handleLoadMore}
              onPageChange={setCurrentPage}
              onPageSizeChange={setTargetItems}
              columns={columns}
              className="mt-6"
            />
          )}
        </div>
      )}

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

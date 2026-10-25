import React from "react"
import {
  LayoutGrid,
  List,
  Image as ImageIcon,
  Video,
  Layers,
  ArrowUpDown,
  Sparkles,
  Trash2,
  Zap,
  FileUp,
  Loader2,
} from "lucide-react"
import {
  FilterToolbar,
  FilterGroup,
  FilterSearch,
  FilterSelect,
  FilterTabs,
  FilterActions,
  FilterCreateButton,
  FilterSegmentButton,
  FilterResetButton,
} from "@/components/shared/FilterToolbar"
import { MediaDropzone } from "./MediaDropzone"
import { cn } from "@/lib/utils"
import type { MediaGalleryParams } from "@/services/mediaService"

interface MediaFiltersProps {
  params: MediaGalleryParams
  viewMode: "grid" | "table"
  onParamsChange: (newParams: Partial<MediaGalleryParams>) => void
  onViewModeChange: (mode: "grid" | "table") => void
  onRefresh: () => void
  onToggleSelectAll?: () => void
  isAllSelected?: boolean
  selectedCount?: number
  isFetching?: boolean
  // Integrated top controls
  activeTab: "active" | "trash"
  onTabChange: (tab: "active" | "trash") => void
  trashCount?: number
  optimizerCount?: number
  onOpenOptimizer: () => void
  onUploadSuccess: () => void
}

export const MediaFilters: React.FC<MediaFiltersProps> = ({
  params,
  viewMode,
  onParamsChange,
  onViewModeChange,
  onRefresh,
  isFetching,
  activeTab,
  onTabChange,
  trashCount,
  optimizerCount,
  onOpenOptimizer,
  onUploadSuccess,
}) => {
  const currentType = params.type || "all"
  const currentInUse = params.inUse || "all"
  const currentSort = params.sortBy || "newest"

  return (
    <FilterToolbar>
      <FilterGroup>
        {/* Instant Search Bar - Always far left, fills available space */}
        <FilterSearch
          value={params.search || ""}
          onChange={(val) => onParamsChange({ search: val, page: 1 })}
          placeholder="Search media by title, filename, extension..."
          width="w-full flex-1 min-w-[180px]"
        />
      </FilterGroup>

      {/* Right side: Integrated controls, segmented seamlessly */}
      <FilterActions>
        {/* 1 & 2: Active Library & Trash Bin Tabs */}
        <FilterTabs
          tabs={[
            { key: "active", label: "Active Library", icon: Sparkles },
            {
              key: "trash",
              label: "Trash",
              icon: Trash2,
              count: trashCount && trashCount > 0 ? trashCount : undefined,
            },
          ]}
          activeTab={activeTab}
          onChange={(key) => onTabChange(key as "active" | "trash")}
        />

        {/* Media Type Dropdown */}
        <FilterSelect
          value={currentType}
          onChange={(val) => onParamsChange({ type: val as any, page: 1 })}
          options={[
            { label: "All Media", value: "all", icon: Layers },
            { label: "Images", value: "image", icon: ImageIcon },
            { label: "Videos", value: "video", icon: Video },
          ]}
          allLabel="All Media"
          allValue="all"
          placeholder="Type"
          width="min-w-[105px] max-w-[130px]"
        />

        {/* Usage Filter Dropdown */}
        <FilterSelect
          value={currentInUse}
          onChange={(val) => onParamsChange({ inUse: val as any, page: 1 })}
          options={[
            { label: "All Assets", value: "all" },
            { label: "In Use", value: "true" },
            { label: "Unused", value: "false" },
          ]}
          allLabel="All Assets"
          allValue="all"
          placeholder="Usage"
          width="min-w-[100px] max-w-[125px]"
        />

        {/* Sort Dropdown */}
        <FilterSelect
          value={currentSort}
          onChange={(val) => onParamsChange({ sortBy: val as any, page: 1 })}
          options={[
            { label: "Newest First", value: "newest" },
            { label: "Oldest First", value: "oldest" },
            { label: "Largest Size", value: "size_desc" },
            { label: "Smallest Size", value: "size_asc" },
            { label: "Most Used", value: "usage_desc" },
          ]}
          icon={ArrowUpDown}
          placeholder="Sort"
          width="min-w-[110px] max-w-[135px]"
        />

        {/* 3: Optimize Storage Segment */}
        <FilterSegmentButton
          onClick={onOpenOptimizer}
          title="Scan and consolidate duplicate files into single masters"
          className="text-amber-600 dark:text-amber-400 font-medium hover:bg-amber-500/10"
        >
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span>Optimize</span>
          {(optimizerCount ?? 0) > 0 && (
            <span className="ml-1 bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {optimizerCount}
            </span>
          )}
        </FilterSegmentButton>

        {/* 4: Upload Media Segment (Brand greenish text) */}
        <MediaDropzone
          onUploadSuccess={onUploadSuccess}
          customTrigger={(triggerUpload, isUploading) => (
            <FilterCreateButton
              onClick={triggerUpload}
              label={isUploading ? "Uploading..." : "Upload Media"}
              icon={isUploading ? Loader2 : FileUp}
            />
          )}
        />

        {/* View Mode Switcher (Grid vs Table) */}
        <div className="flex items-center px-2">
          <div className="inline-flex items-center rounded-lg bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-1 rounded-sm transition-all cursor-pointer",
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={cn(
                "p-1 rounded-sm transition-all cursor-pointer",
                viewMode === "table"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table view"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Universal Far-Right Refresh Button */}
        <FilterResetButton
          onClick={onRefresh}
          title="Refresh media library"
          className={cn(isFetching && "animate-spin text-primary")}
        />
      </FilterActions>
    </FilterToolbar>
  )
}

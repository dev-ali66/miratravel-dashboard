import React from "react"
import {
  LayoutGrid,
  List,
  Image as ImageIcon,
  Video,
  Layers,
  ArrowUpDown,
  RefreshCw,
  CheckSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  FilterToolbar,
  FilterGroup,
  FilterSearch,
  FilterSelect,
  FilterTabs,
  FilterActions,
} from "@/components/shared/FilterToolbar"
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
}

export const MediaFilters: React.FC<MediaFiltersProps> = ({
  params,
  viewMode,
  onParamsChange,
  onViewModeChange,
  onRefresh,
  onToggleSelectAll,
  isAllSelected,
  selectedCount,
  isFetching,
}) => {
  const currentType = params.type || "all"
  const currentInUse = params.inUse || "all"
  const currentSort = params.sortBy || "newest"

  return (
    <FilterToolbar>
      <FilterGroup>
        {/* Instant Search Bar - Always far left */}
        <FilterSearch
          value={params.search || ""}
          onChange={(val) => onParamsChange({ search: val, page: 1 })}
          placeholder="Search by name or title..."
          width="w-44 sm:w-56 shrink-0"
        />

        {/* Media Type Tabs */}
        <FilterTabs
          tabs={[
            { key: "all", label: "All Media", icon: Layers },
            { key: "image", label: "Images", icon: ImageIcon },
            { key: "video", label: "Videos", icon: Video },
          ]}
          activeTab={currentType}
          onChange={(key) => onParamsChange({ type: key as any, page: 1 })}
        />

        {/* Housekeeping Usage Filter */}
        <FilterTabs
          tabs={[
            { key: "all", label: "All" },
            { key: "true", label: "In Use" },
            { key: "false", label: "Unused" },
          ]}
          activeTab={currentInUse}
          onChange={(key) => onParamsChange({ inUse: key as any, page: 1 })}
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
          width="min-w-[115px] max-w-[135px]"
        />
      </FilterGroup>

      {/* Right: Actions, Refresh & View Mode Switcher */}
      <FilterActions>
        {/* Refresh Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          className="h-8 sm:h-8.5 w-8 sm:w-8.5 rounded-lg border-border/70 cursor-pointer"
          title="Refresh library"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin text-primary")} />
        </Button>

        {/* Select All Quick Button */}
        {onToggleSelectAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleSelectAll}
            className={cn(
              "h-8 sm:h-8.5 rounded-lg text-xs gap-1.5 border-border/70 bg-background/60 dark:bg-background/40 hover:bg-muted/50 px-2.5 transition-all cursor-pointer",
              isAllSelected && "border-primary/50 bg-primary/10 text-primary font-medium"
            )}
            title={isAllSelected ? "Deselect all files" : "Select all files on page"}
          >
            <CheckSquare className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">
              {isAllSelected ? "Deselect All" : selectedCount ? `Select All (${selectedCount})` : "Select All"}
            </span>
          </Button>
        )}

        {/* View Mode Switcher (Grid vs Table) */}
        <div className="inline-flex items-center rounded-lg border border-border/70 bg-muted/20 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-1 rounded-md transition-all cursor-pointer",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-2xs font-semibold"
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
              "p-1 rounded-md transition-all cursor-pointer",
              viewMode === "table"
                ? "bg-background text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Table view"
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </FilterActions>
    </FilterToolbar>
  )
}

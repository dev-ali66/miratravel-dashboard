import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  X,
  LayoutGrid,
  List,
  Image as ImageIcon,
  Video,
  Layers,
  ArrowUpDown,
  RefreshCw,
  CheckSquare,
} from "lucide-react"
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
    <div className="flex flex-col gap-3 py-3 border-b border-border/60">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Type Filter Tabs & Housekeeping Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Media Type Tabs */}
          <div className="inline-flex items-center rounded-lg border border-border/60 bg-muted/30 p-0.5 text-xs">
            <button
              onClick={() => onParamsChange({ type: "all", page: 1 })}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5",
                currentType === "all"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Layers className="h-3.5 w-3.5" /> All Media
            </button>
            <button
              onClick={() => onParamsChange({ type: "image", page: 1 })}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5",
                currentType === "image"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ImageIcon className="h-3.5 w-3.5" /> Images
            </button>
            <button
              onClick={() => onParamsChange({ type: "video", page: 1 })}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5",
                currentType === "video"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Video className="h-3.5 w-3.5" /> Videos
            </button>
          </div>

          {/* Housekeeping Usage Filter (All / In Use / Unused) */}
          <div className="inline-flex items-center rounded-lg border border-border/60 bg-muted/30 p-0.5 text-xs">
            <button
              onClick={() => onParamsChange({ inUse: "all", page: 1 })}
              className={cn(
                "px-2.5 py-1.5 rounded-md font-medium transition-all",
                currentInUse === "all"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Usage
            </button>
            <button
              onClick={() => onParamsChange({ inUse: "true", page: 1 })}
              className={cn(
                "px-2.5 py-1.5 rounded-md font-medium transition-all text-amber-700 dark:text-amber-400",
                currentInUse === "true"
                  ? "bg-background shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              In Use Only
            </button>
            <button
              onClick={() => onParamsChange({ inUse: "false", page: 1 })}
              className={cn(
                "px-2.5 py-1.5 rounded-md font-medium transition-all text-emerald-700 dark:text-emerald-400",
                currentInUse === "false"
                  ? "bg-background shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Unused Only
            </button>
          </div>
        </div>

        {/* Right: Search, Sort Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Instant Search Bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={params.search || ""}
              onChange={(e) => onParamsChange({ search: e.target.value, page: 1 })}
              placeholder="Search by file name or title..."
              className="pl-8 pr-7 h-8 text-xs bg-muted/20 border-border/60"
            />
            {params.search && (
              <button
                onClick={() => onParamsChange({ search: "", page: 1 })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <Select
            value={currentSort}
            onValueChange={(val: any) => onParamsChange({ sortBy: val, page: 1 })}
          >
            <SelectTrigger className="h-8 text-xs w-[130px] border-border/60 bg-muted/20">
              <ArrowUpDown className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="size_desc">Largest Size</SelectItem>
              <SelectItem value="size_asc">Smallest Size</SelectItem>
              <SelectItem value="usage_desc">Most Used</SelectItem>
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="h-8 w-8 border-border/60"
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
                "h-8 text-xs gap-1.5 border-border/60 bg-muted/20 hover:bg-muted/40 transition-all",
                isAllSelected && "border-primary/40 bg-primary/10 text-primary font-medium"
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
          <div className="inline-flex items-center rounded-lg border border-border/60 bg-muted/30 p-0.5">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === "table"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table view"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

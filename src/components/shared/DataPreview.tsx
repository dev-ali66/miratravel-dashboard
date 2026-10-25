import React from "react"
import { AlertCircle, FolderSearch, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import MiraLoader from "@/components/shared/MiraLoader"
import { cn } from "@/lib/utils"

export interface DataPreviewProps<T> {
  /** Array of items to preview/render */
  items: T[]
  /** Whether the primary data query is in loading state */
  isLoading?: boolean
  /** Whether the query failed with an error */
  isError?: boolean
  /** Optional custom error message or error node */
  errorMessage?: React.ReactNode
  /** Optional retry callback for error state */
  onRetry?: () => void

  // === EMPTY STATE CONFIGURATION ===
  /** Custom empty state node to render when items is empty */
  emptyState?: React.ReactNode
  /** Empty state title text */
  emptyTitle?: string
  /** Empty state description text */
  emptyDescription?: string
  /** Empty state Lucide icon component */
  emptyIcon?: React.ComponentType<{ className?: string }>
  /** Optional empty state action button / link */
  emptyAction?: React.ReactNode

  // === LOADING CONFIGURATION ===
  /** Custom loading node. If not provided, MiraLoader will be used */
  loadingState?: React.ReactNode
  /** Loading text message */
  loadingText?: string

  // === LAYOUT & RENDERERS ===
  /** Presentation layout mode. Default is "grid" */
  layout?: "grid" | "table" | "list" | "custom"
  /** CSS class names for the grid container (e.g. "grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2") */
  gridClassName?: string
  /** Optional Ref to attach to the grid element for dynamic column observation */
  gridRef?: React.Ref<HTMLDivElement>
  /** CSS class names for list container */
  listClassName?: string
  /** Item renderer function for grid or list layout */
  renderItem?: (item: T, index: number) => React.ReactNode
  /** Full table renderer function for table layout */
  renderTable?: (items: T[]) => React.ReactNode
  /** Custom children for custom layout */
  children?: React.ReactNode

  // === SLOTS ===
  /** Top toolbar slot (e.g. FilterToolbar) */
  toolbar?: React.ReactNode
  /** Bottom pagination slot (e.g. Pagination component) */
  pagination?: React.ReactNode
  /** Container wrapper class */
  className?: string
}

/**
 * Universal DataPreview Component for MIRA Dashboard
 *
 * Provides a standardized, reusable container for data listings:
 * - Centralizes loading, error, and empty states.
 * - Supports responsive card grids, tables, and stacked lists.
 * - Perfectly coordinates with Pagination, FilterToolbar, and TanStack Query.
 */
export function DataPreview<T>({
  items,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,

  emptyState,
  emptyTitle = "No records found",
  emptyDescription = "There are no items matching your criteria. Try adjusting filters or create a new entry.",
  emptyIcon: EmptyIcon = FolderSearch,
  emptyAction,

  loadingState,
  loadingText = "Loading records...",

  layout = "grid",
  gridClassName = "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2",
  gridRef,
  listClassName = "flex flex-col gap-3",
  renderItem,
  renderTable,
  children,

  toolbar,
  pagination,
  className,
}: DataPreviewProps<T>) {
  // Render Content Area
  const renderContent = () => {
    // 1. Loading State
    if (isLoading) {
      if (loadingState) return loadingState
      return <MiraLoader text={loadingText} className="min-h-[280px] py-12" />
    }

    // 2. Error State
    if (isError) {
      return (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center my-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-destructive">Failed to load data</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {errorMessage ?? "An error occurred while communicating with the server. Please try again."}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-4 gap-1.5 cursor-pointer text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </Button>
          )}
        </div>
      )
    }

    // 3. Empty State
    if (!items || items.length === 0) {
      if (emptyState) return emptyState
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/40 py-20 px-4 text-center my-2">
          <div className="mb-3.5 flex h-13 w-13 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
            <EmptyIcon className="h-6 w-6 stroke-[1.6]" />
          </div>
          <h3 className="text-base font-semibold text-foreground tracking-tight">{emptyTitle}</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">{emptyDescription}</p>
          {emptyAction && <div className="mt-4">{emptyAction}</div>}
        </div>
      )
    }

    // 4. Custom Layout
    if (layout === "custom") {
      return children
    }

    // 5. Table Layout
    if (layout === "table") {
      if (renderTable) return renderTable(items)
      return null
    }

    // 6. List Layout
    if (layout === "list") {
      if (!renderItem) return null
      return <div className={listClassName}>{items.map((item, index) => renderItem(item, index))}</div>
    }

    // 7. Grid Layout (Default)
    if (!renderItem) return null
    return <div ref={gridRef} className={gridClassName}>{items.map((item, index) => renderItem(item, index))}</div>
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Optional Toolbar Slot (e.g. FilterToolbar) */}
      {toolbar}

      {/* Main Content Area */}
      {renderContent()}

      {/* Optional Pagination Slot (Traditional or Infinite) */}
      {!isLoading && !isError && items && items.length > 0 && pagination}
    </div>
  )
}

export default DataPreview

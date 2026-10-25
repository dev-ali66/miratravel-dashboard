import React, { useEffect, useRef } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  CheckCircle2,
  ArrowDown,
  Layers,
  Infinity as InfinityIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { calculateStartItem, calculateEndItem } from "@/lib/paginationUtils"

export interface PaginationModeToggleProps {
  mode: "pages" | "infinite"
  onModeChange: (mode: "pages" | "infinite") => void
  className?: string
  size?: "sm" | "md"
}

export function PaginationModeToggle({
  mode,
  onModeChange,
  className,
  size = "sm",
}: PaginationModeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-border/70 bg-muted/40 p-0.5 text-xs font-semibold backdrop-blur shadow-sm",
        className
      )}
      role="group"
      aria-label="Pagination view mode"
    >
      <button
        type="button"
        onClick={() => onModeChange("pages")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg font-medium transition-all cursor-pointer",
          size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs",
          mode === "pages"
            ? "bg-card text-foreground shadow-sm font-semibold border border-border/50"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Paged view with page numbers"
      >
        <Layers className="h-3.5 w-3.5" />
        <span>Pages</span>
      </button>
      <button
        type="button"
        onClick={() => onModeChange("infinite")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg font-medium transition-all cursor-pointer",
          size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs",
          mode === "infinite"
            ? "bg-card text-foreground shadow-sm font-semibold border border-border/50"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Infinite continuous scroll stream"
      >
        <InfinityIcon className="h-3.5 w-3.5" />
        <span>Infinite</span>
      </button>
    </div>
  )
}

export interface PaginationProps {
  /** Current active page (1-indexed). Required for traditional pagination. */
  currentPage: number
  /** Total available pages. If <= 1 and no totalItems, buttons are hidden or disabled. */
  totalPages: number
  /** Callback fired when user selects a different page in traditional mode. */
  onPageChange: (page: number) => void
  /** Total count of items available on the server. */
  totalItems?: number
  /** Number of items requested per page / batch (default: 10). */
  pageSize?: number
  /** Callback fired when user changes the page size / batch size. */
  onPageSizeChange?: (pageSize: number) => void
  /** Selectable options for page size dropdown (default: [10, 20, 50, 100]). */
  pageSizeOptions?: number[]
  /** Additional container CSS classes. */
  className?: string
  /** Whether to show the items per page dropdown (default: true). */
  showPageSize?: boolean
  /** Whether to show the "Results: X - Y of Z" counter label (default: true). */
  showResultsCount?: boolean
  /** Traditional layout style: horizontal "bar" or vertical "stacked" (default: "bar"). */
  layout?: "bar" | "stacked"

  // === SMART PAGINATION & INFINITE SCROLL EXTENSIONS ===
  /** "pages" for traditional numbered buttons, "infinite" for scroll/button stream. Default: "pages" */
  mode?: "pages" | "infinite"
  /** Callback fired when user toggles between traditional pages and infinite scroll. */
  onModeChange?: (mode: "pages" | "infinite") => void
  /** Whether to render the mode toggle inside the pagination component (default: false). */
  showModeSwitch?: boolean
  /** Infinite Scroll: Whether there are more pages/items to load. */
  hasMore?: boolean
  /** Infinite Scroll: Whether a new page/batch is actively being fetched. */
  isLoadingMore?: boolean
  /** Infinite Scroll: Callback invoked to fetch the next batch. */
  onLoadMore?: () => void
  /** Infinite Scroll: Trigger mode — "auto" (IntersectionObserver) or "button" (explicit click). Default: "auto" */
  infiniteTrigger?: "auto" | "button"
  /** Number of items currently loaded in the infinite stream (for progress display). */
  loadedCount?: number
  /** Custom message or node when all items have been loaded in infinite mode. */
  allLoadedMessage?: React.ReactNode
  /** Active grid columns count (used for display or grid-aware calculations). */
  columns?: number
  /** Optional label for the batch selector in infinite mode (e.g. "Items per batch"). */
  pageSizeLabel?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  showPageSize = true,
  showResultsCount = true,
  layout = "bar",

  // Infinite Scroll & Smart Extensions
  mode = "infinite",
  onModeChange: _onModeChange,
  showModeSwitch: _showModeSwitch,
  hasMore,
  isLoadingMore = false,
  onLoadMore,
  infiniteTrigger = "auto",
  loadedCount,
  allLoadedMessage,
  pageSizeLabel = "per page",
}: PaginationProps) {
  const effectivePageSize = pageSize || 10
  const safeCurrentPage = Math.max(1, Math.min(currentPage || 1, Math.max(1, totalPages || 1)))
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Smart fallback for hasMore and onLoadMore so any page using Pagination gets automatic infinite scroll
  const effectiveHasMore =
    hasMore !== undefined
      ? hasMore
      : totalItems !== undefined
      ? (loadedCount ?? safeCurrentPage * effectivePageSize) < totalItems
      : safeCurrentPage < totalPages

  const effectiveOnLoadMore =
    onLoadMore ||
    (() => {
      if (safeCurrentPage < totalPages) {
        onPageChange(safeCurrentPage + 1)
      }
    })

  // Ensure the current effectivePageSize is represented in dropdown options
  const computedPageSizeOptions = React.useMemo(() => {
    if (pageSizeOptions.includes(effectivePageSize)) {
      return pageSizeOptions
    }
    return Array.from(new Set([...pageSizeOptions, effectivePageSize])).sort((a, b) => a - b)
  }, [pageSizeOptions, effectivePageSize])

  // IntersectionObserver for auto infinite scroll
  useEffect(() => {
    if (mode !== "infinite" || infiniteTrigger !== "auto" || !effectiveHasMore || isLoadingMore || !effectiveOnLoadMore) {
      return
    }

    const sentinel = sentinelRef.current
    if (!sentinel) return

    let debounceTimer: any = null

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first?.isIntersecting && effectiveHasMore && !isLoadingMore) {
          if (debounceTimer) clearTimeout(debounceTimer)
          debounceTimer = setTimeout(() => {
            effectiveOnLoadMore()
          }, 100)
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 50px 0px",
        threshold: 0.1,
      }
    )

    observer.observe(sentinel)

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      observer.disconnect()
    }
  }, [mode, infiniteTrigger, effectiveHasMore, isLoadingMore, effectiveOnLoadMore])

  // If no pages exist or 0 items
  if (totalPages <= 0 && (!totalItems || totalItems === 0)) {
    return null
  }

  // =========================================================================
  // INFINITE SCROLL MODE RENDERER
  // =========================================================================
  if (mode === "infinite") {
    const currentLoaded = loadedCount ?? (safeCurrentPage * effectivePageSize)
    const displayLoaded = totalItems !== undefined ? Math.min(currentLoaded, totalItems) : currentLoaded
    const percentLoaded = totalItems && totalItems > 0 ? Math.min(100, Math.round((displayLoaded / totalItems) * 100)) : 100

    return (
      <div className={cn("w-full flex flex-col items-center gap-3 pt-6 pb-4 border-t border-border/60", className)}>
        {/* Progress & Results Count */}
        {showResultsCount && totalItems !== undefined && (
          <div className="flex flex-col items-center gap-1.5 w-full max-w-xs text-center">
            <div className="flex items-center justify-between w-full text-xs text-muted-foreground font-medium">
              <span>
                Showing <strong className="text-foreground">{displayLoaded}</strong> of{" "}
                <strong className="text-foreground">{totalItems}</strong> items
              </span>
              <span className="font-semibold text-primary">{percentLoaded}%</span>
            </div>
            {/* Subtle Progress Bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50 border border-border/40">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${percentLoaded}%` }}
              />
            </div>
          </div>
        )}

        {/* Load More Button or Auto Sentinel */}
        {effectiveHasMore ? (
          <div className="w-full flex flex-col items-center justify-center my-2">
            {infiniteTrigger === "button" ? (
              <button
                type="button"
                onClick={effectiveOnLoadMore}
                disabled={isLoadingMore}
                className="inline-flex h-9.5 px-5 items-center justify-center gap-2 rounded-xl border border-border/80 bg-card hover:bg-muted/70 text-xs sm:text-sm font-semibold text-foreground shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Loading more items...</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    <span>Load More ({effectivePageSize} items)</span>
                  </>
                )}
              </button>
            ) : (
              <>
                {/* Auto Sentinel for IntersectionObserver */}
                <div ref={sentinelRef} className="h-6 w-full pointer-events-none" aria-hidden="true" />
                {isLoadingMore && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-2xs backdrop-blur-md">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span>Fetching next batch...</span>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* All Items Loaded Badge */
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/20 px-3.5 py-1 text-xs font-medium text-muted-foreground">
            {allLoadedMessage ?? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>You've reached the end ({totalItems ?? displayLoaded} items total)</span>
              </>
            )}
          </div>
        )}

        {/* Batch Size Selector (Code-driven mode, no UI toggle) */}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
              <span>Batch size:</span>
              <div className="relative inline-flex items-center">
                <select
                  value={effectivePageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="h-7.5 appearance-none rounded-lg border border-border/70 bg-muted/40 hover:bg-muted/70 pl-2.5 pr-7 text-xs font-semibold text-foreground cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label="Items per batch"
                >
                  {computedPageSizeOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-popover text-popover-foreground">
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-muted-foreground" />
              </div>
            </div>
        )}
      </div>
    )
  }

  // =========================================================================
  // TRADITIONAL PAGINATION MODE RENDERER (100% Backward Compatible)
  // =========================================================================
  const startItem = totalItems !== undefined ? calculateStartItem(safeCurrentPage, effectivePageSize, totalItems) : null
  const endItem = totalItems !== undefined ? calculateEndItem(safeCurrentPage, effectivePageSize, totalItems) : null

  // Smart page windowing matching Figma design specification
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (safeCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages)
      } else if (safeCurrentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      } else {
        pages.push(
          1,
          "...",
          safeCurrentPage - 1,
          safeCurrentPage,
          safeCurrentPage + 1,
          "...",
          totalPages
        )
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()
  const canGoPrevious = safeCurrentPage > 1
  const canGoNext = safeCurrentPage < totalPages

  // Page buttons controls
  const buttonsNode = (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => canGoPrevious && onPageChange(safeCurrentPage - 1)}
        disabled={!canGoPrevious}
        className="flex h-9 min-w-9 px-3 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground hover:bg-muted/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Number and Ellipsis Buttons */}
      {pageNumbers.map((p, idx) => {
        if (p === "...") {
          return (
            <div
              key={`ellipsis-${idx}`}
              className="flex h-9 min-w-9 px-2 items-center justify-center rounded-xl border border-border/70 bg-card/60 text-muted-foreground text-xs sm:text-sm font-semibold select-none shadow-2xs"
            >
              ...
            </div>
          )
        }

        const isCurrent = safeCurrentPage === p

        return (
          <button
            key={`page-${p}`}
            type="button"
            onClick={() => onPageChange(p as number)}
            className={cn(
              "flex h-9 min-w-9 px-3 items-center justify-center rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer",
              isCurrent
                ? "bg-primary text-primary-foreground font-bold border border-primary shadow-xs"
                : "border border-border/70 bg-card text-foreground hover:bg-muted/70"
            )}
            aria-current={isCurrent ? "page" : undefined}
          >
            {p}
          </button>
        )
      })}

      {/* Next Button */}
      <button
        type="button"
        onClick={() => canGoNext && onPageChange(safeCurrentPage + 1)}
        disabled={!canGoNext}
        className="flex h-9 min-w-9 px-3 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground hover:bg-muted/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )

  // Results count label
  const resultsCountNode = showResultsCount ? (
    <div className="text-xs sm:text-sm font-medium text-muted-foreground">
      {totalItems !== undefined ? (
        <>
          Results:{" "}
          <span className="font-semibold text-foreground">
            {totalItems > 0 ? startItem : 0} - {endItem}
          </span>{" "}
          of <span className="font-semibold text-foreground">{totalItems}</span>
        </>
      ) : (
        <>
          Page <span className="font-semibold text-foreground">{safeCurrentPage}</span> of{" "}
          <span className="font-semibold text-foreground">{totalPages}</span>
        </>
      )}
    </div>
  ) : null

  // Page size dropdown selector
  const pageSizeNode =
    showPageSize && onPageSizeChange ? (
      <div className="relative inline-flex items-center">
        <select
          value={effectivePageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-9 appearance-none rounded-xl border border-border/70 bg-muted/40 hover:bg-muted/70 pl-3.5 pr-8 text-xs font-semibold text-foreground cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Items per page"
        >
          {computedPageSizeOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-popover text-popover-foreground">
              {opt} {pageSizeLabel}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-muted-foreground" />
      </div>
    ) : null

  // Controls group: Page Size only (Code-driven mode, no UI toggle)
  const controlsNode = pageSizeNode ? (
    <div className="flex items-center gap-2.5">
      {pageSizeNode}
    </div>
  ) : null

  // Stacked 2-row layout matching exact specification
  if (layout === "stacked") {
    return (
      <div className={cn("w-full flex flex-col items-center gap-3.5 pt-4 border-t border-border/60", className)}>
        {buttonsNode}
        <div className="w-full flex items-center justify-between gap-4">
          {resultsCountNode}
          {controlsNode}
        </div>
      </div>
    )
  }

  // Unified bar layout: Results on left, Buttons in center, Page Size / Controls on right (stacks on mobile)
  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row items-center justify-between gap-3.5 pt-4 border-t border-border/60",
        className
      )}
    >
      <div className="order-2 sm:order-1">{resultsCountNode}</div>
      <div className="order-1 sm:order-2">{buttonsNode}</div>
      <div className="order-3">{controlsNode}</div>
    </div>
  )
}

export default Pagination

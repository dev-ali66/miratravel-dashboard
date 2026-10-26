import React, { useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
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
        "inline-flex items-center rounded-md border border-border/70 bg-muted/40 p-0.5 text-xs font-semibold backdrop-blur shadow-sm",
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
  /**
   * Distance in pixels from the bottom to trigger background prefetching of the next batch.
   * Default: 500px as instructed by user.
   */
  prefetchDistance?: number
  /**
   * Enclosing scroll container Ref (e.g. in modals with inner overflow-y-auto).
   * If provided, listeners and intersection roots attach to this container instead of window.
   */
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  /** Whether the pagination bar is fixed at the bottom of the screen (default: false for table views, true for grid views). */
  fixed?: boolean
  /** Explicitly marks this pagination bar as sitting under a table view (disables viewport fixed positioning). */
  isTable?: boolean
  /** Explicitly marks this pagination bar as sitting under a grid view. */
  isGrid?: boolean
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
  fixed,
  isTable,
  isGrid,

  // Infinite Scroll & Smart Extensions
  mode = "infinite",
  onModeChange: _onModeChange,
  showModeSwitch: _showModeSwitch,
  hasMore,
  isLoadingMore = false,
  onLoadMore,
  infiniteTrigger = "auto",
  loadedCount,
  allLoadedMessage: _allLoadedMessage,
  pageSizeLabel = "per page",
  prefetchDistance = 500,
  scrollContainerRef,
  columns,
}: PaginationProps) {
  // Table views sit directly under the table without fixing to viewport bottom.
  // Grid views (with columns or isGrid) default to fixed bottom floating bar.
  const isTableView = isTable === true || isGrid === false
  const isGridView = isGrid === true || (columns !== undefined && columns > 0)

  const effectiveFixed =
    fixed !== undefined
      ? fixed
      : isTableView
        ? false
        : isGridView
          ? true
          : false

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

  // Defense-in-depth latch to prevent multiple triggers within a single intersection event
  const hasTriggeredRef = useRef<boolean>(false)
  const prevMaxScrollRef = useRef<number>(0)
  const lastTriggerScrollTopRef = useRef<number>(-1)
  const prevLoadedCountRef = useRef<number>(loadedCount ?? 0)
  const [internalLoading, setInternalLoading] = useState<boolean>(false)

  // Keep latest onLoadMore callback in a ref to keep effect listeners completely stable without recreating observers
  const onLoadMoreRef = useRef(effectiveOnLoadMore)
  useEffect(() => {
    onLoadMoreRef.current = effectiveOnLoadMore
  })

  // Reset the trigger latch only when loaded items count actually increases or loading completes
  useEffect(() => {
    const currentLoaded = loadedCount ?? 0
    if (currentLoaded > prevLoadedCountRef.current) {
      prevLoadedCountRef.current = currentLoaded
      hasTriggeredRef.current = false
      if (internalLoading) setInternalLoading(false)
    } else if (!isLoadingMore && internalLoading) {
      setInternalLoading(false)
    }
  }, [isLoadingMore, loadedCount, internalLoading])

  // Reset batch baseline when page resets to 1 or loaded count decreases
  useEffect(() => {
    if (safeCurrentPage === 1 || (loadedCount !== undefined && loadedCount <= effectivePageSize)) {
      prevMaxScrollRef.current = 0
      hasTriggeredRef.current = false
      lastTriggerScrollTopRef.current = -1
      prevLoadedCountRef.current = loadedCount ?? 0
    }
  }, [safeCurrentPage, loadedCount, effectivePageSize])

  // Distance-to-bottom scroll listener (triggers background load when 500px from the bottom)
  useEffect(() => {
    if (mode !== "infinite" || infiniteTrigger !== "auto" || !effectiveHasMore || isLoadingMore) {
      return
    }

    const sentinel = sentinelRef.current

    // Determine target scroll container: explicit scrollContainerRef, detected overflow-y ancestor, or window
    const targetElement = scrollContainerRef?.current
    let scrollParent: HTMLElement | Window = targetElement || window

    if (!targetElement && sentinel) {
      let parent: HTMLElement | null = sentinel.parentElement
      while (parent) {
        const style = window.getComputedStyle(parent)
        if (style.overflowY === "auto" || style.overflowY === "scroll") {
          scrollParent = parent
          break
        }
        parent = parent.parentElement
      }
    }

    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        ticking = false

        if (isLoadingMore || hasTriggeredRef.current || !effectiveHasMore || !onLoadMoreRef.current) {
          return
        }

        let scrollTop = 0
        let scrollHeight = 0
        let clientHeight = 0

        if (scrollParent instanceof HTMLElement) {
          scrollTop = scrollParent.scrollTop
          scrollHeight = scrollParent.scrollHeight
          clientHeight = scrollParent.clientHeight
        } else {
          scrollTop = window.scrollY || document.documentElement.scrollTop
          scrollHeight = document.documentElement.scrollHeight
          clientHeight = window.innerHeight
        }

        const maxScroll = Math.max(0, scrollHeight - clientHeight)
        if (maxScroll <= 0) return

        // NEVER auto-trigger on initial load before user scrolls!
        // Require actual user scrolling (scrollTop > 10px)
        if (scrollTop <= 10) return

        // Calculate distance remaining to reach the bottom of the container
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)

        // When user scrolls down and is within prefetchDistance (default: 500px) from the bottom:
        if (distanceFromBottom <= prefetchDistance) {
          if (lastTriggerScrollTopRef.current >= 0 && Math.abs(scrollTop - lastTriggerScrollTopRef.current) < 20) {
            return
          }
          hasTriggeredRef.current = true
          lastTriggerScrollTopRef.current = scrollTop
          prevMaxScrollRef.current = maxScroll
          setInternalLoading(true)
          onLoadMoreRef.current?.()
        }
      })
    }

    scrollParent.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      scrollParent.removeEventListener("scroll", handleScroll)
    }
  }, [mode, infiniteTrigger, effectiveHasMore, isLoadingMore, prefetchDistance, scrollContainerRef])

  // IntersectionObserver as secondary trigger for rapid jumps, strictly respecting scroll container and user scroll state
  useEffect(() => {
    if (mode !== "infinite" || infiniteTrigger !== "auto" || !effectiveHasMore || isLoadingMore) {
      return
    }

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const targetElement = scrollContainerRef?.current
    let scrollParent: HTMLElement | Window = targetElement || window

    if (!targetElement) {
      let parent: HTMLElement | null = sentinel.parentElement
      while (parent) {
        const style = window.getComputedStyle(parent)
        if (style.overflowY === "auto" || style.overflowY === "scroll") {
          scrollParent = parent
          break
        }
        parent = parent.parentElement
      }
    }

    let debounceTimer: any = null

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]

        // Check if user has actually scrolled down to avoid false positives on mount
        const isScrolled =
          scrollParent instanceof HTMLElement
            ? scrollParent.scrollTop > 10
            : (window.scrollY || document.documentElement.scrollTop) > 10

        if (first?.isIntersecting) {
          if (isScrolled && effectiveHasMore && !isLoadingMore && !hasTriggeredRef.current && onLoadMoreRef.current) {
            hasTriggeredRef.current = true
            lastTriggerScrollTopRef.current =
              scrollParent instanceof HTMLElement ? scrollParent.scrollTop : window.scrollY || 0
            if (debounceTimer) clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
              setInternalLoading(true)
              onLoadMoreRef.current?.()
            }, 150)
          }
        } else {
          // When sentinel exits viewport, reset latch so user scrolling back down can trigger next batch
          hasTriggeredRef.current = false
        }
      },
      {
        root: scrollParent instanceof HTMLElement ? scrollParent : null,
        rootMargin: "0px 0px 300px 0px",
        threshold: 0.1,
      }
    )

    observer.observe(sentinel)

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      observer.disconnect()
    }
  }, [mode, infiniteTrigger, effectiveHasMore, isLoadingMore, scrollContainerRef])

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
    const isFetchingData = Boolean(isLoadingMore || internalLoading)

    return (
      <>
        {/* Invisible in-flow sentinel to trigger infinite scroll accurately without false positives */}
        <div ref={sentinelRef} className="h-px w-full pointer-events-none opacity-0 !m-0 !p-0" aria-hidden="true" />

        <div
          className={cn(
            effectiveFixed
              ? "fixed bottom-0 left-0 md:left-[280px] right-0 z-30 border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-1.5 sm:py-2 flex items-center justify-center"
              : "w-full py-2.5 px-3 sm:px-4 rounded-md border border-border/60 bg-card/60 backdrop-blur-sm shadow-2xs mt-2.5 flex flex-col sm:flex-row items-center justify-between gap-3",
            "transition-all duration-200",
            className
          )}
        >
          {effectiveFixed ? (
            /* Floating Grid Bar: Centered 1/5th compact width */
            showResultsCount ? (
              <div className="flex flex-col gap-1 w-full max-w-[280px] sm:w-1/5 sm:min-w-[220px] mx-auto">
                <div className="flex items-center justify-between w-full text-[11px] font-medium leading-tight">
                  <span className="text-muted-foreground whitespace-nowrap">
                    Showing <strong className="text-foreground font-semibold">{displayLoaded}</strong>
                    {totalItems !== undefined && (
                      <> of <strong className="text-foreground font-semibold">{totalItems}</strong></>
                    )}{" "}
                    items
                  </span>

                  {isFetchingData ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary animate-pulse whitespace-nowrap">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      <span>Loading...</span>
                    </span>
                  ) : (
                    <span className="font-semibold text-[11px] text-primary whitespace-nowrap">
                      {percentLoaded}%
                    </span>
                  )}
                </div>

                <div className="h-1 w-full overflow-hidden rounded-full bg-muted/60 border border-border/40">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${percentLoaded}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="shrink-0" />
            )
          ) : (
            /* Table In-Flow Bar: Clean 3-section layout (Count on left, Progress in center, Page Size on right) */
            <>
              {/* Left: Dynamic Results Count */}
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground whitespace-nowrap shrink-0">
                <span>
                  Showing <strong className="text-foreground font-semibold">{displayLoaded}</strong>
                  {totalItems !== undefined && (
                    <> of <strong className="text-foreground font-semibold">{totalItems}</strong></>
                  )}{" "}
                  items
                </span>
                {isFetchingData && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary animate-pulse ml-1">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span>Loading...</span>
                  </span>
                )}
              </div>

              {/* Center: Progress Bar & Percentage */}
              <div className="flex items-center gap-2.5 w-full max-w-[220px] sm:max-w-[260px] shrink-0">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60 border border-border/40">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${percentLoaded}%` }}
                  />
                </div>
                <span className="font-semibold text-[11px] text-primary whitespace-nowrap shrink-0">
                  {percentLoaded}%
                </span>
              </div>

              {/* Right: Page Size Selector or Load More button */}
              <div className="flex items-center gap-2 shrink-0">
                {infiniteTrigger === "button" && (totalItems === undefined || displayLoaded < totalItems) && (
                  <button
                    type="button"
                    onClick={() => {
                      setInternalLoading(true)
                      effectiveOnLoadMore()
                    }}
                    disabled={isFetchingData}
                    className="inline-flex h-7.5 px-3 items-center justify-center gap-1.5 rounded-md border border-border/80 bg-card hover:bg-muted/70 text-xs font-semibold text-foreground shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isFetchingData ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="h-3 w-3 text-primary" />
                        <span>Load More</span>
                      </>
                    )}
                  </button>
                )}

                {showPageSize && onPageSizeChange && (
                  <div className="relative inline-flex items-center">
                    <select
                      value={effectivePageSize}
                      onChange={(e) => onPageSizeChange(Number(e.target.value))}
                      className="h-7.5 appearance-none rounded-md border border-border/70 bg-muted/40 hover:bg-muted/70 pl-2.5 pr-7 text-xs font-semibold text-foreground cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                      aria-label="Items per page"
                    >
                      {computedPageSizeOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-popover text-popover-foreground">
                          {opt} {pageSizeLabel}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Optional Load More button for floating mode */}
          {effectiveFixed && infiniteTrigger === "button" && (totalItems === undefined || displayLoaded < totalItems) && (
            <div className="ml-4 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setInternalLoading(true)
                  effectiveOnLoadMore()
                }}
                disabled={isFetchingData}
                className="inline-flex h-8 px-3.5 items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted/70 text-xs font-semibold text-foreground shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isFetchingData ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    <span>Load More ({effectivePageSize})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </>
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
        className="flex h-9 min-w-9 px-3 items-center justify-center rounded-md border border-border/70 bg-card text-foreground hover:bg-muted/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
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
              className="flex h-9 min-w-9 px-2 items-center justify-center rounded-md border border-border/70 bg-card/60 text-muted-foreground text-xs sm:text-sm font-semibold select-none shadow-2xs"
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
              "flex h-9 min-w-9 px-3 items-center justify-center rounded-md text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer",
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
        className="flex h-9 min-w-9 px-3 items-center justify-center rounded-md border border-border/70 bg-card text-foreground hover:bg-muted/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
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
          className="h-9 appearance-none rounded-md border border-border/70 bg-muted/40 hover:bg-muted/70 pl-3.5 pr-8 text-xs font-semibold text-foreground cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
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
  if (layout === "stacked" && !effectiveFixed) {
    return (
      <div className={cn("w-full flex flex-col items-center gap-3.5 pt-4 border-border/60", className)}>
        {buttonsNode}
        <div className="w-full flex items-center justify-between gap-4">
          {resultsCountNode}
          {controlsNode}
        </div>
      </div>
    )
  }

  // Unified bar layout: Results on left, Buttons in center, Page Size / Controls on right
  return (
    <div
      className={cn(
        effectiveFixed
          ? "fixed bottom-0 left-0 md:left-[280px] right-0 z-30 border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 py-2 sm:py-2.5"
          : "w-full py-2.5 px-3 sm:px-4 rounded-md border border-border/60 bg-card/60 backdrop-blur-sm shadow-2xs mt-2.5",
        "flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-200",
        className
      )}
    >
      <div className="order-2 sm:order-1 shrink-0">{resultsCountNode}</div>
      <div className="order-1 sm:order-2 flex items-center justify-center min-w-0">{buttonsNode}</div>
      <div className="order-3 shrink-0">{controlsNode}</div>
    </div>
  )
}

export default Pagination

import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  className?: string
  showPageSize?: boolean
  showResultsCount?: boolean
  layout?: "bar" | "stacked"
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
}: PaginationProps) {
  // If no pages exist or 0 items
  if (totalPages <= 0 && (!totalItems || totalItems === 0)) {
    return null
  }

  const effectivePageSize = pageSize || 10
  const safeCurrentPage = Math.max(1, Math.min(currentPage || 1, Math.max(1, totalPages)))
  const startItem = totalItems !== undefined ? (totalItems === 0 ? 0 : (safeCurrentPage - 1) * effectivePageSize + 1) : null
  const endItem = totalItems !== undefined ? Math.min(safeCurrentPage * effectivePageSize, totalItems) : null

  // Smart page windowing matching the design specification
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

  // Page buttons controls matching Figma design
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
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-popover text-popover-foreground">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-muted-foreground" />
      </div>
    ) : null

  // Stacked 2-row layout matching exact screenshot
  if (layout === "stacked") {
    return (
      <div className={cn("w-full flex flex-col items-center gap-3.5 pt-4 border-t border-border/60", className)}>
        {buttonsNode}
        <div className="w-full flex items-center justify-between gap-4">
          {resultsCountNode}
          {pageSizeNode}
        </div>
      </div>
    )
  }

  // Unified bar layout: Results on left, Buttons in center, Page Size on right (stacks on mobile)
  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row items-center justify-between gap-3.5 pt-4 border-t border-border/60",
        className
      )}
    >
      <div className="order-2 sm:order-1">{resultsCountNode}</div>
      <div className="order-1 sm:order-2">{buttonsNode}</div>
      <div className="order-3">{pageSizeNode}</div>
    </div>
  )
}

export default Pagination

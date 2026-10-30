import { useState, useCallback, useMemo, useEffect, useRef, type RefObject } from "react"
import { useGridColumns, DEFAULT_DASHBOARD_COLUMNS, type ResponsiveColumnsConfig } from "./useGridColumns"
import { calculateGridLimit } from "@/lib/paginationUtils"

export interface UseListingPaginationOptions<T = any> {
  /** Mode: "pages" for traditional numbered pagination, "infinite" for scroll stream. Default: "pages" */
  mode?: "pages" | "infinite"
  /** Initial mode fallback (alias for mode). Default: "pages" */
  initialMode?: "pages" | "infinite"
  /** Target number of items user wants to see per page / batch. Default: 18 */
  initialTargetItems?: number
  /** Whether the target view is a grid (enables gridLimit rounding). Default: true */
  isGrid?: boolean
  /** Custom grid column configuration for responsive breakpoints */
  columnsConfig?: ResponsiveColumnsConfig
  /** Alias for columnsConfig */
  gridColumns?: ResponsiveColumnsConfig
  /** Optional Ref to attach to the grid element for dynamic column observation */
  gridRef?: RefObject<HTMLDivElement | null>
  /** Whether a query request is actively fetching in the background */
  isFetching?: boolean
  /** Array of incoming data items from current query response (for infinite accumulation) */
  incomingItems?: T[]
  /** Total count of items available on server from query response meta */
  totalItems?: number
  /** Unique key extractor for deduplication (default: item.id) */
  keyExtractor?: (item: T) => string | number
  /** Key that invalidates infinite accumulated data when changed (e.g. JSON string of active search/filters) */
  filterKey?: string
}

const DEFAULT_KEY_EXTRACTOR = (item: any) => item?.id ?? item?._id
const EMPTY_ITEMS: any[] = []

export function useListingPagination<T = any>({
  mode: codeMode,
  initialMode = "infinite",
  initialTargetItems = 18,
  isGrid = true,
  columnsConfig,
  gridColumns,
  gridRef,
  isFetching,
  incomingItems = EMPTY_ITEMS,
  totalItems,
  keyExtractor = DEFAULT_KEY_EXTRACTOR,
  filterKey = "",
}: UseListingPaginationOptions<T> = {}) {
  const rawConfig = gridColumns || columnsConfig
  const effectiveColumnsConfig = useMemo(() => {
    return rawConfig || DEFAULT_DASHBOARD_COLUMNS
  }, [
    rawConfig?.base,
    rawConfig?.sm,
    rawConfig?.md,
    rawConfig?.lg,
    rawConfig?.lgx,
    rawConfig?.xlg,
    rawConfig?.mid,
    rawConfig?.xl,
    rawConfig?.["2xl"],
  ])

  const keyExtractorRef = useRef(keyExtractor)
  keyExtractorRef.current = keyExtractor

  const internalGridRef = useRef<HTMLDivElement | null>(null)
  const effectiveGridRef = gridRef || internalGridRef

  const resolvedMode = codeMode || initialMode || "infinite"
  const [mode, setMode] = useState<"pages" | "infinite">(resolvedMode)

  // Sync mode if code prop changes
  useEffect(() => {
    if (codeMode && codeMode !== mode) {
      setMode(codeMode)
    }
  }, [codeMode, mode])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [targetItems, setTargetItems] = useState<number>(initialTargetItems)
  const [accumulatedItems, setAccumulatedItems] = useState<T[]>([])

  // Strict loading lock to prevent concurrent page fetch race conditions
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const isFetchingMoreRef = useRef<boolean>(false)

  // Internal incoming items state when synced via setIncomingData
  const [syncedIncomingItems, setSyncedIncomingItems] = useState<T[]>(incomingItems)
  const [syncedTotalItems, setSyncedTotalItems] = useState<number | undefined>(totalItems)

  // Determine active incoming and total items
  const activeIncomingItems = incomingItems.length > 0 ? incomingItems : syncedIncomingItems
  const activeTotalItems = totalItems !== undefined ? totalItems : syncedTotalItems

  // Stable callback to sync data from TanStack Query response
  const setIncomingData = useCallback((items?: T[], total?: number) => {
    if (items !== undefined) {
      setSyncedIncomingItems(items)
      isFetchingMoreRef.current = false
      setIsLoadingMore(false)
    }
    if (total !== undefined) {
      setSyncedTotalItems(total)
    }
  }, [])

  // Responsive columns tracking with layout ground-truth containerRef
  const columns = useGridColumns(effectiveColumnsConfig, effectiveGridRef)

  // Calculate dynamic page size options matching exact multiples of the active column count
  const pageSizeOptions = useMemo(() => {
    if (!isGrid || columns <= 1) {
      return [10, 20, 30, 50, 100]
    }
    // Generates complete rows: e.g. for 5 cols: [15, 20, 30, 40, 50]
    // For 6 cols: [18, 24, 36, 48, 60]
    const rowMultiples = [3, 4, 6, 8, 10]
    return Array.from(new Set(rowMultiples.map((r) => r * columns))).sort((a, b) => a - b)
  }, [isGrid, columns])

  // Calculate effective request limit
  const effectiveLimit = useMemo(() => {
    if (!isGrid) return targetItems
    return calculateGridLimit(targetItems, columns)
  }, [isGrid, targetItems, columns])

  // Track previous filterKey to reset pagination on query changes
  const prevFilterKeyRef = useRef<string>(filterKey)
  useEffect(() => {
    if (prevFilterKeyRef.current !== filterKey) {
      prevFilterKeyRef.current = filterKey
      setCurrentPage(1)
      setAccumulatedItems([])
    }
  }, [filterKey])

  // Accumulate items for infinite scroll
  useEffect(() => {
    if (mode !== "infinite") return
    if (!activeIncomingItems || activeIncomingItems.length === 0) {
      if (currentPage === 1) {
        setAccumulatedItems([])
      }
      return
    }

    setAccumulatedItems((prev) => {
      if (currentPage === 1) {
        return prev === activeIncomingItems ? prev : activeIncomingItems
      }

      // Deduplicate using keyExtractorRef to avoid render loop on inline functions
      const extractor = keyExtractorRef.current
      const existingKeys = new Set(prev.map(extractor))
      const newUnique = activeIncomingItems.filter((item) => !existingKeys.has(extractor(item)))

      if (newUnique.length === 0) return prev
      return [...prev, ...newUnique]
    })
  }, [activeIncomingItems, currentPage, mode])

  // Reset function
  const reset = useCallback(() => {
    setCurrentPage(1)
    setAccumulatedItems([])
  }, [])

  // Page change handler
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(Math.max(1, newPage))
  }, [])

  // Page size / target change handler
  const handlePageSizeChange = useCallback((newSize: number) => {
    setTargetItems(Math.max(1, newSize))
    setCurrentPage(1)
    setAccumulatedItems([])
  }, [])

  // Load more handler for infinite scroll with strict concurrency guard
  const handleLoadMore = useCallback(() => {
    // Block multiple simultaneous page requests
    if (isFetchingMoreRef.current || (isFetching && currentPage > 1)) {
      return
    }
    if (typeof activeTotalItems === "number" && accumulatedItems.length >= activeTotalItems) {
      return
    }
    isFetchingMoreRef.current = true
    setIsLoadingMore(true)
    setCurrentPage((prev) => prev + 1)
  }, [isFetching, currentPage, activeTotalItems, accumulatedItems.length])

  // Whether there are more items to load in infinite mode
  const hasMore = useMemo(() => {
    if (typeof activeTotalItems !== "number") return true
    if (activeTotalItems <= 0) return false
    return accumulatedItems.length < activeTotalItems
  }, [activeTotalItems, accumulatedItems.length])

  // Mode change handler: cleanly resets page and accumulation when entering infinite mode
  const handleModeChange = useCallback((newMode: "pages" | "infinite") => {
    setMode((prev) => {
      if (prev === newMode) return prev
      if (newMode === "infinite") {
        setCurrentPage(1)
        setAccumulatedItems([])
      }
      return newMode
    })
  }, [])

  // Currently displayed items based on active mode
  const displayItems = useMemo(() => {
    return mode === "infinite" ? accumulatedItems : (activeIncomingItems || [])
  }, [mode, accumulatedItems, activeIncomingItems])

  const effectiveIsLoadingMore = isLoadingMore || Boolean(isFetching && currentPage > 1)

  return {
    mode,
    setMode: handleModeChange,
    currentPage,
    setCurrentPage: handlePageChange,
    targetItems,
    setTargetItems: handlePageSizeChange,
    columns,
    effectiveLimit,
    pageSizeOptions,
    gridRef: effectiveGridRef,
    accumulatedItems,
    displayItems,
    hasMore,
    isLoadingMore: effectiveIsLoadingMore,
    handleLoadMore,
    setIncomingData,
    totalItems: activeTotalItems,
    reset,
  }
}


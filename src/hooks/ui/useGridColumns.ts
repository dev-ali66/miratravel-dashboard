import { useState, useEffect, useCallback, useMemo, type RefObject } from "react"

export interface ResponsiveColumnsConfig {
  base?: number  // < 48rem (768px) (Default: 1)
  sm?: number    // >= 40rem (640px)
  md?: number    // >= 48rem (768px) (Default: 3)
  lg?: number    // >= 66rem (1056px) (Default: 5)
  lgx?: number   // >= 74rem (1184px)
  xlg?: number   // >= 80rem (1280px)
  mid?: number   // >= 90rem (1440px)
  xl?: number    // >= 105rem (1680px) (Default: 6)
  "2xl"?: number // >= 120rem (1920px) (Default: 6)
}

/**
 * Standard MIRA Dashboard card grid breakpoints:
 * grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6
 * Matching index.css @theme definitions:
 * - md: 48rem (768px)
 * - lg: 66rem (1056px)
 * - xl: 105rem (1680px)
 */
export const DEFAULT_DASHBOARD_COLUMNS: ResponsiveColumnsConfig = {
  base: 1,
  md: 3,
  lg: 5,
  xl: 6,
  "2xl": 6,
}

interface BreakpointQueryDef {
  key: keyof ResponsiveColumnsConfig
  query: string
  pxFallback: number
}

// Ordered strictly from widest to narrowest
const DASHBOARD_BREAKPOINT_QUERIES: BreakpointQueryDef[] = [
  { key: "2xl", query: "(min-width: 120rem)", pxFallback: 1920 },
  { key: "xl",  query: "(min-width: 105rem)", pxFallback: 1680 },
  { key: "mid", query: "(min-width: 90rem)",  pxFallback: 1440 },
  { key: "xlg", query: "(min-width: 80rem)",  pxFallback: 1280 },
  { key: "lgx", query: "(min-width: 74rem)",  pxFallback: 1184 },
  { key: "lg",  query: "(min-width: 66rem)",  pxFallback: 1056 },
  { key: "md",  query: "(min-width: 48rem)",  pxFallback: 768 },
  { key: "sm",  query: "(min-width: 40rem)",  pxFallback: 640 },
]

/**
 * Reads the actual computed number of columns from a rendered grid DOM element.
 * Resolves computed track sizes like "240px 240px 240px 240px 240px" -> 5 columns.
 */
export function getDomGridColumns(el: HTMLElement | null): number | null {
  if (!el || typeof window === "undefined") return null
  try {
    const style = window.getComputedStyle(el)
    const display = style.display
    if (display !== "grid" && display !== "inline-grid") {
      return null
    }
    const templateColumns = style.gridTemplateColumns
    if (!templateColumns || templateColumns === "none") {
      return null
    }
    const trackCount = templateColumns.trim().split(/\s+/).filter(Boolean).length
    return trackCount > 0 ? trackCount : null
  } catch {
    return null
  }
}

/**
 * Hook to dynamically track the active number of columns in a responsive CSS grid.
 *
 * Accuracy Hierarchy:
 * 1. DOM computed style from containerRef (if provided and mounted) -> 100% layout truth.
 * 2. window.matchMedia queries aligned with index.css @theme breakpoints.
 * 3. Fallback to base configuration.
 */
export function useGridColumns(
  config: ResponsiveColumnsConfig = DEFAULT_DASHBOARD_COLUMNS,
  containerRef?: RefObject<HTMLElement | null>
): number {
  const {
    base,
    sm,
    md,
    lg,
    lgx,
    xlg,
    mid,
    xl,
    "2xl": col2xl,
  } = config

  const memoizedConfig = useMemo<ResponsiveColumnsConfig>(() => ({
    base,
    sm,
    md,
    lg,
    lgx,
    xlg,
    mid,
    xl,
    "2xl": col2xl,
  }), [base, sm, md, lg, lgx, xlg, mid, xl, col2xl])

  const getActiveColumns = useCallback((): number => {
    if (typeof window === "undefined") {
      return memoizedConfig.xl ?? memoizedConfig.lg ?? memoizedConfig.md ?? memoizedConfig.base ?? 6
    }

    // 1. Direct layout ground truth if container element is mounted
    if (containerRef?.current) {
      const domCols = getDomGridColumns(containerRef.current)
      if (domCols !== null && domCols > 0) {
        return domCols
      }
    }

    // 2. CSS Breakpoint matching with exact index.css definitions
    for (const { key, query, pxFallback } of DASHBOARD_BREAKPOINT_QUERIES) {
      if (memoizedConfig[key] !== undefined) {
        if (typeof window.matchMedia === "function") {
          if (window.matchMedia(query).matches) {
            return memoizedConfig[key]!
          }
        } else if (window.innerWidth >= pxFallback) {
          return memoizedConfig[key]!
        }
      }
    }

    return memoizedConfig.base ?? 1
  }, [memoizedConfig, containerRef])

  const [columns, setColumns] = useState<number>(getActiveColumns)

  useEffect(() => {
    // Initial sync with functional equality check to prevent infinite re-renders
    setColumns((prev) => {
      const next = getActiveColumns()
      return prev !== next ? next : prev
    })

    const handleUpdate = () => {
      setColumns((prev) => {
        const next = getActiveColumns()
        return prev !== next ? next : prev
      })
    }

    // Window resize & orientation change listeners
    window.addEventListener("resize", handleUpdate, { passive: true })
    window.addEventListener("orientationchange", handleUpdate, { passive: true })

    // MatchMedia listeners for instant breakpoint transitions
    const mediaQueryLists: Array<{ mql: MediaQueryList; listener: () => void }> = []
    if (typeof window.matchMedia === "function") {
      for (const { query } of DASHBOARD_BREAKPOINT_QUERIES) {
        try {
          const mql = window.matchMedia(query)
          const listener = () => handleUpdate()
          if (mql?.addEventListener) {
            mql.addEventListener("change", listener)
            mediaQueryLists.push({ mql, listener })
          }
        } catch {
          // ignore matchMedia error on older environments
        }
      }
    }

    // DOM ResizeObserver for container element (e.g. sidebar toggle or layout reflow)
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined" && containerRef?.current) {
      resizeObserver = new ResizeObserver(() => {
        handleUpdate()
      })
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener("resize", handleUpdate)
      window.removeEventListener("orientationchange", handleUpdate)
      mediaQueryLists.forEach(({ mql, listener }) => {
        mql.removeEventListener("change", listener)
      })
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [getActiveColumns, containerRef])

  return columns
}

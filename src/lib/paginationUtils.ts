/**
 * Utility functions for grid-aware dynamic limit calculation and pagination mathematics.
 * Formula: gridLimit = Math.ceil(targetItems / columns) * columns
 */

/**
 * Calculates the aligned grid limit so that every row in a responsive grid is completely filled.
 *
 * @param targetItems Desired number of items (user's target selection, e.g. 15, 30, 50)
 * @param columns Number of columns in the current breakpoint (e.g. 1, 2, 3, 4, 5, 6). If <= 1, returns targetItems.
 * @returns Aligned integer limit (e.g., target 15 with 6 cols -> 18)
 */
export function calculateGridLimit(targetItems: number, columns: number = 1): number {
  const safeTarget = Math.max(1, Number(targetItems) || 1)
  const safeCols = Math.max(1, Math.floor(Number(columns) || 1))

  if (safeCols <= 1) {
    return safeTarget
  }

  return Math.ceil(safeTarget / safeCols) * safeCols
}

/**
 * Total-aware grid limit calculation.
 * If totalItems is known and greater than 0, ensures the limit does not exceed totalItems
 * while still maintaining grid-alignment where appropriate.
 *
 * NOTE: In offset-based pagination (skip = (page - 1) * limit), the limit must remain constant
 * across pages in the same query session. The backend database driver (Prisma take: limit)
 * naturally returns the remaining items on the final page.
 */
export function calculateEffectiveLimit(
  targetItems: number,
  columns: number = 1,
  totalItems?: number,
  isFirstPageOnly: boolean = false
): number {
  const gridLimit = calculateGridLimit(targetItems, columns)

  if (isFirstPageOnly && typeof totalItems === "number" && totalItems > 0 && totalItems < gridLimit) {
    return totalItems
  }

  return gridLimit
}

/**
 * Safely calculates the starting item index (1-indexed) for current page display.
 */
export function calculateStartItem(
  currentPage: number,
  effectivePageSize: number,
  totalItems?: number
): number {
  if (totalItems !== undefined && totalItems <= 0) return 0
  const safePage = Math.max(1, currentPage)
  const safeSize = Math.max(1, effectivePageSize)
  return (safePage - 1) * safeSize + 1
}

/**
 * Safely calculates the ending item index (1-indexed) for current page display.
 */
export function calculateEndItem(
  currentPage: number,
  effectivePageSize: number,
  totalItems?: number
): number {
  const safePage = Math.max(1, currentPage)
  const safeSize = Math.max(1, effectivePageSize)
  const calculatedEnd = safePage * safeSize

  if (typeof totalItems === "number" && totalItems >= 0) {
    return Math.min(calculatedEnd, totalItems)
  }

  return calculatedEnd
}

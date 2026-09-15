/* =====================================================
   LOCATION — DEEP MERGE WITH DEFAULTS
   Ensures a partial/incomplete API record never crashes the
   Form or Preview: any missing nested field falls back to
   emptyLocation's shape.
===================================================== */

export function mergeWithDefaults<T>(
  defaults: T,
  incoming: Partial<T> | null | undefined
): T {
  if (incoming === null || incoming === undefined) {
    return structuredClone(defaults)
  }

  if (Array.isArray(defaults)) {
    return (
      Array.isArray(incoming)
        ? structuredClone(incoming)
        : structuredClone(defaults)
    ) as T
  }

  if (
    typeof defaults === "object" &&
    defaults !== null &&
    typeof incoming === "object" &&
    incoming !== null
  ) {
    const result: Record<string, unknown> = structuredClone(
      defaults as Record<string, unknown>
    )

    for (const [key, value] of Object.entries(
      incoming as Record<string, unknown>
    )) {
      const defaultValue = result[key]

      if (
        defaultValue &&
        typeof defaultValue === "object" &&
        !Array.isArray(defaultValue) &&
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        result[key] = mergeWithDefaults(defaultValue, value)
      } else if (value !== undefined && value !== null) {
        result[key] = structuredClone(value)
      } else if (value === null && defaultValue === undefined) {
        result[key] = null
      }
    }

    return result as T
  }

  return structuredClone(incoming as T)
}

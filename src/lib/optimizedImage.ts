/**
 * ============================================================================
 * DASHBOARD OPTIMIZED IMAGE UTILITY
 * ============================================================================
 * Powers all image rendering across the dashboard with on-the-fly Sharp
 * optimization and Cloudflare Edge CDN caching.
 *
 * Rules:
 * - w = parent container rendered width (e.g., 80, 320, 400, 540, 1200)
 * - h = auto (omitted so aspect ratio is naturally preserved by backend)
 * - q = 100 (crisp high-fidelity delivery per specification)
 * - fmt = webp (lightweight modern web delivery)
 */

export const DASHBOARD_IMAGE_WIDTHS = {
  // Micro thumbnails & avatars
  NAVBAR_AVATAR: 80,
  NAVBAR_LOGO: 320,
  TABLE_THUMBNAIL: 80,
  STORY_PICKER_THUMBNAIL: 72,
  LOCATION_PICKER_THUMBNAIL: 72,
  REQUEST_AVATAR: 80,
  PROFILE_AVATAR: 160,

  // Grid cards & pickers
  MEDIA_PICKER_CARD: 320,
  MEDIA_GRID_CARD: 400,
  MEDIA_TRASH_CARD: 400,
  ADDON_THUMBNAIL: 120,
  MAP_POPUP: 280,
  SUBMODULE_THUMBNAIL: 160,

  // Form field previews & drawers
  FORM_PREVIEW: 600,
  INSPECTOR_PREVIEW: 800,
  RICHTEXT_INSERT: 1200,

  // Index card banners (/journeys, /locations, /experiences, /stories)
  LIST_CARD_BANNER: 540,

  // Live split-screen preview panes
  LIVE_PREVIEW_PANE: 1200,
} as const

export interface OptimizedImageOptions {
  /** Target width in pixels matching parent container width */
  width?: number
  /** Optional target height. If omitted, height scales automatically to preserve natural aspect ratio */
  height?: number
  /** Quality percentage (10 to 100). Default is 100 per system specification */
  quality?: number
  /** Modern image format. Default is webp */
  format?: "webp" | "avif" | "jpeg" | "png"
  /** Fit mode when both width and height are provided */
  fit?: "cover" | "contain" | "fill" | "inside" | "outside"
}

/**
 * Appends on-the-fly optimization query parameters to an image URL.
 * Automatically skips SVG files, data URLs, video formats, or empty strings.
 */
export function getOptimizedImageUrl(
  url?: string | null,
  options?: OptimizedImageOptions
): string {
  if (!url || typeof url !== "string") return ""

  const cleanUrl = url.trim()
  if (!cleanUrl) return ""

  // Skip SVGs, data URIs, videos, or external icon badges
  const lower = cleanUrl.toLowerCase()
  if (
    lower.startsWith("data:") ||
    lower.startsWith("blob:") ||
    lower.endsWith(".svg") ||
    lower.includes(".svg?") ||
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".mov")
  ) {
    return cleanUrl
  }

  const { width, height, quality = 100, format = "webp", fit } = options || {}

  // Parse existing URL or query string
  try {
    // If it's a relative path (/uploads/...) or absolute URL
    const isAbsolute = cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")
    const dummyBase = "https://local.dummy"
    const parsed = new URL(cleanUrl, isAbsolute ? undefined : dummyBase)

    // Set params
    if (width && width > 0) {
      parsed.searchParams.set("w", String(Math.round(width)))
    }
    if (height && height > 0) {
      parsed.searchParams.set("h", String(Math.round(height)))
    }
    parsed.searchParams.set("q", String(Math.max(10, Math.min(100, quality))))
    parsed.searchParams.set("fmt", format)

    if (fit) {
      parsed.searchParams.set("fit", fit)
    }

    if (isAbsolute) {
      return parsed.toString()
    } else {
      // Relative path: preserve pathname + search + hash
      return `${parsed.pathname}${parsed.search}${parsed.hash}`
    }
  } catch {
    // Fallback simple query append if URL parsing fails
    const separator = cleanUrl.includes("?") ? "&" : "?"
    const params: string[] = []
    if (width) params.push(`w=${width}`)
    if (height) params.push(`h=${height}`)
    params.push(`q=${quality}`)
    params.push(`fmt=${format}`)
    if (fit) params.push(`fit=${fit}`)
    return `${cleanUrl}${separator}${params.join("&")}`
  }
}

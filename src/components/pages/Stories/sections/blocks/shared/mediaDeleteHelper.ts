import { removeFiles } from "@/services/fileUpload"

/**
 * Recursively extracts all image and video file URLs from a block or multimedia item object.
 */
export function extractMediaUrls(data: any): string[] {
  if (!data || typeof data !== "object") return []
  const urls = new Set<string>()

  const checkAndAdd = (val: any) => {
    if (typeof val === "string" && val.trim().length > 0) {
      const trimmed = val.trim()
      // Only include actual uploaded file URLs (http/https or relative upload paths)
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
        urls.add(trimmed)
      }
    }
  }

  // Direct url property
  if (data.url) checkAndAdd(data.url)

  // Image config or string
  if (data.image) {
    if (typeof data.image === "string") checkAndAdd(data.image)
    else if (data.image?.url) checkAndAdd(data.image.url)
  }

  // Video config or string
  if (data.video) {
    if (typeof data.video === "string") checkAndAdd(data.video)
    else if (data.video?.url) checkAndAdd(data.video.url)
  }

  // Nested multimedia object
  if (data.multimedia) {
    if (typeof data.multimedia === "string") checkAndAdd(data.multimedia)
    else {
      if (data.multimedia.url) checkAndAdd(data.multimedia.url)
      if (data.multimedia.image) {
        if (typeof data.multimedia.image === "string") checkAndAdd(data.multimedia.image)
        else if (data.multimedia.image?.url) checkAndAdd(data.multimedia.image.url)
      }
      if (data.multimedia.video) {
        if (typeof data.multimedia.video === "string") checkAndAdd(data.multimedia.video)
        else if (data.multimedia.video?.url) checkAndAdd(data.multimedia.video.url)
      }
    }
  }

  // Array of items (e.g. block.items)
  if (Array.isArray(data.items)) {
    for (const item of data.items) {
      const itemUrls = extractMediaUrls(item)
      for (const u of itemUrls) {
        urls.add(u)
      }
    }
  }

  return Array.from(urls)
}

/**
 * Removes media files from backend storage via removeFiles endpoint.
 */
export async function deleteMediaFiles(target: string[] | any): Promise<void> {
  const urls = Array.isArray(target) && (target.length === 0 || typeof target[0] === "string")
    ? (target as string[])
    : extractMediaUrls(target)

  if (urls.length > 0) {
    try {
      await removeFiles(urls)
    } catch (err) {
      console.error("Failed to remove media files from server:", err)
    }
  }
}

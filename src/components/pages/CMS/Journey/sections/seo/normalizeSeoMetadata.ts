import { emptySeoMetadata } from "./emptySeoMetadata"

export function normalizeSeoMetadata(rawSec: any): typeof emptySeoMetadata {
  if (!rawSec || typeof rawSec !== "object") return emptySeoMetadata

  const src = rawSec.seo || rawSec.metadata || rawSec.content || rawSec

  let keywords: string[] = []
  if (Array.isArray(src.keywords)) {
    keywords = src.keywords.map((k: any) => String(k).trim()).filter(Boolean)
  } else if (typeof src.keywords === "string") {
    keywords = src.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
  }

  return {
    title: String(src.title || emptySeoMetadata.title),
    description: String(src.description || emptySeoMetadata.description),
    keywords: keywords.length > 0 ? keywords : emptySeoMetadata.keywords,
    canonicalUrl: String(src.canonicalUrl || emptySeoMetadata.canonicalUrl),
    robots: {
      index: src.robots?.index !== undefined ? Boolean(src.robots.index) : true,
      follow: src.robots?.follow !== undefined ? Boolean(src.robots.follow) : true,
    },
  }
}

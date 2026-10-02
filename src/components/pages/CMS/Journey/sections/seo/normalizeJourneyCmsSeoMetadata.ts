import { emptyJourneyCmsSeoMetadata } from "./emptyJourneyCmsSeoMetadata"

export function normalizeJourneyCmsSeoMetadata(rawSec: any): typeof emptyJourneyCmsSeoMetadata {
  if (!rawSec || typeof rawSec !== "object") return emptyJourneyCmsSeoMetadata

  const src = rawSec.seo || rawSec.metadata || rawSec.content || rawSec

  let keywords: string[] = []
  if (Array.isArray(src.keywords)) {
    keywords = src.keywords.map((k: any) => String(k).trim()).filter(Boolean)
  } else if (typeof src.keywords === "string") {
    keywords = src.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
  }

  return {
    title: String(src.title || emptyJourneyCmsSeoMetadata.title),
    description: String(src.description || emptyJourneyCmsSeoMetadata.description),
    keywords: keywords.length > 0 ? keywords : emptyJourneyCmsSeoMetadata.keywords,
    canonicalUrl: String(src.canonicalUrl || emptyJourneyCmsSeoMetadata.canonicalUrl),
    robots: {
      index: src.robots?.index !== undefined ? Boolean(src.robots.index) : true,
      follow: src.robots?.follow !== undefined ? Boolean(src.robots.follow) : true,
    },
  }
}

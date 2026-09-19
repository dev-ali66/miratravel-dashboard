import { emptySeoMetadata } from "./emptySeoMetadata"

export function normalizeSeoMetadata(seoData: any) {
  const safeSeo = seoData && typeof seoData === "object" ? seoData : {}
  const rawKeywords = safeSeo.keywords

  let keywordsList: string[] = []
  if (Array.isArray(rawKeywords)) {
    keywordsList = rawKeywords
  } else if (typeof rawKeywords === "string") {
    keywordsList = rawKeywords
      .split(",")
      .map((k: string) => k.trim())
      .filter(Boolean)
  } else {
    keywordsList = emptySeoMetadata.keywords
  }

  return {
    title: safeSeo.title ?? safeSeo.metaTitle ?? emptySeoMetadata.title,
    description:
      safeSeo.description ?? safeSeo.metaDescription ?? emptySeoMetadata.description,
    keywords: keywordsList,
    canonicalUrl: safeSeo.canonicalUrl ?? emptySeoMetadata.canonicalUrl,
    robots: {
      index:
        safeSeo.robots?.index ??
        (safeSeo.noIndex !== undefined
          ? !safeSeo.noIndex
          : emptySeoMetadata.robots.index),
      follow:
        safeSeo.robots?.follow ??
        (safeSeo.noFollow !== undefined
          ? !safeSeo.noFollow
          : emptySeoMetadata.robots.follow),
    },
  }
}

export default normalizeSeoMetadata

import { emptySeoMetadata } from "./emptySeoMetadata"

export function normalizeSeoMetadata(seo: any) {
  const safe = seo && typeof seo === "object" ? seo : {}

  const keywords = Array.isArray(safe.metaKeywords)
    ? safe.metaKeywords
    : typeof safe.metaKeywords === "string"
      ? safe.metaKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
      : emptySeoMetadata.metaKeywords

  return {
    metaTitle: safe.metaTitle ?? emptySeoMetadata.metaTitle,
    metaDescription: safe.metaDescription ?? emptySeoMetadata.metaDescription,
    metaKeywords: keywords,
    ogTitle: safe.ogTitle ?? emptySeoMetadata.ogTitle,
    ogDescription: safe.ogDescription ?? emptySeoMetadata.ogDescription,
    ogImage: safe.ogImage ?? emptySeoMetadata.ogImage,
    canonicalUrl: safe.canonicalUrl ?? emptySeoMetadata.canonicalUrl,
  }
}

export const normalizeSeo = normalizeSeoMetadata

import { normalizeNewsletterCmsHero } from "../sections/hero/normalizeNewsletterCmsHero"
import { normalizeNewsletterCmsSeoMetadata } from "../sections/seo/normalizeNewsletterCmsSeoMetadata"
import { emptyNewsletterCmsPayload } from "./emptyNewsletterCmsPayload"
import type { NewsletterCmsPayload } from "../newsletterCmsTypes"

export function normalizeNewsletterCmsPayload(raw: any): NewsletterCmsPayload {
  if (!raw || typeof raw !== "object") {
    return emptyNewsletterCmsPayload
  }

  const rawData = raw.data && typeof raw.data === "object" ? raw.data : raw
  const rawMeta = raw.metadata && typeof raw.metadata === "object" ? raw.metadata : raw

  const seoMeta = normalizeNewsletterCmsSeoMetadata(rawMeta.seo || rawMeta)
  const hero = normalizeNewsletterCmsHero(rawData.hero)

  return {
    id: raw.id,
    name: raw.name || "Newsletter CMS",
    slug: raw.slug || "newsletter",
    page: "newsletter",
    metadata: {
      ...seoMeta,
      seo: seoMeta,
    },
    data: {
      page: "newsletter",
      hero,
    },
  }
}

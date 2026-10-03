import { normalizeSubscribe } from "../sections/subscribe/normalizeSubscribe"
import { normalizeNewsletterCmsUnsubscribe } from "../sections/unsubscribe/normalizeUnsubscribe"
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
  const subscribeData = normalizeSubscribe(rawData.subscribe || rawData.hero)
  const unsubscribeData = normalizeNewsletterCmsUnsubscribe(rawData.unsubscribe)

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
      subscribe: subscribeData,
      unsubscribe: unsubscribeData,
    },
    subscribe: subscribeData,
    unsubscribe: unsubscribeData,
  }
}

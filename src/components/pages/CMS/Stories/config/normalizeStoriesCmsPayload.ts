import { normalizeStoriesCmsHero } from "../sections/hero/normalizeStoriesCmsHero"
import { normalizeStoriesCmsMiraStories } from "../sections/mira-stories/normalizeStoriesCmsMiraStories"
import { normalizeStoriesCmsSeoMetadata } from "../sections/seo/normalizeStoriesCmsSeoMetadata"
import { emptyStoriesCmsPayload } from "./emptyStoriesCmsPayload"
import type { StoriesCmsPayload } from "../storiesCmsTypes"

export function normalizeStoriesCmsPayload(raw: any): StoriesCmsPayload {
  if (!raw || typeof raw !== "object") {
    return emptyStoriesCmsPayload
  }

  const rawData = raw.data && typeof raw.data === "object" ? raw.data : raw
  const rawMeta = raw.metadata && typeof raw.metadata === "object" ? raw.metadata : raw

  const seoMeta = normalizeStoriesCmsSeoMetadata(rawMeta.seo || rawMeta)

  const hero = normalizeStoriesCmsHero(rawData.hero)
  const mira_stories = normalizeStoriesCmsMiraStories(rawData.mira_stories)

  return {
    id: raw.id,
    name: raw.name || "Stories CMS",
    slug: raw.slug || "stories",
    page: "stories",
    metadata: {
      ...seoMeta,
      seo: seoMeta,
    },
    data: {
      page: "stories",
      hero,
      mira_stories,
    },
  }
}

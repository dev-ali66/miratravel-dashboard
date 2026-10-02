import { normalizeJourneyCmsHero } from "../sections/hero/normalizeJourneyCmsHero"
import { normalizeJourneyCmsEditorialHighlight } from "../sections/editorial-highlight/normalizeJourneyCmsEditorialHighlight"
import { normalizeJourneyCmsSignatureJourneys } from "../sections/signature-journeys/normalizeJourneyCmsSignatureJourneys"
import { normalizeJourneyCmsAllJourneys } from "../sections/all-journeys/normalizeJourneyCmsAllJourneys"
import { normalizeJourneyCmsSeoMetadata } from "../sections/seo/normalizeJourneyCmsSeoMetadata"
import { emptyJourneyCmsPayload } from "./emptyJourneyCmsPayload"

export function normalizeJourneyCmsPayload(rawPayload: any) {
  if (!rawPayload || typeof rawPayload !== "object") return emptyJourneyCmsPayload

  const dataObj =
    typeof rawPayload.data === "string"
      ? (() => {
          try {
            return JSON.parse(rawPayload.data)
          } catch {
            return {}
          }
        })()
      : rawPayload.data || rawPayload

  const hero = normalizeJourneyCmsHero(dataObj.hero || dataObj)
  const editorial_highlight = normalizeJourneyCmsEditorialHighlight(
    dataObj.editorial_highlight || dataObj.sharedInfo || dataObj
  )
  const signature_journeys = normalizeJourneyCmsSignatureJourneys(
    dataObj.signature_journeys || dataObj.signatureJourneys || dataObj
  )
  const all_journeys = normalizeJourneyCmsAllJourneys(dataObj.all_journeys || dataObj.allJourneys || dataObj)
  const seo = normalizeJourneyCmsSeoMetadata(dataObj.seo || rawPayload.metadata || dataObj)

  const heroObj = { key: "hero", ...hero }
  const editorialHighlightObj = { key: "editorial_highlight", ...editorial_highlight }
  const signatureJourneysObj = { key: "signature_journeys", ...signature_journeys }
  const allJourneysObj = { key: "all_journeys", ...all_journeys }

  const metadataObj = {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    canonicalUrl: seo.canonicalUrl,
    robots: seo.robots,
    seo,
  }

  return {
    id: rawPayload.id || dataObj.id,
    name: "Journey CMS",
    slug: "journey",
    page: "journey",
    metadata: metadataObj,
    data: {
      page: "journey",
      hero: heroObj,
      editorial_highlight: editorialHighlightObj,
      signature_journeys: signatureJourneysObj,
      all_journeys: allJourneysObj,
    },
  }
}

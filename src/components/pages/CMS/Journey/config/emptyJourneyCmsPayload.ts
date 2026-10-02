import { emptyJourneyCmsHero } from "../sections/hero/emptyJourneyCmsHero"
import { emptyJourneyCmsEditorialHighlight } from "../sections/editorial-highlight/emptyJourneyCmsEditorialHighlight"
import { emptyJourneyCmsSignatureJourneys } from "../sections/signature-journeys/emptyJourneyCmsSignatureJourneys"
import { emptyJourneyCmsAllJourneys } from "../sections/all-journeys/emptyJourneyCmsAllJourneys"
import { emptyJourneyCmsSeoMetadata } from "../sections/seo/emptyJourneyCmsSeoMetadata"

const heroObj = { key: "hero", ...emptyJourneyCmsHero }
const editorialHighlightObj = { key: "editorial_highlight", ...emptyJourneyCmsEditorialHighlight }
const signatureJourneysObj = { key: "signature_journeys", ...emptyJourneyCmsSignatureJourneys }
const allJourneysObj = { key: "all_journeys", ...emptyJourneyCmsAllJourneys }

export const emptyJourneyCmsPayload = {
  page: "journey",
  slug: "journey",
  name: "Journey CMS",
  data: {
    page: "journey",
    hero: heroObj,
    editorial_highlight: editorialHighlightObj,
    signature_journeys: signatureJourneysObj,
    all_journeys: allJourneysObj,
  },
  metadata: {
    title: emptyJourneyCmsSeoMetadata.title,
    description: emptyJourneyCmsSeoMetadata.description,
    keywords: emptyJourneyCmsSeoMetadata.keywords,
    canonicalUrl: emptyJourneyCmsSeoMetadata.canonicalUrl,
    robots: emptyJourneyCmsSeoMetadata.robots,
    seo: emptyJourneyCmsSeoMetadata,
  },
}

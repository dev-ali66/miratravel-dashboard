import { emptyHero } from "../sections/hero/emptyHero"
import { emptyPhilosophy } from "../sections/philosophy/emptyPhilosophy"
import { emptyApproach } from "../sections/approach/emptyApproach"
import { emptyRegionalKnowledge } from "../sections/regional-knowledge/emptyRegionalKnowledge"
import { emptyPeople } from "../sections/people/emptyPeople"
import { emptyStandard } from "../sections/standard/emptyStandard"
import { emptyStay } from "../sections/stay/emptyStay"
import { emptyCta } from "../sections/cta/emptyCta"
import { emptySeoMetadata } from "../sections/seo/emptySeoMetadata"

export const emptyAboutPayload = {
  name: "About Us",
  slug: "about-us",
  metadata: {
    title: emptySeoMetadata.title,
    description: emptySeoMetadata.description,
    keywords: emptySeoMetadata.keywords,
    canonicalUrl: emptySeoMetadata.canonicalUrl,
    robots: {
      index: emptySeoMetadata.robots.index,
      follow: emptySeoMetadata.robots.follow,
    },
  },
  data: {
    page: "about-us",
    hero: emptyHero,
    philosophy: emptyPhilosophy,
    approach: emptyApproach,
    regional_knowledge: emptyRegionalKnowledge,
    people: emptyPeople,
    standard: emptyStandard,
    stay: emptyStay,
    cta: emptyCta,
    seo: emptySeoMetadata,
  },
}

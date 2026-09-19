import { emptyAboutPayload } from "./emptyAboutPayload"
import { normalizeHero } from "../sections/hero/normalizeHero"
import { normalizePhilosophy } from "../sections/philosophy/normalizePhilosophy"
import { normalizeApproach } from "../sections/approach/normalizeApproach"
import { normalizeRegionalKnowledge } from "../sections/regional-knowledge/normalizeRegionalKnowledge"
import { normalizePeople } from "../sections/people/normalizePeople"
import { normalizeStandard } from "../sections/standard/normalizeStandard"
import { normalizeStay } from "../sections/stay/normalizeStay"
import { normalizeCta } from "../sections/cta/normalizeCta"
import { normalizeSeoMetadata } from "../sections/seo/normalizeSeoMetadata"
import { recursivelyReplaceUndefinedWithNull } from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeAboutPayload(raw: any) {
  const safePayload = raw && typeof raw === "object" ? raw : {}
  const safeData = safePayload.data && typeof safePayload.data === "object" ? safePayload.data : safePayload

  const legacySections = Array.isArray(safeData.sections) ? safeData.sections : []
  const findLegacySection = (key: string) =>
    legacySections.find((s: any) => s.key === key || s.type === key)

  const heroRaw = safeData.hero ?? findLegacySection("hero") ?? {}
  const philosophyRaw = safeData.philosophy ?? findLegacySection("philosophy") ?? {}
  const approachRaw = safeData.approach ?? findLegacySection("approach") ?? {}
  const regionalRaw = safeData.regional_knowledge ?? safeData.regionalKnowledge ?? findLegacySection("regional_knowledge") ?? {}
  const peopleRaw = safeData.people ?? findLegacySection("people") ?? {}
  const standardRaw = safeData.standard ?? safeData.mira_standard ?? findLegacySection("standard") ?? {}
  const stayRaw = safeData.stay ?? findLegacySection("stay") ?? {}
  const ctaRaw = safeData.cta ?? findLegacySection("cta") ?? {}
  const seoRaw = safeData.seo ?? findLegacySection("seo") ?? {}

  const finalHero = normalizeHero(heroRaw)
  const finalPhilosophy = normalizePhilosophy(philosophyRaw)
  const finalApproach = normalizeApproach(approachRaw)
  const finalRegional = normalizeRegionalKnowledge(regionalRaw)
  const finalPeople = normalizePeople(peopleRaw)
  const finalStandard = normalizeStandard(standardRaw)
  const finalStay = normalizeStay(stayRaw)
  const finalCta = normalizeCta(ctaRaw)
  const finalSeo = normalizeSeoMetadata(seoRaw)

  const metadata = safePayload.metadata || {}

  const normalized = {
    ...(safePayload.id ? { id: safePayload.id } : {}),
    name: safePayload.name || "About Us",
    slug: "about-us",
    metadata: {
      ...emptyAboutPayload.metadata,
      title: metadata.title || finalSeo.title || emptyAboutPayload.metadata.title,
      description: metadata.description || finalSeo.description || emptyAboutPayload.metadata.description,
      keywords: metadata.keywords || finalSeo.keywords || emptyAboutPayload.metadata.keywords,
      canonicalUrl: metadata.canonicalUrl || finalSeo.canonicalUrl || emptyAboutPayload.metadata.canonicalUrl,
      robots: {
        index: metadata.robots?.index ?? finalSeo.robots?.index ?? true,
        follow: metadata.robots?.follow ?? finalSeo.robots?.follow ?? true,
      },
    },
    data: {
      page: "about-us",
      hero: finalHero,
      philosophy: finalPhilosophy,
      approach: finalApproach,
      regional_knowledge: finalRegional,
      people: finalPeople,
      standard: finalStandard,
      stay: finalStay,
      cta: finalCta,
      seo: finalSeo,
    },
  }

  return recursivelyReplaceUndefinedWithNull(normalized)
}

export default normalizeAboutPayload

import { emptyContactPayload } from "./emptyContactPayload"
import { normalizeHero } from "../sections/hero/normalizeHero"
import { normalizeProcess } from "../sections/process/normalizeProcess"
import { normalizeInquiryForm } from "../sections/inquiry-form/normalizeInquiryForm"
import { normalizePlanTravel } from "../sections/plan-travel/normalizePlanTravel"
import { normalizeContactInfo } from "../sections/contact-info/normalizeContactInfo"
import { normalizeCta } from "../sections/cta/normalizeCta"
import { normalizeSeoMetadata } from "../sections/seo/normalizeSeoMetadata"
import { recursivelyReplaceUndefinedWithNull } from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeContactPayload(raw: any) {
  const safePayload = raw && typeof raw === "object" ? raw : {}
  const safeData = safePayload.data && typeof safePayload.data === "object" ? safePayload.data : safePayload

  // Handle legacy sections array if present
  const legacySections = Array.isArray(safeData.sections) ? safeData.sections : []
  const findLegacySection = (key: string) =>
    legacySections.find((s: any) => s.key === key || s.type === key)

  const heroRaw = safeData.hero ?? findLegacySection("hero") ?? {}
  const processRaw = safeData.process ?? findLegacySection("process") ?? {}
  const inquiryRaw = safeData.inquiry_form ?? safeData.inquiryForm ?? findLegacySection("inquiry-form") ?? findLegacySection("inquiry_form") ?? {}
  const planRaw = safeData.plan_travel ?? safeData.planTravel ?? findLegacySection("plan-travel") ?? findLegacySection("plan_travel") ?? {}
  const contactInfoRaw = safeData.contact_info ?? safeData.contactInfo ?? findLegacySection("contact-info") ?? findLegacySection("contact_info") ?? {}
  const ctaRaw = safeData.cta ?? findLegacySection("cta") ?? {}
  const seoRaw = safeData.seo ?? findLegacySection("seo") ?? {}

  const finalHero = normalizeHero(heroRaw)
  const finalProcess = normalizeProcess(processRaw)
  const finalInquiry = normalizeInquiryForm(inquiryRaw)
  const finalPlan = normalizePlanTravel(planRaw)
  const finalContactInfo = normalizeContactInfo(contactInfoRaw)
  const finalCta = normalizeCta(ctaRaw)
  const finalSeo = normalizeSeoMetadata(seoRaw)

  const metadata = safePayload.metadata || {}

  const normalized = {
    ...(safePayload.id ? { id: safePayload.id } : {}),
    name: safePayload.name || "Contact Us",
    slug: "contact-us",
    metadata: {
      ...emptyContactPayload.metadata,
      title: metadata.title || (finalSeo as any).title || (finalSeo as any).metaTitle || emptyContactPayload.metadata.title,
      description: metadata.description || (finalSeo as any).description || (finalSeo as any).metaDescription || emptyContactPayload.metadata.description,
      keywords: metadata.keywords || finalSeo.keywords || emptyContactPayload.metadata.keywords,
      canonicalUrl: metadata.canonicalUrl || finalSeo.canonicalUrl || emptyContactPayload.metadata.canonicalUrl,
      ogTitle: metadata.ogTitle || (finalSeo as any).ogTitle || (finalSeo as any).title || emptyContactPayload.metadata.ogTitle,
      ogDescription: metadata.ogDescription || (finalSeo as any).ogDescription || (finalSeo as any).description || emptyContactPayload.metadata.ogDescription,
      ogImage: metadata.ogImage || (finalSeo as any).ogImage || emptyContactPayload.metadata.ogImage,
      robots: {
        index: metadata.robots?.index ?? finalSeo.robots?.index ?? !(finalSeo as any).noIndex,
        follow: metadata.robots?.follow ?? finalSeo.robots?.follow ?? !(finalSeo as any).noFollow,
      },
    },
    data: {
      page: "contact-us",
      hero: finalHero,
      process: finalProcess,
      inquiry_form: finalInquiry,
      plan_travel: finalPlan,
      contact_info: finalContactInfo,
      cta: finalCta,
      seo: finalSeo,
    },
  }

  return recursivelyReplaceUndefinedWithNull(normalized)
}

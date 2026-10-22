import type { ComponentType } from "react"
import type { ExperienceData, ExperienceSectionKey } from "../experienceTypes"
import { BasicInfoForm } from "../sections/basic-info/BasicInfoForm"
import { HeroForm } from "../sections/hero/HeroForm"
import { HeroPreview } from "../sections/hero/HeroPreview"
import { TheExperienceForm } from "../sections/the-experience/TheExperienceForm"
import { TheExperiencePreview } from "../sections/the-experience/TheExperiencePreview"
import { HighlightsForm } from "../sections/highlights/HighlightsForm"
import { HighlightsPreview } from "../sections/highlights/HighlightsPreview"
import { PracticalInfoForm } from "../sections/practical-info/PracticalInfoForm"
import { PracticalInfoPreview } from "../sections/practical-info/PracticalInfoPreview"
import { MiraTouchForm } from "../sections/mira-touch/MiraTouchForm"
import { MiraTouchPreview } from "../sections/mira-touch/MiraTouchPreview"
import { RelatedJourneysForm } from "../sections/related-journeys/RelatedJourneysForm"
import { RelatedJourneysPreview } from "../sections/related-journeys/RelatedJourneysPreview"
import { EnquiryCtaForm } from "../sections/enquiry-cta/EnquiryCtaForm"
import { EnquiryCtaPreview } from "../sections/enquiry-cta/EnquiryCtaPreview"
import { EssenceForm } from "../sections/essence/EssenceForm"
import { EssencePreview } from "../sections/essence/EssencePreview"
import { FaqForm } from "../sections/faq/FaqForm"
import { FaqPreview } from "../sections/faq/FaqPreview"
import { SeoForm } from "../sections/seo/SeoForm"

export type ExperienceFormSectionProps = {
  draft: ExperienceData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
  sectionNumber?: string
}

export type ExperiencePreviewSectionProps = {
  draft: ExperienceData | null
}

export type ExperienceSectionRegistryEntry = {
  label: string
  form: ComponentType<ExperienceFormSectionProps> | null
  preview: ComponentType<ExperiencePreviewSectionProps> | null
}

export const experienceSectionRegistry: Record<ExperienceSectionKey, ExperienceSectionRegistryEntry> = {
  "basic-info": {
    label: "Basic Information & Classification",
    form: BasicInfoForm,
    preview: null,
  },
  hero: {
    label: "Hero Banner",
    form: HeroForm,
    preview: HeroPreview,
  },
  "the-experience": {
    label: "The Experience (Narrative & Intro)",
    form: TheExperienceForm,
    preview: TheExperiencePreview,
  },
  highlights: {
    label: "Key Highlights (3 to 5 Moments)",
    form: HighlightsForm,
    preview: HighlightsPreview,
  },
  "practical-info": {
    label: "Practical Information",
    form: PracticalInfoForm,
    preview: PracticalInfoPreview,
  },
  "mira-touch": {
    label: "The MIRA Touch",
    form: MiraTouchForm,
    preview: MiraTouchPreview,
  },
  "related-journeys": {
    label: "Related Journeys",
    form: RelatedJourneysForm,
    preview: RelatedJourneysPreview,
  },
  "enquiry-cta": {
    label: "Enquiry & Reservation CTA",
    form: EnquiryCtaForm,
    preview: EnquiryCtaPreview,
  },
  essence: {
    label: "Legacy Essence Narrative",
    form: EssenceForm,
    preview: EssencePreview,
  },
  faq: {
    label: "Frequently Asked Questions",
    form: FaqForm,
    preview: FaqPreview,
  },
  seo: {
    label: "SEO & Metadata",
    form: SeoForm,
    preview: null,
  },
}

export const experienceSectionOrder: ExperienceSectionKey[] = [
  "basic-info",
  "hero",
  "the-experience",
  "highlights",
  "practical-info",
  "mira-touch",
  "related-journeys",
  "enquiry-cta",
  "essence",
  "faq",
  "seo",
]

export function getExperienceSections(): ExperienceSectionKey[] {
  return [...experienceSectionOrder]
}

import type { ComponentType } from "react"
import type { ExperienceData, ExperienceSectionKey } from "../experienceTypes"
import { BasicInfoForm } from "../sections/basic-info/BasicInfoForm"
import { HeroForm } from "../sections/hero/HeroForm"
import { HeroPreview } from "../sections/hero/HeroPreview"
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
    label: "Basic Information",
    form: BasicInfoForm,
    preview: null,
  },
  hero: {
    label: "Hero Banner",
    form: HeroForm,
    preview: HeroPreview,
  },
  essence: {
    label: "Essence & Highlight Narrative",
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
  "essence",
  "faq",
  "seo",
]

export function getExperienceSections(): ExperienceSectionKey[] {
  return [...experienceSectionOrder]
}

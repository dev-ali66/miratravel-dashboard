import { createElement, type ComponentType } from "react"

import { BackgroundFormSection } from "../shared/form/BackgroundFormSection"
import { ContentFormSection } from "../shared/form/ContentFormSection"
import { FaqAppearanceFormSection } from "../shared/form/FaqAppearanceFormSection"
import { QuestionsFormSection } from "../shared/form/QuestionsFormSection"
import type { FaqSectionFormProps } from "../shared/form/sectionTypes"
import { FaqContentPreview } from "../FaqPreview"

export type FaqSectionKey =
  | "content"
  | "background"
  | "faqAppearance"
  | "questions"

export type FaqSectionConfig = {
  label: string
  meta: string
  form: ComponentType<FaqSectionFormProps>
  preview: ComponentType | null
}

const faqPreview: ComponentType = () => createElement(FaqContentPreview)

export const faqSectionRegistry: Record<FaqSectionKey, FaqSectionConfig> = {
  content: {
    label: "FAQ Content",
    meta: "content",
    form: ContentFormSection,
    preview: faqPreview,
  },
  background: {
    label: "Background",
    meta: "background",
    form: BackgroundFormSection,
    preview: null,
  },
  faqAppearance: {
    label: "FAQ Appearance",
    meta: "appearance",
    form: FaqAppearanceFormSection,
    preview: null,
  },
  questions: {
    label: "Questions",
    meta: "items",
    form: QuestionsFormSection,
    preview: null,
  },
}

export const faqSectionOrder: FaqSectionKey[] = [
  "content",
  "background",
  "faqAppearance",
  "questions",
]

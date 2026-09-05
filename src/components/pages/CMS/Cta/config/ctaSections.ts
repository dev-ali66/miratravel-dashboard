import type { ComponentType } from "react"
import { CtaContentForm } from "../shared/form/CtaContentForm"
import { CtaBackgroundForm } from "../shared/form/CtaBackgroundForm"
import { CtaButtonsForm } from "../shared/form/CtaButtonsForm"
import type { CtaFormSectionProps } from "../shared/form/sectionTypes"

export type CtaSectionKey = "content" | "background" | "buttons"
export type CtaSectionConfig = {
  label: string
  meta: string
  form: ComponentType<CtaFormSectionProps>
  preview: null
}

export const ctaSectionRegistry: Record<CtaSectionKey, CtaSectionConfig> = {
  content: {
    label: "CTA Content",
    meta: "content",
    form: CtaContentForm,
    preview: null,
  },
  background: {
    label: "Background",
    meta: "background",
    form: CtaBackgroundForm,
    preview: null,
  },
  buttons: {
    label: "Buttons",
    meta: "buttons",
    form: CtaButtonsForm,
    preview: null,
  },
}

export const ctaSectionOrder: CtaSectionKey[] = [
  "content",
  "background",
  "buttons",
]

import type { ComponentType } from "react"
import { ContactContentPreview } from "../ContactPreview"

export type ContactPreviewSectionKey = "contact"

export type ContactPreviewSectionConfig = {
  label: string
  preview: ComponentType
}

export const contactPreviewSectionRegistry: Record<
  ContactPreviewSectionKey,
  ContactPreviewSectionConfig
> = {
  contact: {
    label: "Contact Preview",
    preview: ContactContentPreview,
  },
}

export const contactPreviewSectionOrder: ContactPreviewSectionKey[] = [
  "contact",
]

import { THEME_COLORS } from "@/config/theme"
import {
  normalizeMultimedia,
  normalizeStyledField,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyCta } from "./emptyCta"

export function normalizeCta(section: any) {
  const safeSection = section && typeof section === "object" ? section : {}
  const content =
    safeSection.content && typeof safeSection.content === "object"
      ? safeSection.content
      : {}

  const rawTitle =
    safeSection.title ??
    content.title ??
    safeSection.titleLine1 ??
    content.titleLine1 ??
    emptyCta.title.value

  const normalized = {
    ...emptyCta,
    ...safeSection,
    title: normalizeStyledField(
      rawTitle,
      emptyCta.title.value,
      THEME_COLORS.primary
    ),
    description: normalizeStyledField(
      safeSection.description ?? content.description,
      emptyCta.description.value,
      THEME_COLORS.sub
    ),
    backgroundMultimedia: normalizeMultimedia(
      safeSection.backgroundMultimedia ?? content.backgroundMultimedia,
      (emptyCta.backgroundMultimedia?.show as any) || "color"
    ),
    rightSideMultimedia: normalizeMultimedia(
      safeSection.rightSideMultimedia ?? content.rightSideMultimedia,
      (emptyCta.rightSideMultimedia?.show as any) || "image"
    ),
    buttons: normalizeButtonsArray(safeSection.buttons ?? content.buttons ?? emptyCta.buttons),
  }

  delete (normalized as any).key
  delete (normalized as any).type
  delete (normalized as any).bgColor
  delete (normalized as any).content
  delete (normalized as any).buttonLabel
  delete (normalized as any).buttonHref
  delete (normalized as any).multimedia
  return normalized
}

export default normalizeCta



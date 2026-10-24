import { THEME_COLORS } from "@/config/theme"
import {
  normalizeMultimedia,
  normalizeStyledField,
  normalizeButtonsArray,
  normalizeButton,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeMiraStories(section: any) {
  const safeSection = section && typeof section === "object" ? section : {}
  const content =
    safeSection.content && typeof safeSection.content === "object"
      ? safeSection.content
      : {}

  const normalized = {
    ...safeSection,
    eyebrow: normalizeStyledField(
      safeSection.eyebrow ?? content.eyebrow,
      "The Editorial",
      THEME_COLORS.goldMuted
    ),
    title: normalizeStyledField(
      safeSection.title ?? content.title,
      "Mira Stories",
      THEME_COLORS.primary
    ),
    description: normalizeStyledField(
      safeSection.description ?? content.description,
      "A collection of personal, cultural and inspiring stories. Each piece offers a deeper view of the Balkans and its people beyond the expected.",
      THEME_COLORS.sub
    ),
    backgroundMultimedia: normalizeMultimedia(
      safeSection.backgroundMultimedia ?? content.backgroundMultimedia,
      "color"
    ),
    leftSideMultimedia: normalizeMultimedia(
      safeSection.leftSideMultimedia ?? content.leftSideMultimedia,
      "image"
    ),
    items: (Array.isArray(safeSection.items)
      ? safeSection.items
      : Array.isArray(content.items)
      ? content.items
      : []
    ).map((item: any) => {
      const rawButton = item?.button || (item?.url ? { label: "Read Story", url: item.url } : null)
      const buttonObj = normalizeButton(rawButton) || {
        label: "Read Story",
        url: typeof item?.url === "string" ? item.url : "",
        variant: "PRIMARY",
        style: "primary",
        rounded: "full",
        backgroundColor: THEME_COLORS.primary,
        backgroundOpacity: 100,
        textColor: THEME_COLORS.white,
        textOpacity: 100,
        hoverBackgroundColor: THEME_COLORS.lightText,
        hoverTextColor: THEME_COLORS.overlayBlack,
        target: "_self",
        showIcon: true,
      }

      return {
        ...item,
        title: normalizeStyledField(
          item?.title,
          "Story title",
          THEME_COLORS.primary
        ),
        subtitle: normalizeStyledField(
          item?.subtitle,
          "Story subtitle",
          THEME_COLORS.sub
        ),
        button: buttonObj,
        url: buttonObj.url,
      }
    }),
    buttons: normalizeButtonsArray(safeSection.buttons ?? content.buttons),
  }

  delete (normalized as any).key
  delete (normalized as any).type
  delete (normalized as any).bgColor
  delete (normalized as any).content
  return normalized
}

export default normalizeMiraStories

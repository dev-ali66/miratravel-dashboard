import { THEME_COLORS } from "@/config/theme"
import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray, normalizeButton } from "../../shared/normalizeHelpers"
import { emptyStories } from "./emptyStories"

export function normalizeStories(input: any) {
  const safeInput = input && typeof input === "object" ? input : {}

  const normalized = {
    ...safeInput,
    eyebrow: normalizeStyledField(safeInput.eyebrow ?? emptyStories.eyebrow, "The Editorial", THEME_COLORS.goldMuted),
    title: normalizeStyledField(safeInput.title ?? emptyStories.title, "Location Stories", THEME_COLORS.primary),
    description: normalizeStyledField(safeInput.description ?? emptyStories.description, "", THEME_COLORS.sub),
    leftSideMultimedia: normalizeMultimedia(safeInput.leftSideMultimedia || emptyStories.leftSideMultimedia, THEME_COLORS.bgWarm),
    backgroundMultimedia: normalizeMultimedia(safeInput.backgroundMultimedia || emptyStories.backgroundMultimedia, THEME_COLORS.bgWarm),
    items: Array.isArray(safeInput.items)
      ? safeInput.items.map((it: any) => ({
          title: normalizeStyledField(it.title, "", THEME_COLORS.primary),
          subtitle: normalizeStyledField(it.subtitle, "", THEME_COLORS.sub),
          button: normalizeButton(it.button || { label: "Read Story", url: it.url || "#" }),
          url: it.button?.url || it.url || "",
        }))
      : [],
    buttons: normalizeButtonsArray(safeInput.buttons || emptyStories.buttons),
  }

  delete (normalized as any).style
  delete (normalized as any).eyebrowStyle
  delete (normalized as any).titleStyle
  delete (normalized as any).descriptionStyle

  return normalized
}

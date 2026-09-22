import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "../../shared/normalizeHelpers"
import { emptyStories } from "./emptyStories"

export function normalizeStories(input: any) {
  const safeInput = input && typeof input === "object" ? input : {}

  const normalized = {
    ...safeInput,
    eyebrow: normalizeStyledField(safeInput.eyebrow ?? emptyStories.eyebrow, "The Editorial", "#C5A880"),
    title: normalizeStyledField(safeInput.title ?? emptyStories.title, "Location Stories", "#182D09"),
    description: normalizeStyledField(safeInput.description ?? emptyStories.description, "", "#4B5563"),
    leftSideMultimedia: normalizeMultimedia(safeInput.leftSideMultimedia || emptyStories.leftSideMultimedia, "#FCFBF9"),
    backgroundMultimedia: normalizeMultimedia(safeInput.backgroundMultimedia || emptyStories.backgroundMultimedia, "#FCFBF9"),
    items: Array.isArray(safeInput.items)
      ? safeInput.items.map((it: any) => ({
          title: normalizeStyledField(it.title, "", "#182D09"),
          subtitle: normalizeStyledField(it.subtitle, "", "#4B5563"),
          button: it.button || { label: "Read Story", url: "#" },
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

import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"

export function normalizeWhyVisit(why: any) {
  const safeWhy = why && typeof why === "object" ? why : {}

  const normalizedWhy = {
    ...safeWhy,
    title: normalizeStyledField(safeWhy.title, "", "#182d09"),
    subtitle: normalizeStyledField(safeWhy.subtitle, "", "#565e69"),
    tags: Array.isArray(safeWhy.tags) ? safeWhy.tags : [],
    imageMultimedia: normalizeMultimedia(safeWhy.imageMultimedia, "image"),
    backgroundMultimedia: normalizeMultimedia(safeWhy.backgroundMultimedia, "color"),
    description_paragraphs: Array.isArray(safeWhy.description_paragraphs)
      ? safeWhy.description_paragraphs
      : [],
  }

  delete (normalizedWhy as any).image
  delete (normalizedWhy as any).subtitleStyle
  delete (normalizedWhy as any).titleStyle
  delete (normalizedWhy as any).descriptionStyle
  delete (normalizedWhy as any).style

  return normalizedWhy
}

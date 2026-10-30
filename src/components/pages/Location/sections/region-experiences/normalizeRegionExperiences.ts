import { normalizeMultimedia, normalizeStyledField, LOCATION_THEME_COLORS } from "../../shared/normalizeHelpers"
import { emptyRegionExperiences } from "./emptyRegionExperiences"

export function normalizeRegionExperiences(regionExperiences: any) {
  const safeRegExp = regionExperiences && typeof regionExperiences === "object" ? regionExperiences : {}

  const normalizedRegionExperiences = {
    ...safeRegExp,
    label: normalizeStyledField(safeRegExp.label ?? emptyRegionExperiences.label, "", LOCATION_THEME_COLORS.accent),
    title: normalizeStyledField(safeRegExp.title ?? emptyRegionExperiences.title, "", LOCATION_THEME_COLORS.primary),
    backgroundMultimedia: normalizeMultimedia(
      safeRegExp.backgroundMultimedia || emptyRegionExperiences.backgroundMultimedia,
      "color"
    ),
    items: Array.isArray(safeRegExp.items)
      ? safeRegExp.items.map((it: any) => {
          const normItem = {
            id: it?.id ?? "",
            title: normalizeStyledField(it?.title, "", LOCATION_THEME_COLORS.primary),
            subtitle: normalizeStyledField(it?.subtitle, "", LOCATION_THEME_COLORS.muted),
            description: normalizeStyledField(it?.description, "", LOCATION_THEME_COLORS.muted),
          }

          // Strip all extraneous, duplicate, or static location fields
          delete (normItem as any).imageMultimedia
          delete (normItem as any).backgroundMultimedia
          delete (normItem as any).buttons
          delete (normItem as any).button
          delete (normItem as any).tag
          delete (normItem as any).category
          delete (normItem as any).quote
          delete (normItem as any).locationName
          delete (normItem as any).badgeText
          delete (normItem as any).badge
          delete (normItem as any).location
          delete (normItem as any).image
          delete (normItem as any).categoryStyle
          delete (normItem as any).titleStyle
          delete (normItem as any).subtitleStyle
          delete (normItem as any).descriptionStyle
          delete (normItem as any).quoteStyle
          delete (normItem as any).locationStyle
          delete (normItem as any).badgeStyle
          delete (normItem as any).style

          return normItem
        })
      : (emptyRegionExperiences.items ?? []),
  }

  delete (normalizedRegionExperiences as any).labelStyle
  delete (normalizedRegionExperiences as any).titleStyle
  delete (normalizedRegionExperiences as any).style

  return normalizedRegionExperiences
}

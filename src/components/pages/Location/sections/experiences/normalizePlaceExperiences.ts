import { normalizeMultimedia, normalizeStyledField, LOCATION_THEME_COLORS } from "../../shared/normalizeHelpers"
import { emptyExperiences } from "./emptyExperiences"

export function normalizePlaceExperiences(experiences: any) {
  const safeExp = experiences && typeof experiences === "object" ? experiences : {}

  let rawItems: any[] = []
  if (Array.isArray(safeExp.items)) {
    rawItems = safeExp.items
  } else if (Array.isArray(safeExp.cards)) {
    rawItems = safeExp.cards
  } else if (safeExp.featured_experience) {
    rawItems = [safeExp.featured_experience]
  } else {
    rawItems = []
  }

  const items: string[] = rawItems
    .map((it: any) => (typeof it === "string" ? it : it?.locationId || it?.id))
    .filter((id): id is string => Boolean(id) && typeof id === "string")

  const normalizedExperiences = {
    ...safeExp,
    title: normalizeStyledField(safeExp.title ?? emptyExperiences.title, "", LOCATION_THEME_COLORS.primary),
    location: safeExp.location ?? emptyExperiences.location ?? "DESTINATION",
    description: normalizeStyledField(safeExp.description ?? emptyExperiences.description, "", LOCATION_THEME_COLORS.muted),
    seasonInfo: safeExp.seasonInfo ?? emptyExperiences.seasonInfo ?? "",
    seasonLocation: safeExp.seasonLocation ?? emptyExperiences.seasonLocation ?? "",
    items,
    backgroundMultimedia: normalizeMultimedia(
      safeExp.backgroundMultimedia || emptyExperiences.backgroundMultimedia,
      "color"
    ),
  }

  delete (normalizedExperiences as any).cards
  delete (normalizedExperiences as any).featured_experience
  delete (normalizedExperiences as any).load_more_button
  delete (normalizedExperiences as any).loadMoreButtonStyle

  return normalizedExperiences
}

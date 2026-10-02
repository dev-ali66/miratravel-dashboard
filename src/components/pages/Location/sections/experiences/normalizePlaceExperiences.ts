import { normalizeMultimedia, normalizeStyledField, LOCATION_THEME_COLORS } from "../../shared/normalizeHelpers"
import { emptyExperiences } from "./emptyExperiences"

function normalizeItem(item: any, defaultId: string) {
  if (!item || typeof item !== "object") return null

  const tagVal = typeof item.tag === "object"
    ? item.tag?.value
    : item.tag || (typeof item.category === "object" ? item.category?.value : item.category) || ""
  const titleVal = typeof item.title === "object" ? item.title?.value : item.title || ""
  const subtitleVal = typeof item.subtitle === "object" ? item.subtitle?.value : item.subtitle || ""
  const descVal = typeof item.description === "object" ? item.description?.value : item.description || ""

  const rawButtons = Array.isArray(item.buttons) && item.buttons.length > 0
    ? item.buttons
    : item.button
    ? [item.button]
    : []

  const normalizedButtons = rawButtons.map((btn: any) => ({
    label: btn.label ?? "Explore Experience",
    url: btn.url ?? "",
    style: btn.style ?? (btn.variant ? String(btn.variant).toLowerCase() : "primary"),
    variant: (btn.variant ?? btn.style ?? "PRIMARY").toUpperCase(),
    textColor: btn.textColor ?? "#ffffff",
    backgroundColor: btn.backgroundColor ?? LOCATION_THEME_COLORS.accent,
  }))

  const normItem: any = {
    id: item.id ?? defaultId,
    title: normalizeStyledField(item.title ?? titleVal, "", LOCATION_THEME_COLORS.primary),
    subtitle: normalizeStyledField(item.subtitle ?? subtitleVal, "", LOCATION_THEME_COLORS.accent),
    description: normalizeStyledField(item.description ?? descVal, "", LOCATION_THEME_COLORS.muted),
    tag: normalizeStyledField(item.tag ?? tagVal, "", LOCATION_THEME_COLORS.accent),
    buttons: normalizedButtons,
    imageMultimedia: normalizeMultimedia(item.imageMultimedia, "image"),
  }

  // Include optional category only if distinct from tag
  if (item.category && typeof item.category === "object" && item.category?.value && item.category?.value !== tagVal) {
    normItem.category = normalizeStyledField(item.category, "", LOCATION_THEME_COLORS.accent)
  }

  delete (normItem as any).categoryStyle
  delete (normItem as any).titleStyle
  delete (normItem as any).subtitleStyle
  delete (normItem as any).quoteStyle
  delete (normItem as any).locationStyle
  delete (normItem as any).badgeStyle
  delete (normItem as any).style

  return normItem
}

export function normalizePlaceExperiences(experiences: any) {
  const safeExp = experiences && typeof experiences === "object" ? experiences : {}

  let rawItems: any[] = []
  if (Array.isArray(safeExp.items)) {
    rawItems = safeExp.items
  } else if (Array.isArray(safeExp.cards) && safeExp.cards.length > 0) {
    rawItems = safeExp.featured_experience
      ? [safeExp.featured_experience, ...safeExp.cards]
      : safeExp.cards
  } else if (safeExp.featured_experience && (safeExp.featured_experience.title || safeExp.featured_experience.imageMultimedia)) {
    rawItems = [safeExp.featured_experience]
  } else {
    rawItems = []
  }

  const items = rawItems
    .map((it: any, idx: number) => normalizeItem(it, it.id || `exp-${idx}`))
    .filter(Boolean)

  const normalizedExperiences = {
    ...safeExp,
    title: normalizeStyledField(safeExp.title ?? emptyExperiences.title, "", LOCATION_THEME_COLORS.primary),
    location: safeExp.location ?? emptyExperiences.location ?? "DESTINATION",
    description: normalizeStyledField(safeExp.description ?? emptyExperiences.description, "", LOCATION_THEME_COLORS.muted),
    seasonInfo: safeExp.seasonInfo ?? emptyExperiences.seasonInfo ?? "",
    seasonLocation: safeExp.seasonLocation ?? emptyExperiences.seasonLocation ?? "",
    load_more_button: safeExp.load_more_button ?? emptyExperiences.load_more_button ?? "Load More",
    items,
    backgroundMultimedia: normalizeMultimedia(
      safeExp.backgroundMultimedia || emptyExperiences.backgroundMultimedia,
      "color"
    ),
  }

  delete (normalizedExperiences as any).cards
  delete (normalizedExperiences as any).featured_experience
  delete (normalizedExperiences as any).loadMoreButtonStyle
  delete (normalizedExperiences as any).titleStyle
  delete (normalizedExperiences as any).locationStyle
  delete (normalizedExperiences as any).descriptionStyle
  delete (normalizedExperiences as any).style

  return normalizedExperiences
}

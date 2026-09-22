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
          const rawButtons = Array.isArray(it.buttons) && it.buttons.length > 0
            ? it.buttons
            : it.button
              ? [it.button]
              : []

          const normalizedButtons = rawButtons.map((btn: any) => ({
            label: btn.label ?? it.buttonText ?? "Explore Region",
            url: btn.url ?? it.buttonUrl ?? "",
            style: btn.style ?? (btn.variant ? String(btn.variant).toLowerCase() : "primary"),
            variant: (btn.variant ?? btn.style ?? "PRIMARY").toUpperCase(),
            textColor: btn.textColor ?? "#ffffff",
            backgroundColor: btn.backgroundColor ?? LOCATION_THEME_COLORS.accent,
          }))

          const normItem = {
            id: it.id ?? "",
            category: normalizeStyledField(it.category, "", LOCATION_THEME_COLORS.accent),
            title: normalizeStyledField(it.title, "", LOCATION_THEME_COLORS.primary),
            subtitle: normalizeStyledField(it.subtitle, "", LOCATION_THEME_COLORS.muted),
            quote: normalizeStyledField(it.quote, "", LOCATION_THEME_COLORS.muted),
            locationName: normalizeStyledField(it.locationName ?? it.location, "", LOCATION_THEME_COLORS.primary),
            badgeText: normalizeStyledField(it.badgeText ?? it.badge, "", LOCATION_THEME_COLORS.accent),
            buttons: normalizedButtons,
            imageMultimedia: normalizeMultimedia(it.imageMultimedia, "image"),
            backgroundMultimedia: normalizeMultimedia(it.backgroundMultimedia, "color"),
          }

          delete (normItem as any).categoryStyle
          delete (normItem as any).titleStyle
          delete (normItem as any).subtitleStyle
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


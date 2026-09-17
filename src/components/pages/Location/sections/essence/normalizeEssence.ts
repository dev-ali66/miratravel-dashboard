import { normalizeMultimedia, normalizeStyledField, LOCATION_THEME_COLORS } from "../../shared/normalizeHelpers"

export function normalizeEssence(essence: any) {
  const safeEssence = essence && typeof essence === "object" ? essence : {}

  const rawStatValue =
    safeEssence.stat?.statValue ??
    safeEssence.stat_badge_value ??
    safeEssence.statValue ??
    "50+"
  const rawStatLabel =
    safeEssence.stat?.statLabel ??
    safeEssence.stat_badge_label ??
    safeEssence.statLabel ??
    "Countries & Sovereign Territories"
  const rawStatBadgeBg =
    safeEssence.stat?.statBadgeBg ??
    safeEssence.stat_badge_bg ??
    safeEssence.statBadgeBg ??
    LOCATION_THEME_COLORS.accent

  const normalizedEssence = {
    ...safeEssence,
    label: normalizeStyledField(safeEssence.label, "", LOCATION_THEME_COLORS.accent),
    title: normalizeStyledField(safeEssence.title, "", LOCATION_THEME_COLORS.primary),
    paragraphs: normalizeStyledField(safeEssence.paragraphs, "", LOCATION_THEME_COLORS.muted),
    quote: normalizeStyledField(safeEssence.quote, "", LOCATION_THEME_COLORS.primary),
    stat: {
      statValue: normalizeStyledField(rawStatValue, "", "#ffffff"),
      statLabel: normalizeStyledField(rawStatLabel, "", "#ffffff"),
      statBadgeBg: typeof rawStatBadgeBg === "string" ? rawStatBadgeBg : "#B86B3A",
    },
    imageMultimedia: normalizeMultimedia(
      safeEssence.imageMultimedia || safeEssence.multimedia,
      "image"
    ),
    backgroundMultimedia: normalizeMultimedia(safeEssence.backgroundMultimedia, "color"),
  }

  delete (normalizedEssence as any).labelStyle
  delete (normalizedEssence as any).titleStyle
  delete (normalizedEssence as any).paragraphsStyle
  delete (normalizedEssence as any).quoteStyle
  delete (normalizedEssence as any).style

  return normalizedEssence
}

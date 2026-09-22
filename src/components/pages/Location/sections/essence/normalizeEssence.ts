import { normalizeMultimedia, normalizeStyledField, LOCATION_THEME_COLORS } from "../../shared/normalizeHelpers"
import { emptyEssence } from "./emptyEssence"

export function normalizeEssence(essence: any) {
  const safeEssence = essence && typeof essence === "object" ? essence : {}

  const rawStatValue =
    safeEssence.stat?.statValue ??
    safeEssence.stat_badge_value ??
    safeEssence.statValue ??
    emptyEssence.stat.statValue
  const rawStatLabel =
    safeEssence.stat?.statLabel ??
    safeEssence.stat_badge_label ??
    safeEssence.statLabel ??
    emptyEssence.stat.statLabel
  const rawStatBadgeBg =
    safeEssence.stat?.statBadgeBg ??
    safeEssence.stat_badge_bg ??
    safeEssence.statBadgeBg ??
    emptyEssence.stat.statBadgeBg

  const normalizedEssence = {
    ...safeEssence,
    label: normalizeStyledField(safeEssence.label ?? emptyEssence.label, "", LOCATION_THEME_COLORS.accent),
    title: normalizeStyledField(safeEssence.title ?? emptyEssence.title, "", LOCATION_THEME_COLORS.primary),
    paragraphs: normalizeStyledField(safeEssence.paragraphs ?? emptyEssence.paragraphs, "", LOCATION_THEME_COLORS.muted),
    quote: normalizeStyledField(safeEssence.quote ?? emptyEssence.quote, "", LOCATION_THEME_COLORS.primary),
    stat: {
      statValue: normalizeStyledField(rawStatValue, "", "#ffffff"),
      statLabel: normalizeStyledField(rawStatLabel, "", "#ffffff"),
      statBadgeBg: typeof rawStatBadgeBg === "string" ? rawStatBadgeBg : "#E5A84B",
    },
    imageMultimedia: normalizeMultimedia(
      safeEssence.imageMultimedia || safeEssence.multimedia || emptyEssence.imageMultimedia,
      "image"
    ),
    backgroundMultimedia: normalizeMultimedia(safeEssence.backgroundMultimedia || emptyEssence.backgroundMultimedia, "color"),
  }

  delete (normalizedEssence as any).labelStyle
  delete (normalizedEssence as any).titleStyle
  delete (normalizedEssence as any).paragraphsStyle
  delete (normalizedEssence as any).quoteStyle
  delete (normalizedEssence as any).style

  return normalizedEssence
}


import { normalizeMultimedia, normalizeStyledField } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyOverview } from "./emptyOverview"

export function normalizeOverview(overview: any) {
  const safe = overview && typeof overview === "object" ? overview : {}

  const normalizedHighlights = Array.isArray(safe.highlightsList) && safe.highlightsList.length > 0
    ? safe.highlightsList.map((item: any, idx: number) => ({
        id: item.id || `hl-${idx + 1}`,
        title: normalizeStyledField(item.title ?? item, "", "#464136"),
        description: item.description || "",
        icon: item.icon || "",
      }))
    : emptyOverview.highlightsList

  const normalizedFeatures = Array.isArray(safe.featuresList) && safe.featuresList.length > 0
    ? safe.featuresList.map((f: any) => normalizeStyledField(f, "", "#464136"))
    : emptyOverview.featuresList

  return {
    ...safe,
    badge: normalizeStyledField(safe.badge ?? emptyOverview.badge, "", "#af6348"),
    title: normalizeStyledField(safe.title ?? emptyOverview.title, "", "#313131"),
    subtitle: normalizeStyledField(safe.subtitle ?? emptyOverview.subtitle, "", "#565e69"),
    overviewText: normalizeStyledField(safe.overviewText ?? emptyOverview.overviewText, "", "#464136"),
    highlightsList: normalizedHighlights,
    routeSummary: normalizeStyledField(safe.routeSummary ?? emptyOverview.routeSummary, "", "#af6348"),
    featuresList: normalizedFeatures,
    backgroundMultimedia: normalizeMultimedia(
      safe.backgroundMultimedia ?? safe.multimedia ?? emptyOverview.backgroundMultimedia
    ),
  }
}

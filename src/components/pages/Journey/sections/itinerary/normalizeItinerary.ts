import { THEME_COLORS } from "@/config/theme"
import { normalizeMultimedia, normalizeStyledField } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyItinerary } from "./emptyItinerary"

export function normalizeItinerary(itinerary: any) {
  const safe = itinerary && typeof itinerary === "object" ? itinerary : {}

  const rawChapters = Array.isArray(safe.items) && safe.items.length > 0
    ? safe.items
    : Array.isArray(safe.chapters) && safe.chapters.length > 0
    ? safe.chapters
    : Array.isArray(safe.chaptersList) && safe.chaptersList.length > 0
    ? safe.chaptersList
    : emptyItinerary.items

  const normalizedChapters = rawChapters.map((chap: any, cIdx: number) => ({
    chapterNumber: normalizeStyledField(chap.chapterNumber, `Chapter ${cIdx + 1}`, THEME_COLORS.accent),
    title: normalizeStyledField(chap.title, "", THEME_COLORS.primary),
    subtitle: normalizeStyledField(chap.subtitle, "", THEME_COLORS.secondary),
    description: normalizeStyledField(chap.description, "", THEME_COLORS.muted),
    multimedia: normalizeMultimedia(chap.multimedia ?? chap.thumbnail),
    days: Array.isArray(chap.days)
      ? chap.days.map((day: any, dIdx: number) => ({
          dayNumber: Number(day.dayNumber || day.day || dIdx + 1),
          locationId: typeof day.locationId === "string" ? day.locationId : (day.locationId?.id || (typeof day.location === "object" ? day.location?.value : day.location) || ""),
          description: normalizeStyledField(day.description, "", THEME_COLORS.navText),
        }))
      : [],
  }))

  const { chapters: _c, chaptersList: _cl, ...cleanSafe } = safe

  return {
    ...cleanSafe,
    mapTitle: normalizeStyledField(safe.mapTitle ?? emptyItinerary.mapTitle, "", THEME_COLORS.primary),
    mapSubtitle: normalizeStyledField(safe.mapSubtitle ?? emptyItinerary.mapSubtitle, "", THEME_COLORS.muted),
    badge: normalizeStyledField(safe.badge ?? emptyItinerary.badge, "", THEME_COLORS.accent),
    title: normalizeStyledField(safe.title ?? emptyItinerary.title, "", THEME_COLORS.primary),
    subtitle: normalizeStyledField(safe.subtitle ?? emptyItinerary.subtitle, "", THEME_COLORS.muted),
    description: normalizeStyledField(safe.description ?? emptyItinerary.description, "", THEME_COLORS.muted),
    items: normalizedChapters,
  }
}


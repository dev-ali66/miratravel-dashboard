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
    chapterNumber: normalizeStyledField(chap.chapterNumber, `Chapter ${cIdx + 1}`, "#af6348"),
    title: normalizeStyledField(chap.title, "", "#182d09"),
    subtitle: normalizeStyledField(chap.subtitle, "", "#235347"),
    description: normalizeStyledField(chap.description, "", "#707070"),
    multimedia: normalizeMultimedia(chap.multimedia ?? chap.thumbnail),
    days: Array.isArray(chap.days)
      ? chap.days.map((day: any, dIdx: number) => ({
          dayNumber: Number(day.dayNumber || day.day || dIdx + 1),
          locationId: typeof day.locationId === "string" ? day.locationId : (day.locationId?.id || (typeof day.location === "object" ? day.location?.value : day.location) || ""),
          description: normalizeStyledField(day.description, "", "#464136"),
        }))
      : [],
  }))

  const { chapters: _c, chaptersList: _cl, ...cleanSafe } = safe

  return {
    ...cleanSafe,
    mapTitle: normalizeStyledField(safe.mapTitle ?? emptyItinerary.mapTitle, "", "#182d09"),
    mapSubtitle: normalizeStyledField(safe.mapSubtitle ?? emptyItinerary.mapSubtitle, "", "#707070"),
    badge: normalizeStyledField(safe.badge ?? emptyItinerary.badge, "", "#af6348"),
    title: normalizeStyledField(safe.title ?? emptyItinerary.title, "", "#182d09"),
    subtitle: normalizeStyledField(safe.subtitle ?? emptyItinerary.subtitle, "", "#707070"),
    description: normalizeStyledField(safe.description ?? emptyItinerary.description, "", "#707070"),
    items: normalizedChapters,
  }
}


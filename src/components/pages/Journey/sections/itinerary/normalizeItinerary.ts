import { THEME_COLORS } from "@/config/theme"
import { normalizeStyledField } from "@/components/pages/Journey/shared/normalizeHelpers"
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

  const normalizedChapters = rawChapters.map((chap: any, cIdx: number) => {
    const rawChapterNum = chap.chapterNumber || chap.chapter_number || `Chapter ${cIdx + 1}`
    const { multimedia: _cm, chapter_number: _cn, ...restChap } = chap
    return {
      ...restChap,
      chapterNumber: normalizeStyledField(rawChapterNum, `Chapter ${cIdx + 1}`, THEME_COLORS.accent),
      title: normalizeStyledField(chap.title, "", THEME_COLORS.primary),
      subtitle: normalizeStyledField(chap.subtitle, "", THEME_COLORS.secondary),
      description: normalizeStyledField(chap.description, "", THEME_COLORS.muted),
      days: Array.isArray(chap.days)
        ? chap.days.map((day: any, dIdx: number) => {
            const dayNum = Number(day.dayNumber || day.day || dIdx + 1)
            const raw = day.locationId ?? day.location
            const item = Array.isArray(raw) ? raw[0] : raw
            const locId = typeof item === "string" ? item : (item && typeof item === "object" ? item.id || item.value || item._id || "" : "")
            const locName = typeof day.locationName === "string" && day.locationName
              ? day.locationName
              : (item && typeof item === "object" ? item.name || item.title || "" : typeof day.location === "string" && !day.location.startsWith("cm") ? day.location : "")

            const fallbackTitle = locName || `Day ${dayNum}`
            const dayTitle = day.title || fallbackTitle

            return {
              dayNumber: dayNum,
              dayLabel: day.dayLabel || `Day ${dayNum}`,
              title: normalizeStyledField(dayTitle, fallbackTitle, THEME_COLORS.primary),
              subtitle: normalizeStyledField(day.subtitle, "", THEME_COLORS.secondary),
              locationId: locId,
              locationName: locName,
              description: normalizeStyledField(day.description, "", THEME_COLORS.navText),
              stops: Array.isArray(day.stops)
                ? day.stops.map((stop: any) => {
                    const stopLocName = typeof stop.locationName === "string" ? stop.locationName : ""
                    return {
                      title: stop.title || "",
                      locationId: stop.locationId || "",
                      locationName: stopLocName,
                      description: stop.description || "",
                      stopNumber: stop.stopNumber,
                      stopLabel: stop.stopLabel,
                    }
                  })
                : [],
            }
          })
        : [],
    }
  })

  const { chapters: _c, chaptersList: _cl, mapTitle: _mt, mapSubtitle: _ms, ...cleanSafe } = safe

  return {
    ...cleanSafe,
    badge: normalizeStyledField(safe.badge ?? emptyItinerary.badge, "", THEME_COLORS.accent),
    title: normalizeStyledField(safe.title ?? emptyItinerary.title, "", THEME_COLORS.primary),
    subtitle: normalizeStyledField(safe.subtitle ?? emptyItinerary.subtitle, "", THEME_COLORS.muted),
    description: normalizeStyledField(safe.description ?? emptyItinerary.description, "", THEME_COLORS.muted),
    items: normalizedChapters,
  }
}


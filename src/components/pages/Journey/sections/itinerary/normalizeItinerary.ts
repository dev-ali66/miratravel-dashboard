import { normalizeMultimedia } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyItinerary } from "./emptyItinerary"

export function normalizeItinerary(itinerary: any) {
  const safe = itinerary && typeof itinerary === "object" ? itinerary : {}

  const normalizedChapters = Array.isArray(safe.chaptersList) && safe.chaptersList.length > 0
    ? safe.chaptersList.map((chap: any, cIdx: number) => ({
        id: chap.id || `chap-${cIdx + 1}`,
        chapterNumber: chap.chapterNumber || `Chapter ${cIdx + 1}`,
        title: chap.title || "Chapter Title",
        subtitle: chap.subtitle || "",
        description: chap.description || "",
        days: Array.isArray(chap.days)
          ? chap.days.map((day: any, dIdx: number) => ({
              id: day.id || `day-${dIdx + 1}`,
              dayNumber: Number(day.dayNumber || dIdx + 1),
              title: day.title || "Day Title",
              subtitle: day.subtitle || "",
              location: day.location || "",
              description: day.description || "",
              stayName: day.stayName || "",
              image: day.image || "",
              meals: Array.isArray(day.meals) ? day.meals : [],
              activities: Array.isArray(day.activities) ? day.activities : [],
            }))
          : [],
      }))
    : emptyItinerary.chaptersList

  return {
    ...safe,
    badge: safe.badge ?? emptyItinerary.badge,
    title: safe.title ?? emptyItinerary.title,
    description: safe.description ?? emptyItinerary.description,
    chaptersList: normalizedChapters,
    daysList: safe.daysList ?? [],
    backgroundMultimedia: normalizeMultimedia(
      safe.backgroundMultimedia ?? safe.multimedia ?? emptyItinerary.backgroundMultimedia
    ),
  }
}

import { useState, useCallback, useMemo } from "react"
import JourneyRouteMap from "./map/JourneyRouteMap"
import DayByDayItinerary from "./map/DayByDayItinerary"
import type { DerivedRouteStop } from "./map/journey-route"
import { emptyItinerary } from "./emptyItinerary"

export function ItineraryPreview({ itinerary, draft }: { itinerary?: any; draft?: any }) {
  const [activeDay, setActiveDay] = useState<number | null>(1)

  const rawItinerary = itinerary || draft?.itinerary || {}

  const mapTitleObj = rawItinerary.mapTitle || rawItinerary.title || emptyItinerary.mapTitle
  const mapSubtitleObj = rawItinerary.mapSubtitle || rawItinerary.subtitle || rawItinerary.description || emptyItinerary.mapSubtitle
  const badgeObj = rawItinerary.badge || emptyItinerary.badge

  const itineraryTitleObj = rawItinerary.title || emptyItinerary.title
  const itinerarySubtitleObj = rawItinerary.subtitle || rawItinerary.description || emptyItinerary.subtitle

  const resolvedItinerary = useMemo(() => {
    const chaptersList = rawItinerary.chapters || rawItinerary.items || rawItinerary.chaptersList
    return {
      ...rawItinerary,
      title: itineraryTitleObj,
      subtitle: itinerarySubtitleObj,
      badge: badgeObj,
      mapTitle: mapTitleObj,
      mapSubtitle: mapSubtitleObj,
      chapters: chaptersList && chaptersList.length > 0 ? chaptersList : emptyItinerary.items,
    }
  }, [rawItinerary, itineraryTitleObj, itinerarySubtitleObj, badgeObj, mapTitleObj, mapSubtitleObj])

  const handleExpandedDayChange = useCallback((day: number | null) => {
    setActiveDay((prev) => (prev === day ? prev : day))
  }, [])

  const handleStopSelect = useCallback((stop: DerivedRouteStop) => {
    const firstDay = stop.dayNumbers[0] ?? null
    if (firstDay == null) return
    setActiveDay(firstDay)
  }, [])

  return (
    <div className="w-full flex flex-col gap-10">
      <JourneyRouteMap
        itinerary={resolvedItinerary}
        titleObj={mapTitleObj}
        descriptionObj={mapSubtitleObj}
        badgeObj={badgeObj}
        activeDay={activeDay}
        onStopSelect={handleStopSelect}
      />
      <DayByDayItinerary
        itinerary={resolvedItinerary}
        titleObj={itineraryTitleObj}
        subtitleObj={itinerarySubtitleObj}
        badgeObj={badgeObj}
        expandedDay={activeDay}
        onExpandedDayChange={handleExpandedDayChange}
      />
    </div>
  )
}

import { useState, useCallback, useMemo } from "react"
import JourneyRouteMap from "./map/JourneyRouteMap"
import DayByDayItinerary from "./map/DayByDayItinerary"
import type { DerivedRouteStop } from "./map/journey-route"
import { emptyItinerary } from "./emptyItinerary"

export function ItineraryPreview({ itinerary, draft }: { itinerary?: any; draft?: any }) {
  const [activeDay, setActiveDay] = useState<number | null>(1)

  const rawItinerary = itinerary || draft?.itinerary || {}

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
      chapters: chaptersList && chaptersList.length > 0 ? chaptersList : emptyItinerary.items,
    }
  }, [rawItinerary, itineraryTitleObj, itinerarySubtitleObj, badgeObj])

  const handleExpandedDayChange = useCallback((day: number | null) => {
    setActiveDay((prev) => (prev === day ? prev : day))
  }, [])

  const handleStopSelect = useCallback((stop: DerivedRouteStop) => {
    const firstDay = stop.dayNumbers[0] ?? null
    if (firstDay == null) return
    setActiveDay(firstDay)
  }, [])

  return (
    <div className="w-full flex flex-col gap-8 md:gap-10">
      {/* Side-by-side on desktop (lg+), stacked on mobile */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-8 lgx:gap-10 xl:gap-12">
        {/* Left Column: Chapters / Days */}
        <div className="w-full lg:w-[56%] xl:w-[58%] min-w-0 self-start order-2 lg:order-1">
          <DayByDayItinerary
            itinerary={resolvedItinerary}
            titleObj={itineraryTitleObj}
            subtitleObj={itinerarySubtitleObj}
            badgeObj={badgeObj}
            expandedDay={activeDay}
            onExpandedDayChange={handleExpandedDayChange}
            className="!pt-0"
          />
        </div>

        {/* Right Column: Route Map (sticky on desktop) */}
        <div className="w-full lg:w-[44%] xl:w-[42%] shrink-0 lg:sticky lg:top-16 xl:top-20 self-start order-1 lg:order-2">
          <JourneyRouteMap
            itinerary={resolvedItinerary}
            titleObj={itineraryTitleObj}
            descriptionObj={itinerarySubtitleObj}
            badgeObj={badgeObj}
            activeDay={activeDay}
            onStopSelect={handleStopSelect}
            showHeader={false}
            showSidebar={false}
            mapHeightClassName="h-[380px] sm:h-[460px] md:h-[520px] lg:h-[620px] xl:h-[660px]"
            className="!pt-0"
          />
        </div>
      </div>
    </div>
  )
}

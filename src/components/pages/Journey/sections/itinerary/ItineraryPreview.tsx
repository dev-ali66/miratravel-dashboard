import { useState } from "react"
import { MapPin, Calendar, ChevronDown, ChevronUp, Bed } from "lucide-react"

export function ItineraryPreview({ itinerary, draft }: { itinerary?: any; draft?: any }) {
  const safeItinerary = itinerary || draft?.itinerary || {}
  const [expandedDay, setExpandedDay] = useState<number | string | null>(1)

  const chapters =
    safeItinerary.chaptersList && safeItinerary.chaptersList.length > 0
      ? safeItinerary.chaptersList
      : [
          {
            id: "chap-1",
            chapterNumber: "Chapter I",
            title: "The Beginning",
            subtitle: "Days 1–3 · Tirana & surroundings",
            days: [
              {
                id: "day-1",
                dayNumber: 1,
                title: "Arrival in Tirana & Welcome Cocktail",
                subtitle: "Private transfer & introductory dinner",
                location: "Tirana",
                description: "Arrive at Tirana airport with private transfer to your boutique hotel. Enjoy an evening welcome cocktail and traditional introductory dinner.",
                stayName: "Plaza Hotel Tirana",
                image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                meals: ["Dinner"],
                activities: ["Private Transfer", "Welcome Cocktail"],
              },
            ],
          },
        ]

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Route Summary Map Banner */}
      <div className="w-full rounded-[10px] border border-[#D8CBB8] bg-white p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-[#af6348]" />
          <div>
            <h4 className="font-serif font-semibold text-lg text-[#080c1d]">Route Overview</h4>
            <p className="text-xs md:text-sm text-[#464136]">
              {safeItinerary.badge || "Tirana · Berat · Gjirokastër · Theth · Shkodër"}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] text-xs font-semibold text-[#af6348] uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          {draft?.minDays || 9} Days Detailed Schedule
        </span>
      </div>

      {/* Day-by-Day Chapters Accordion */}
      <div className="w-full flex flex-col gap-6">
        {chapters.map((chap: any, cIdx: number) => (
          <div key={chap.id || cIdx} className="w-full flex flex-col gap-4">
            <div className="flex flex-col border-b border-[#D8CBB8] pb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#af6348]">
                {chap.chapterNumber}
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#080c1d]">
                {chap.title}
              </h3>
              {chap.subtitle && (
                <p className="text-xs md:text-sm text-[#565e69]">{chap.subtitle}</p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {(chap.days || []).map((day: any) => {
                const isExpanded = expandedDay === day.dayNumber
                return (
                  <div
                    key={day.id || day.dayNumber}
                    className="w-full rounded-[10px] border border-[#D8CBB8] bg-white overflow-hidden shadow-xs transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                      className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left hover:bg-[#FFF7EF]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="shrink-0 size-8 md:size-9 rounded-full bg-[#182d09] text-white font-serif font-bold text-sm flex items-center justify-center shadow-xs">
                          {day.dayNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-serif text-base md:text-lg font-semibold text-[#080c1d]">
                              {day.title}
                            </h4>
                            {day.location && (
                              <span className="px-2 py-0.5 rounded-xs bg-[#FAF6F0] text-[11px] font-semibold text-[#af6348] uppercase tracking-wider">
                                {day.location}
                              </span>
                            )}
                          </div>
                          {day.subtitle && (
                            <p className="text-xs text-[#565e69]">{day.subtitle}</p>
                          )}
                        </div>
                      </div>

                      <span className="text-[#464136] shrink-0">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="p-5 md:p-6 pt-0 border-t border-[#D8CBB8]/50 flex flex-col md:flex-row gap-6 items-start mt-2">
                        {day.image && (
                          <div className="w-full md:w-1/3 h-[180px] rounded-md overflow-hidden shrink-0 shadow-xs">
                            <img
                              src={day.image}
                              alt={day.title}
                              className="w-full h-full object-cover object-center"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-3">
                          <p className="text-sm text-[#464136] leading-relaxed">
                            {day.description}
                          </p>

                          {day.stayName && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#182d09] pt-1">
                              <Bed className="w-4 h-4 text-[#af6348]" />
                              <span>Stay: {day.stayName}</span>
                            </div>
                          )}

                          {day.meals && day.meals.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap text-xs text-[#565e69]">
                              <span className="font-semibold text-[#080c1d]">Meals Included:</span>
                              {day.meals.map((m: string, mIdx: number) => (
                                <span key={mIdx} className="px-2 py-0.5 rounded-xs bg-neutral-100 border border-neutral-200">
                                  {m}
                                </span>
                              ))}
                            </div>
                          )}

                          {day.activities && day.activities.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap text-xs text-[#565e69]">
                              <span className="font-semibold text-[#080c1d]">Activities:</span>
                              {day.activities.map((act: string, aIdx: number) => (
                                <span key={aIdx} className="px-2 py-0.5 rounded-xs bg-[#FFF7EF] text-[#af6348] border border-[#D8CBB8]">
                                  {act}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

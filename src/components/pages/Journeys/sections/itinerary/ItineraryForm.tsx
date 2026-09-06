/* =====================================================
   JOURNEYS — ITINERARY (DAY-BY-DAY) FORM SECTION
===================================================== */

import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  FormSection,
  JourneyInputField,
  JourneyTextareaField,
} from "../../shared/fields"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import {
  getJourneyItineraryDays,
  type Journey,
  type ItineraryDayItem,
} from "../../journeyTypes"

export type ItineraryFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function ItineraryForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: ItineraryFormProps) {
  const itineraryDays = getJourneyItineraryDays(draft)

  const [expandedDay, setExpandedDay] = useState<number | null>(0)

  const syncItinerary = (next: ItineraryDayItem[]) => {
    updateField("itineraryDays", next)
    updateField("data.itinerary", next)
  }

  const handleAddDay = () => {
    const nextDayNum = itineraryDays.length + 1
    const newDay: ItineraryDayItem = {
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum}: Exploration`,
      subtitle: "",
      description: "",
      location: "",
      meals: "Breakfast",
      accommodation: "",
      activities: [],
      images: [],
    }
    const updated = [...itineraryDays, newDay]
    syncItinerary(updated)
    setExpandedDay(updated.length - 1)
  }

  const handleUpdateDay = (index: number, field: keyof ItineraryDayItem, val: any) => {
    const updated = [...itineraryDays]
    updated[index] = { ...updated[index], [field]: val }
    syncItinerary(updated)
  }

  const handleRemoveDay = (index: number) => {
    const updated = itineraryDays
      .filter((_: ItineraryDayItem, i: number) => i !== index)
      .map((d: ItineraryDayItem, i: number) => ({ ...d, dayNumber: i + 1 }))
    syncItinerary(updated)
    if (expandedDay === index) {
      setExpandedDay(null)
    }
  }

  // Activities helper
  const handleAddActivity = (dayIndex: number) => {
    const day = itineraryDays[dayIndex]
    const nextActivities = [...(day.activities || []), ""]
    handleUpdateDay(dayIndex, "activities", nextActivities)
  }

  const handleUpdateActivity = (dayIndex: number, actIndex: number, val: string) => {
    const day = itineraryDays[dayIndex]
    const nextActivities = [...(day.activities || [])]
    nextActivities[actIndex] = val
    handleUpdateDay(dayIndex, "activities", nextActivities)
  }

  const handleRemoveActivity = (dayIndex: number, actIndex: number) => {
    const day = itineraryDays[dayIndex]
    const nextActivities = (day.activities || []).filter((_: string, i: number) => i !== actIndex)
    handleUpdateDay(dayIndex, "activities", nextActivities)
  }

  // Images helper
  const handleAddImage = (dayIndex: number) => {
    const day = itineraryDays[dayIndex]
    const nextImages = [...(day.images || []), ""]
    handleUpdateDay(dayIndex, "images", nextImages)
  }

  const handleUpdateImage = (dayIndex: number, imgIndex: number, url: string) => {
    const day = itineraryDays[dayIndex]
    const nextImages = [...(day.images || [])]
    nextImages[imgIndex] = url
    handleUpdateDay(dayIndex, "images", nextImages)
  }

  const handleRemoveImage = (dayIndex: number, imgIndex: number) => {
    const day = itineraryDays[dayIndex]
    const nextImages = (day.images || []).filter((_: string, i: number) => i !== imgIndex)
    handleUpdateDay(dayIndex, "images", nextImages)
  }

  return (
    <FormSection
      title="Day-by-Day Itinerary"
      active={!!openSections["itinerary"]}
      onClick={() => toggleSection("itinerary")}
      badge={`${itineraryDays.length} Days`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Structure your day-by-day story with meals, stays, and visuals.
          </p>
          <button
            type="button"
            onClick={handleAddDay}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Add Day
          </button>
        </div>

        <div className="space-y-3">
          {itineraryDays.map((day: ItineraryDayItem, idx: number) => {
            const isExpanded = expandedDay === idx

            return (
              <div
                key={idx}
                className={cn(
                  "rounded-xl border transition-all bg-background",
                  isExpanded ? "border-primary/50 shadow-sm" : "border-border/70"
                )}
              >
                {/* Accordion header */}
                <div
                  onClick={() => setExpandedDay(isExpanded ? null : idx)}
                  className="flex items-center justify-between p-3 cursor-pointer select-none hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                      {day.dayNumber || idx + 1}
                    </span>
                    <div className="truncate">
                      <span className="text-xs font-semibold text-foreground truncate block">
                        {day.title || `Day ${idx + 1}`}
                      </span>
                      {day.location && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {day.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveDay(idx)
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive transition"
                      title="Delete day"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Day expanded content */}
                {isExpanded && (
                  <div className="p-3.5 pt-1 border-t border-border/50 space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-1">
                        <JourneyInputField
                          label="Day #"
                          type="number"
                          value={day.dayNumber || idx + 1}
                          onChange={(val) => handleUpdateDay(idx, "dayNumber", val)}
                          min={1}
                        />
                      </div>
                      <div className="col-span-3">
                        <JourneyInputField
                          label="Title"
                          value={day.title}
                          onChange={(val) => handleUpdateDay(idx, "title", val)}
                          placeholder="e.g. Arrive in Tirana & Historic BunkArt Traverse"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <JourneyInputField
                        label="Location / Region"
                        value={day.location ?? ""}
                        onChange={(val) => handleUpdateDay(idx, "location", val)}
                        placeholder="e.g. Tirana"
                      />
                      <JourneyInputField
                        label="Subtitle / Route"
                        value={day.subtitle ?? ""}
                        onChange={(val) => handleUpdateDay(idx, "subtitle", val)}
                        placeholder="e.g. Tirana to Lake Shkodra"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <JourneyInputField
                        label="Meals Included"
                        value={day.meals ?? ""}
                        onChange={(val) => handleUpdateDay(idx, "meals", val)}
                        placeholder="e.g. Breakfast, Lunch, Dinner"
                      />
                      <JourneyInputField
                        label="Overnight Accommodation"
                        value={day.accommodation ?? ""}
                        onChange={(val) => handleUpdateDay(idx, "accommodation", val)}
                        placeholder="e.g. The Plaza Tirana"
                      />
                    </div>

                    <JourneyTextareaField
                      label="Day Story & Description"
                      value={day.description ?? ""}
                      onChange={(val) => handleUpdateDay(idx, "description", val)}
                      rows={4}
                      placeholder="Detailed itinerary narrative for this day..."
                    />

                    {/* Activities */}
                    <div className="space-y-2 pt-1 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground">
                          Key Activities / Highlights
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddActivity(idx)}
                          className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                        >
                          <Plus className="h-3 w-3" /> Add Activity
                        </button>
                      </div>

                      {(day.activities || []).map((act: string, actIdx: number) => (
                        <div key={actIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={act}
                            onChange={(e) =>
                              handleUpdateActivity(idx, actIdx, e.target.value)
                            }
                            placeholder="e.g. Private architecture walk through Blloku"
                            className="flex-1 rounded-md border border-border/70 bg-background px-2.5 py-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(idx, actIdx)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Images */}
                    <div className="space-y-2 pt-1 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground">
                          Day Photos ({(day.images || []).length})
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddImage(idx)}
                          className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                        >
                          <Plus className="h-3 w-3" /> Add Image
                        </button>
                      </div>

                      {(day.images || []).map((imgUrl: string, imgIdx: number) => (
                        <div key={imgIdx} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">Photo {imgIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx, imgIdx)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <ImageUploadField
                            label=""
                            value={imgUrl}
                            onChange={(url) => handleUpdateImage(idx, imgIdx, url || "")}
                            fieldName={`itinerary_day_${idx + 1}_img_${imgIdx + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </FormSection>
  )
}

import type { JourneyData, ItineraryChapter, ItineraryDayItem } from "../../journeyTypes"
import { FormSection, Field, ImageField } from "../../shared/fields"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2, CalendarDays, BookOpen } from "lucide-react"

interface ItineraryFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function ItineraryForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: ItineraryFormProps) {
  const isOpen = Boolean(openSections["itinerary"])
  const itineraryData = draft.itinerary || {}
  const chaptersList: ItineraryChapter[] = itineraryData.chaptersList || []
  const daysList: ItineraryDayItem[] = itineraryData.daysList || []

  // Chapter Operations
  const addChapter = () => {
    const nextChapterNum = chaptersList.length + 1
    const RomanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
    const romanStr = RomanNumerals[nextChapterNum - 1] || `${nextChapterNum}`
    const newChapter: ItineraryChapter = {
      id: `chap-${Date.now()}`,
      chapterNumber: `Chapter ${romanStr}`,
      title: `Chapter ${nextChapterNum} Title`,
      subtitle: `Days ${nextChapterNum} · Highlight Region`,
      description: "Chapter narrative background...",
      days: [
        {
          id: `day-${Date.now()}-1`,
          dayNumber: 1,
          title: "Day Highlights Title",
          subtitle: "Highlights & Transfers",
          duration: "Full Day",
          location: "Destination",
          description: "Detailed daily description narrative...",
          meals: ["Breakfast", "Dinner"],
          activities: ["Guided Tour"],
          stayName: "Boutique Heritage Hotel",
        },
      ],
    }
    updateField("itinerary.chaptersList", [...chaptersList, newChapter])
  }

  const removeChapter = (chapIdx: number) => {
    updateField(
      "itinerary.chaptersList",
      chaptersList.filter((_, i) => i !== chapIdx)
    )
  }

  const addDayToChapter = (chapIdx: number) => {
    const chap = chaptersList[chapIdx]
    const currentDays = chap.days || []
    const nextDayNum = currentDays.length + 1
    const newDay: ItineraryDayItem = {
      id: `day-${Date.now()}`,
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum}: Exploring New Horizons`,
      subtitle: "Highlights & Transfers",
      duration: "Full Day",
      location: "Destination",
      description: "Daily narrative description...",
      meals: ["Breakfast", "Dinner"],
      activities: ["Guided Tour"],
      stayName: "Luxury Boutique Stay",
    }
    const updatedChap = { ...chap, days: [...currentDays, newDay] }
    const updatedList = [...chaptersList]
    updatedList[chapIdx] = updatedChap
    updateField("itinerary.chaptersList", updatedList)
  }

  const removeDayFromChapter = (chapIdx: number, dayIdx: number) => {
    const chap = chaptersList[chapIdx]
    const updatedDays = (chap.days || []).filter((_, i) => i !== dayIdx)
    const updatedChap = { ...chap, days: updatedDays }
    const updatedList = [...chaptersList]
    updatedList[chapIdx] = updatedChap
    updateField("itinerary.chaptersList", updatedList)
  }

  // Standalone Days Operations (if no chapters used)
  const addDay = () => {
    const nextDayNum = daysList.length + 1
    const newDay: ItineraryDayItem = {
      id: `day-${Date.now()}`,
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum}: Exploring New Horizons`,
      subtitle: "Highlights & Transfers",
      duration: "Full Day",
      location: "Destination",
      description: "Day description narrative...",
      meals: ["Breakfast", "Dinner"],
      activities: ["Guided Tour"],
      stayName: "Luxury Boutique Stay",
    }
    updateField("itinerary.daysList", [...daysList, newDay])
  }

  const removeDay = (index: number) => {
    updateField(
      "itinerary.daysList",
      daysList.filter((_, i) => i !== index)
    )
  }

  return (
    <FormSection
      title="Day-by-Day Itinerary Builder"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("itinerary")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Badge Text"
          value={itineraryData.badge || ""}
          onChange={(val) => updateField("itinerary.badge", val)}
          placeholder="e.g. Day by Day"
        />

        <Field
          label="Section Title"
          value={itineraryData.title || ""}
          onChange={(val) => updateField("itinerary.title", val)}
          placeholder="e.g. Crafted Itinerary"
        />
      </div>

      <Field
        label="Itinerary Section Description"
        value={itineraryData.description || ""}
        onChange={(val) => updateField("itinerary.description", val)}
        multiline
        rows={2}
      />

      {/* CHAPTERS BUILDER */}
      <div className="space-y-6 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
              Chapter Narrative Structure ({chaptersList.length} Chapters)
            </label>
            <p className="text-xs text-muted-foreground">
              MIRA Editorial Chapter Hierarchy: JOURNEY → CHAPTERS → DAYS
            </p>
          </div>

          <button
            type="button"
            onClick={addChapter}
            className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Chapter
          </button>
        </div>

        {chaptersList.map((chap, cIdx) => (
          <div
            key={chap.id || cIdx}
            className="rounded-xl border-2 border-primary/20 bg-card p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <span className="text-xs font-extrabold text-primary uppercase tracking-widest flex items-center gap-2">
                <span className="rounded bg-primary/10 px-2 py-0.5">
                  {chap.chapterNumber || `Chapter ${cIdx + 1}`}
                </span>
                {chap.title}
              </span>

              <button
                type="button"
                onClick={() => removeChapter(cIdx)}
                className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
                title="Remove Chapter"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field
                label="Chapter Label/Number"
                value={chap.chapterNumber}
                onChange={(val) =>
                  updateField(`itinerary.chaptersList.${cIdx}.chapterNumber`, val)
                }
                placeholder="e.g. Chapter I"
              />

              <Field
                label="Chapter Title"
                value={chap.title}
                onChange={(val) =>
                  updateField(`itinerary.chaptersList.${cIdx}.title`, val)
                }
                placeholder="e.g. The Beginning"
              />

              <Field
                label="Chapter Subtitle"
                value={chap.subtitle || ""}
                onChange={(val) =>
                  updateField(`itinerary.chaptersList.${cIdx}.subtitle`, val)
                }
                placeholder="e.g. Days 1–3 · Tirana & surroundings"
              />
            </div>

            <Field
              label="Chapter Overview Narrative"
              value={chap.description || ""}
              onChange={(val) =>
                updateField(`itinerary.chaptersList.${cIdx}.description`, val)
              }
              multiline
              rows={2}
            />

            {/* DAYS INSIDE THIS CHAPTER */}
            <div className="space-y-3 pt-3 border-t border-border/30 pl-2 md:pl-4 border-l-2 border-primary/30">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" />
                  Days in {chap.chapterNumber || `Chapter ${cIdx + 1}`} ({(chap.days || []).length})
                </label>

                <button
                  type="button"
                  onClick={() => addDayToChapter(cIdx)}
                  className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add Day to Chapter
                </button>
              </div>

              {(chap.days || []).map((day, dIdx) => (
                <div
                  key={day.id || dIdx}
                  className="rounded-lg border border-border/60 bg-muted/30 p-3.5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/30">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      Day {day.dayNumber || dIdx + 1}: {day.title}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeDayFromChapter(cIdx, dIdx)}
                      className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
                      title="Remove Day"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Field
                      label="Day Number"
                      type="number"
                      value={day.dayNumber || dIdx + 1}
                      onChange={(val) =>
                        updateField(
                          `itinerary.chaptersList.${cIdx}.days.${dIdx}.dayNumber`,
                          Number(val)
                        )
                      }
                    />

                    <Field
                      label="Day Title"
                      value={day.title}
                      onChange={(val) =>
                        updateField(`itinerary.chaptersList.${cIdx}.days.${dIdx}.title`, val)
                      }
                    />

                    <Field
                      label="Location / Region"
                      value={day.location || ""}
                      onChange={(val) =>
                        updateField(`itinerary.chaptersList.${cIdx}.days.${dIdx}.location`, val)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field
                      label="Subtitle"
                      value={day.subtitle || ""}
                      onChange={(val) =>
                        updateField(`itinerary.chaptersList.${cIdx}.days.${dIdx}.subtitle`, val)
                      }
                    />

                    <Field
                      label="Overnight Stay / Hotel Name"
                      value={day.stayName || ""}
                      onChange={(val) =>
                        updateField(`itinerary.chaptersList.${cIdx}.days.${dIdx}.stayName`, val)
                      }
                    />
                  </div>

                  <Field
                    label="Detailed Narrative"
                    value={day.description || ""}
                    onChange={(val) =>
                      updateField(
                        `itinerary.chaptersList.${cIdx}.days.${dIdx}.description`,
                        val
                      )
                    }
                    multiline
                    rows={2}
                  />

                  <ImageField
                    label="Day Image URL"
                    value={day.image || ""}
                    onChange={(url) =>
                      updateField(`itinerary.chaptersList.${cIdx}.days.${dIdx}.image`, url)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Standalone Days List (Fallback/Alternative) */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-primary" />
            Standalone Days List ({daysList.length})
          </label>

          <button
            type="button"
            onClick={addDay}
            className="flex items-center gap-1 rounded bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Standalone Day
          </button>
        </div>

        {daysList.map((day, idx) => (
          <div
            key={day.id || idx}
            className="rounded-xl border border-border/70 bg-card p-4 space-y-3 relative shadow-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Day {day.dayNumber || idx + 1}
              </span>

              <button
                type="button"
                onClick={() => removeDay(idx)}
                className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
                title="Remove Day"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field
                label="Day Number"
                type="number"
                value={day.dayNumber || idx + 1}
                onChange={(val) => updateField(`itinerary.daysList.${idx}.dayNumber`, Number(val))}
              />

              <Field
                label="Day Title"
                value={day.title}
                onChange={(val) => updateField(`itinerary.daysList.${idx}.title`, val)}
              />

              <Field
                label="Location / Region"
                value={day.location || ""}
                onChange={(val) => updateField(`itinerary.daysList.${idx}.location`, val)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field
                label="Subtitle / Catchphrase"
                value={day.subtitle || ""}
                onChange={(val) => updateField(`itinerary.daysList.${idx}.subtitle`, val)}
              />

              <Field
                label="Overnight Stay / Hotel Name"
                value={day.stayName || ""}
                onChange={(val) => updateField(`itinerary.daysList.${idx}.stayName`, val)}
              />
            </div>

            <Field
              label="Detailed Narrative"
              value={day.description || ""}
              onChange={(val) => updateField(`itinerary.daysList.${idx}.description`, val)}
              multiline
              rows={3}
            />

            <ImageField
              label="Day Image URL"
              value={day.image || day.imageMultimedia?.url || ""}
              onChange={(url) => {
                updateField(`itinerary.daysList.${idx}.image`, url)
                updateField(`itinerary.daysList.${idx}.imageMultimedia`, { show: "image", image: { url } })
              }}
            />
          </div>
        ))}
      </div>

      {/* Mandatory Section Background Multimedia */}
      <div className="pt-4 border-t border-border/40">
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">
          Itinerary Section Background Multimedia
        </label>
        <UniversalMultimediaForm
          value={itineraryData.backgroundMultimedia || { show: "color", color: { color: "#FAF6F0" } }}
          onChange={(val) => updateField("itinerary.backgroundMultimedia", val)}
        />
      </div>
    </FormSection>
  )
}


import { useState } from "react"
import type { JourneyData } from "../../journeyTypes"
import { FormSection } from "../../shared/fields"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { ParentLocationSelect } from "@/components/pages/Location/shared/ParentLocationSelect"
import { Plus, Trash2, CalendarDays, BookOpen, MapPin, ChevronUp, ChevronDown } from "lucide-react"

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
  const chaptersList: any[] =
    itineraryData.items || itineraryData.chapters || itineraryData.chaptersList || []

  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({})
  const [openStops, setOpenStops] = useState<Record<string, boolean>>({})

  const toggleChapterOpen = (idx: number) => {
    setOpenChapters((prev) => {
      const isCurrentlyOpen = Boolean(prev[idx])
      return isCurrentlyOpen ? {} : { [idx]: true }
    })
  }

  const toggleStopOpen = (chapIdx: number, dayIdx: number) => {
    const key = `${chapIdx}-${dayIdx}`
    setOpenStops((prev) => {
      const isCurrentlyOpen = Boolean(prev[key])
      return isCurrentlyOpen ? {} : { [key]: true }
    })
  }

  const syncChapters = (nextList: any[]) => {
    updateField("itinerary.items", nextList)
  }

  // Move Chapter Up/Down
  const moveChapter = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= chaptersList.length) return
    const nextList = [...chaptersList]
    const [removed] = nextList.splice(fromIdx, 1)
    nextList.splice(toIdx, 0, removed)
    syncChapters(nextList)
  }

  // Move Day/Location Stop Up/Down in Chapter
  const moveDayInChapter = (chapIdx: number, fromIdx: number, toIdx: number) => {
    const chap = chaptersList[chapIdx]
    const days = chap.days || []
    if (toIdx < 0 || toIdx >= days.length) return
    const nextDays = [...days]
    const [removed] = nextDays.splice(fromIdx, 1)
    nextDays.splice(toIdx, 0, removed)
    const updatedChap = { ...chap, days: nextDays }
    const nextList = [...chaptersList]
    nextList[chapIdx] = updatedChap
    syncChapters(nextList)
  }

  // Chapter Operations
  const addChapter = () => {
    const nextChapterNum = chaptersList.length + 1
    const RomanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
    const romanStr = RomanNumerals[nextChapterNum - 1] || `${nextChapterNum}`
    const newChapter = {
      chapterNumber: { value: `Chapter ${romanStr}`, textColor: "#af6348", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      title: { value: `Chapter ${nextChapterNum} Title`, textColor: "#182d09", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      subtitle: { value: `Days ${nextChapterNum} · Highlight Region`, textColor: "#235347", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      description: { value: "Chapter narrative background...", textColor: "#707070", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      multimedia: {
        show: "image",
        image: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
        video: { url: "", alt: "", autoplay: true, loop: true, muted: true, opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
        color: { color: "#ffffff", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
      },
      days: [
        {
          dayNumber: 1,
          locationId: "",
          description: { value: "Detailed daily description narrative...", textColor: "#464136", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
        },
      ],
    }
    const nextList = [...chaptersList, newChapter]
    syncChapters(nextList)
    setOpenChapters({ [nextList.length - 1]: true })
  }

  const removeChapter = (chapIdx: number) => {
    const nextList = chaptersList.filter((_, i) => i !== chapIdx)
    syncChapters(nextList)
  }

  const addDayToChapter = (chapIdx: number) => {
    const chap = chaptersList[chapIdx]
    const currentDays = chap.days || []
    const nextDayNum = currentDays.length + 1
    const newDay = {
      dayNumber: nextDayNum,
      locationId: "",
      description: { value: "Daily narrative description...", textColor: "#464136", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
    }
    const updatedChap = { ...chap, days: [...currentDays, newDay] }
    const updatedList = [...chaptersList]
    updatedList[chapIdx] = updatedChap
    syncChapters(updatedList)
    setOpenStops({ [`${chapIdx}-${currentDays.length}`]: true })
  }

  const removeDayFromChapter = (chapIdx: number, dayIdx: number) => {
    const chap = chaptersList[chapIdx]
    const updatedDays = (chap.days || []).filter((_: any, i: number) => i !== dayIdx)
    const updatedChap = { ...chap, days: updatedDays }
    const updatedList = [...chaptersList]
    updatedList[chapIdx] = updatedChap
    syncChapters(updatedList)
  }

  return (
    <FormSection
      title="Day-by-Day Itinerary Builder"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("itinerary")}
    >
      <div className="flex flex-col gap-6">
        {/* SECTION 1: ROUTE MAP HEADER CMS */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              1. Route Map Section Header CMS
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <DynamicStyledField
              type="text"
              label="Route Map Title"
              fieldName="itinerary.mapTitle"
              placeholder="e.g. Classic Albania Itinerary"
              value={itineraryData.mapTitle}
              onChange={(val) => updateField("itinerary.mapTitle", val)}
            />

            <DynamicStyledField
              type="text"
              label="Country Badge / Subtitle"
              fieldName="itinerary.badge"
              placeholder="e.g. Albania · Mediterranean"
              value={itineraryData.badge}
              onChange={(val) => updateField("itinerary.badge", val)}
            />
          </div>

          <DynamicStyledField
            type="text"
            label="Route Map Subtitle / Description"
            fieldName="itinerary.mapSubtitle"
            placeholder="e.g. Explore UNESCO heritage sites, Ottoman stone cities, and Riviera coastlines."
            value={itineraryData.mapSubtitle}
            onChange={(val) => updateField("itinerary.mapSubtitle", val)}
          />
        </div>

        {/* SECTION 2: DAY-BY-DAY ITINERARY HEADER CMS */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              2. Day-by-Day Itinerary Header CMS
            </span>
          </div>

          <DynamicStyledField
            type="text"
            label="Itinerary Title"
            fieldName="itinerary.title"
            placeholder="e.g. Classic Albania Itinerary"
            value={itineraryData.title}
            onChange={(val) => updateField("itinerary.title", val)}
          />

          <DynamicStyledField
            type="text"
            label="Itinerary Subtitle / Description"
            fieldName="itinerary.subtitle"
            placeholder="e.g. Explore UNESCO heritage sites, Ottoman stone cities, and Riviera coastlines."
            value={itineraryData.subtitle}
            onChange={(val) => updateField("itinerary.subtitle", val)}
          />
        </div>

        {/* CHAPTERS BUILDER */}
        <div className="space-y-6 pt-4 border-t border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
                Chapter Narrative Structure ({chaptersList.length} Chapters)
              </label>
              <p className="text-xs text-muted-foreground">
                MIRA Editorial Chapter Hierarchy: JOURNEY → CHAPTERS → LOCATION STOPS / DAYS
              </p>
            </div>

            <button
              type="button"
              onClick={addChapter}
              className="flex items-center gap-1 rounded bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add Chapter
            </button>
          </div>

          {chaptersList.map((chap: any, cIdx: number) => {
            const isChapOpen = Boolean(openChapters[cIdx])
            return (
              <div
                key={cIdx}
                className="rounded-xl border-2 border-primary/20 bg-card p-4 md:p-5 space-y-4 shadow-sm"
              >
                {/* Chapter Top Bar (Collapsible Header) */}
                <div
                  className="flex items-center justify-between pb-2 border-b border-border/50 cursor-pointer select-none"
                  onClick={() => toggleChapterOpen(cIdx)}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xs font-extrabold text-primary uppercase tracking-widest flex items-center gap-2 truncate">
                      <span className="rounded bg-primary/10 px-2 py-0.5 shrink-0">
                        {typeof chap.chapterNumber === "object" ? chap.chapterNumber?.value : chap.chapterNumber || `Chapter ${cIdx + 1}`}
                      </span>
                      <span className="truncate">
                        {typeof chap.title === "object" ? chap.title?.value : chap.title}
                      </span>
                    </span>
                    <span className="text-[11px] text-muted-foreground shrink-0 font-normal">
                      ({(chap.days || []).length} stops)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => moveChapter(cIdx, cIdx - 1)}
                      disabled={cIdx === 0}
                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move Chapter Up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveChapter(cIdx, cIdx + 1)}
                      disabled={cIdx === chaptersList.length - 1}
                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move Chapter Down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeChapter(cIdx)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer ml-1"
                      title="Remove Chapter"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleChapterOpen(cIdx)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer ml-1"
                      title={isChapOpen ? "Collapse Chapter" : "Expand Chapter"}
                    >
                      {isChapOpen ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Chapter Body */}
                {isChapOpen && (
                  <div className="space-y-4 pt-1">
                    {/* Chapter Fields */}
                    <div className="flex flex-col gap-3">
                      <DynamicStyledField
                        type="text"
                        label="Chapter Label/Number"
                        fieldName={`itinerary.items.${cIdx}.chapterNumber`}
                        placeholder="e.g. Chapter I"
                        value={chap.chapterNumber}
                        onChange={(val) => updateField(`itinerary.items.${cIdx}.chapterNumber`, val)}
                      />

                      <DynamicStyledField
                        type="text"
                        label="Chapter Title"
                        fieldName={`itinerary.items.${cIdx}.title`}
                        placeholder="e.g. Ottoman Stone & Wine Valleys"
                        value={chap.title}
                        onChange={(val) => updateField(`itinerary.items.${cIdx}.title`, val)}
                      />

                      <DynamicStyledField
                        type="text"
                        label="Chapter Subtitle / Day Range"
                        fieldName={`itinerary.items.${cIdx}.subtitle`}
                        placeholder="e.g. Days 1–3 · Tirana, Berat & Gjirokastër"
                        value={chap.subtitle}
                        onChange={(val) => updateField(`itinerary.items.${cIdx}.subtitle`, val)}
                      />
                    </div>

                    <DynamicStyledField
                      type="richtext"
                      label="Chapter Overview Narrative"
                      fieldName={`itinerary.items.${cIdx}.description`}
                      placeholder="Discover the vibrant capital Tirana before journeying into the Thousand Windows..."
                      value={chap.description}
                      onChange={(val) => updateField(`itinerary.items.${cIdx}.description`, val)}
                    />

                    {/* Chapter Feature Image / Multimedia */}
                    <div className="space-y-2 pt-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                        Chapter Feature Image / Multimedia (Left Card Media)
                      </label>
                      <UniversalMultimediaForm
                        value={chap.multimedia || { show: "image", image: { url: typeof chap.thumbnail === "string" ? chap.thumbnail : "" } }}
                        onChange={(val) => updateField(`itinerary.items.${cIdx}.multimedia`, val)}
                      />
                    </div>

                    {/* Location Stops / Days inside Chapter */}
                    <div className="space-y-4 pt-4 border-t border-border/30 pl-2 md:pl-4 border-l-2 border-primary/30">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 min-w-0">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">Location Stops & Days ({(chap.days || []).length})</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => addDayToChapter(cIdx)}
                          className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Stop
                        </button>
                      </div>

                      {(chap.days || []).map((day: any, dIdx: number) => {
                        const stopKey = `${cIdx}-${dIdx}`
                        const isStopOpen = Boolean(openStops[stopKey])

                        return (
                          <div
                            key={dIdx}
                            className="rounded-lg border border-border/60 bg-muted/30 p-3.5 space-y-3 shadow-xs"
                          >
                            <div
                              className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pb-1 border-b border-border/30 cursor-pointer select-none"
                              onClick={() => toggleStopOpen(cIdx, dIdx)}
                            >
                              <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 min-w-0 flex-1">
                                <span className="rounded bg-primary/10 px-1.5 py-0.5 whitespace-nowrap shrink-0">
                                  Stop {dIdx + 1} · Day {day.dayNumber || dIdx + 1}
                                </span>
                                {day.locationId && (
                                  <span className="text-muted-foreground font-mono text-[9px] truncate max-w-[120px]" title={`ID: ${day.locationId}`}>
                                    ({day.locationId})
                                  </span>
                                )}
                              </span>

                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => moveDayInChapter(cIdx, dIdx, dIdx - 1)}
                                  disabled={dIdx === 0}
                                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                  title="Move Stop Up"
                                >
                                  <ChevronUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveDayInChapter(cIdx, dIdx, dIdx + 1)}
                                  disabled={dIdx === (chap.days || []).length - 1}
                                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                  title="Move Stop Down"
                                >
                                  <ChevronDown className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeDayFromChapter(cIdx, dIdx)}
                                  className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer ml-1"
                                  title="Remove Stop"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleStopOpen(cIdx, dIdx)}
                                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer ml-1"
                                  title={isStopOpen ? "Collapse Stop" : "Expand Stop"}
                                >
                                  {isStopOpen ? <ChevronUp className="h-3.5 w-3.5 text-primary" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            </div>

                            {isStopOpen && (
                              <div className="space-y-3 pt-1">
                                <div className="flex flex-col gap-3">
                                  <DynamicStyledField
                                    type="number"
                                    label="Day Number"
                                    fieldName={`itinerary.items.${cIdx}.days.${dIdx}.dayNumber`}
                                    enableStyle={false}
                                    value={day.dayNumber ?? dIdx + 1}
                                    onChange={(val) => {
                                      const raw = typeof val === "object" && val !== null && "value" in val ? val.value : val
                                      const num = raw === "" ? dIdx + 1 : Number(raw)
                                      updateField(`itinerary.items.${cIdx}.days.${dIdx}.dayNumber`, Number.isNaN(num) ? dIdx + 1 : num)
                                    }}
                                  />

                                  <ParentLocationSelect
                                    value={day.locationId || ""}
                                    currentName={day.locationId}
                                    label="Location / Region (DB Search Picker)"
                                    noneLabel="Select Location ID..."
                                    onChange={(locId) => {
                                      updateField(`itinerary.items.${cIdx}.days.${dIdx}.locationId`, locId || "")
                                    }}
                                  />
                                </div>

                                <DynamicStyledField
                                  type="richtext"
                                  label="Detailed Daily Description"
                                  fieldName={`itinerary.items.${cIdx}.days.${dIdx}.description`}
                                  placeholder="Write detailed daily narrative description..."
                                  value={day.description}
                                  onChange={(val) => updateField(`itinerary.items.${cIdx}.days.${dIdx}.description`, val)}
                                />
                              </div>
                            )}
                          </div>
                        )
                      })}
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

import { THEME_COLORS } from "@/config/theme"
import { useState } from "react"
import type { JourneyData } from "../../journeyTypes"
import { FormSection } from "../../shared/fields"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { ParentLocationSelect } from "@/components/pages/Location/shared/ParentLocationSelect"
import { Plus, Trash2, CalendarDays, BookOpen, MapPin, ChevronUp, ChevronDown } from "lucide-react"
import { toRomanNumeral } from "./map/chapters"

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
    // Re-index all days and stops sequentially across chapters based on array position
    let globalDayCounter = 1
    let globalStopCounter = 1
    const reindexedList = nextList.map((chap: any) => {
      const days = (chap.days || []).map((day: any) => {
        const assignedDay = globalDayCounter++
        const stops = (day.stops || []).map((stop: any) => {
          const assignedStop = globalStopCounter++
          return {
            ...stop,
            stopNumber: assignedStop,
            stopLabel: `Stop ${assignedStop}`,
          }
        })
        const {
          thumbnail: _dt,
          multimedia: _dm,
          location: _dl,
          images: _di,
          coordinates: _dc,
          country: _dco,
          chapter_number: _dcn,
          ...restDay
        } = day
        return {
          ...restDay,
          dayNumber: assignedDay,
          dayLabel: `Day ${assignedDay}`,
          locationName: day.locationName || "",
          stops,
        }
      })
      const { chapter_number: _cn, multimedia: _cm, ...restChap } = chap
      return {
        ...restChap,
        days,
      }
    })
    updateField("itinerary.items", reindexedList)
  }

  // Move Chapter Up/Down
  const moveChapter = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= chaptersList.length) return
    const nextList = [...chaptersList]
    const [removed] = nextList.splice(fromIdx, 1)
    nextList.splice(toIdx, 0, removed)
    syncChapters(nextList)
    setOpenChapters({ [toIdx]: true })
  }

  // Move Day Up/Down in Chapter
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
    setOpenStops({ [`${chapIdx}-${toIdx}`]: true })
  }

  // Move Stop Up/Down in Day
  const moveStopInDay = (chapIdx: number, dayIdx: number, fromIdx: number, toIdx: number) => {
    const chap = chaptersList[chapIdx]
    const day = (chap.days || [])[dayIdx]
    if (!day) return
    const stops = day.stops || []
    if (toIdx < 0 || toIdx >= stops.length) return
    const nextStops = [...stops]
    const [removed] = nextStops.splice(fromIdx, 1)
    nextStops.splice(toIdx, 0, removed)

    const updatedDay = { ...day, stops: nextStops }
    const nextDays = [...(chap.days || [])]
    nextDays[dayIdx] = updatedDay

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
      chapterNumber: { value: `Chapter ${romanStr}`, textColor: THEME_COLORS.accent, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      title: { value: `Chapter ${nextChapterNum} Title`, textColor: THEME_COLORS.primary, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      subtitle: { value: `Days ${nextChapterNum} · Highlight Region`, textColor: THEME_COLORS.secondary, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      description: { value: "Chapter narrative background...", textColor: THEME_COLORS.muted, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      days: [
        {
          locationId: "",
          description: { value: "Detailed daily description narrative...", textColor: THEME_COLORS.navText, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
          stops: [],
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
    const newDay = {
      locationId: "",
      description: { value: "Daily narrative description...", textColor: THEME_COLORS.navText, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      stops: [],
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

  // Stop Operations inside a Day
  const addStopToDay = (chapIdx: number, dayIdx: number) => {
    const chap = chaptersList[chapIdx]
    const day = (chap.days || [])[dayIdx]
    if (!day) return
    const currentStops = day.stops || []
    const newStop = {
      title: "",
      locationId: "",
      description: { value: "", textColor: THEME_COLORS.navText, textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
    }
    const updatedDay = { ...day, stops: [...currentStops, newStop] }
    const nextDays = [...(chap.days || [])]
    nextDays[dayIdx] = updatedDay

    const updatedChap = { ...chap, days: nextDays }
    const nextList = [...chaptersList]
    nextList[chapIdx] = updatedChap
    syncChapters(nextList)
  }

  const removeStopFromDay = (chapIdx: number, dayIdx: number, stopIdx: number) => {
    const chap = chaptersList[chapIdx]
    const day = (chap.days || [])[dayIdx]
    if (!day) return
    const updatedStops = (day.stops || []).filter((_: any, i: number) => i !== stopIdx)
    const updatedDay = { ...day, stops: updatedStops }
    const nextDays = [...(chap.days || [])]
    nextDays[dayIdx] = updatedDay

    const updatedChap = { ...chap, days: nextDays }
    const nextList = [...chaptersList]
    nextList[chapIdx] = updatedChap
    syncChapters(nextList)
  }

  return (
    <FormSection
      title="Day-by-Day Itinerary Builder"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("itinerary")}
    >
      <div className="flex flex-col gap-1">
        {/* ITINERARY HEADER CMS */}
        <div className="rounded-md border border-border/60 bg-muted/20 px-2 py-2 space-y-1">
          <div className="flex items-center gap-2 pb-1 border-b border-border/40">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Itinerary Section Header CMS
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <DynamicStyledField
              type="text"
              label="Country / Region Badge"
              fieldName="itinerary.badge"
              placeholder="e.g. ALBANIA or 12 DAYS EXCURSION"
              value={itineraryData.badge}
              onChange={(val) => updateField("itinerary.badge", val)}
            />

            <DynamicStyledField
              type="text"
              label="Itinerary Title"
              fieldName="itinerary.title"
              placeholder="e.g. Day by Day Itinerary"
              value={itineraryData.title}
              onChange={(val) => updateField("itinerary.title", val)}
            />

            <DynamicStyledField
              type="text"
              label="Itinerary Subtitle / Description"
              fieldName="itinerary.subtitle"
              placeholder="e.g. Click on each day to reveal more details and experiences."
              value={itineraryData.subtitle}
              onChange={(val) => updateField("itinerary.subtitle", val)}
            />
          </div>
        </div>

        {/* CHAPTERS BUILDER */}
        <div className="space-y-1 pt-1 border-t border-border/40">
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
                className="rounded-md border-2 border-primary/20 bg-card px-2 py-1.5 md:px-2.5 md:py-2 space-y-1 shadow-sm"
              >
                {/* Chapter Top Bar (Collapsible Header) */}
                <div
                  className="flex items-center justify-between pb-1 border-b border-border/50 cursor-pointer select-none"
                  onClick={() => toggleChapterOpen(cIdx)}
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="text-xs font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5 truncate">
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 shrink-0">
                        {toRomanNumeral(cIdx + 1).toUpperCase().startsWith("CHAPTER") ? toRomanNumeral(cIdx + 1) : `CHAPTER ${toRomanNumeral(cIdx + 1)}`}
                      </span>
                      <span className="truncate">
                        {typeof chap.title === "object" ? chap.title?.value : chap.title}
                      </span>
                    </span>
                    <span className="text-[11px] text-muted-foreground shrink-0 font-normal">
                      ({(chap.days || []).length} days)
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
                  <div className="space-y-1 pt-1">
                    {/* Chapter Fields */}
                    <div className="flex flex-col gap-1">
                      <DynamicStyledField
                        type="text"
                        label="Chapter Title"
                        fieldName={`itinerary.items.${cIdx}.title`}
                        placeholder="e.g. Ottoman Stone & Wine Valleys"
                        value={chap.title}
                        onChange={(val) => updateField(`itinerary.items.${cIdx}.title`, val)}
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

                    {/* Days inside Chapter */}
                    <div className="space-y-1 pt-1 border-t border-border/30 pl-1 md:pl-1.5 border-l-2 border-primary/30">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 min-w-0">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">Itinerary Days ({(chap.days || []).length})</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => addDayToChapter(cIdx)}
                          className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Day
                        </button>
                      </div>

                      {(chap.days || []).map((day: any, dIdx: number) => {
                        const stopKey = `${cIdx}-${dIdx}`
                        const isStopOpen = Boolean(openStops[stopKey])
                        // Calculate sequential day number across all prior chapters + this chapter
                        const priorDaysCount = chaptersList.slice(0, cIdx).reduce((acc, c) => acc + (c.days?.length || 0), 0)
                        const computedDayNum = priorDaysCount + dIdx + 1

                        return (
                          <div
                            key={dIdx}
                            className="rounded-lg border border-border/60 bg-muted/30 px-1.5 py-1.5 md:px-2 space-y-1 shadow-xs"
                          >
                            <div
                              className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pb-1 border-b border-border/30 cursor-pointer select-none"
                              onClick={() => toggleStopOpen(cIdx, dIdx)}
                            >
                              <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 min-w-0 flex-1">
                                <span className="rounded bg-primary/10 px-1.5 py-0.5 whitespace-nowrap shrink-0">
                                  DAY {computedDayNum}
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
                                  title="Move Day Up"
                                >
                                  <ChevronUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveDayInChapter(cIdx, dIdx, dIdx + 1)}
                                  disabled={dIdx === (chap.days || []).length - 1}
                                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                  title="Move Day Down"
                                >
                                  <ChevronDown className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeDayFromChapter(cIdx, dIdx)}
                                  className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer ml-1"
                                  title="Remove Day"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleStopOpen(cIdx, dIdx)}
                                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer ml-1"
                                  title={isStopOpen ? "Collapse Day" : "Expand Day"}
                                >
                                  {isStopOpen ? <ChevronUp className="h-3.5 w-3.5 text-primary" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            </div>

                            {isStopOpen && (
                              <div className="space-y-1 pt-1">
                                <div className="flex flex-col gap-1">
                                  <DynamicStyledField
                                    type="text"
                                    label="Day Title (Optional, defaults to Location Name)"
                                    fieldName={`itinerary.items.${cIdx}.days.${dIdx}.title`}
                                    placeholder="e.g. Arrival in Tirana & Welcome Dinner"
                                    value={day.title}
                                    onChange={(val) => updateField(`itinerary.items.${cIdx}.days.${dIdx}.title`, val)}
                                  />

                                  <ParentLocationSelect
                                    value={day.locationId || ""}
                                    currentName={day.locationName || ""}
                                    label="Location / Region (DB Search Picker)"
                                    noneLabel="Select Location ID..."
                                    onChange={(locId, locName) => {
                                      updateField(`itinerary.items.${cIdx}.days.${dIdx}.locationId`, locId || "")
                                      if (locName) {
                                        updateField(`itinerary.items.${cIdx}.days.${dIdx}.locationName`, locName)
                                      }
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

                                {/* STOPS INSIDE THIS DAY */}
                                <div className="space-y-1 pt-1 border-t border-border/40 pl-1 md:pl-1.5 border-l-2 border-primary/20">
                                  <div className="flex items-center justify-between gap-1">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                                      <span>Stops / Highlights ({(day.stops || []).length})</span>
                                    </label>

                                    <button
                                      type="button"
                                      onClick={() => addStopToDay(cIdx, dIdx)}
                                      className="flex items-center gap-1 rounded bg-primary/10 hover:bg-primary/20 text-primary px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer"
                                    >
                                      <Plus className="h-3 w-3" /> Add Stop
                                    </button>
                                  </div>

                                  {(day.stops || []).map((stop: any, sIdx: number) => {
                                    // Compute global stop number across all preceding chapters, days, and current stops
                                    let priorStopsCount = 0
                                    for (let i = 0; i < cIdx; i++) {
                                      const ch = chaptersList[i]
                                      for (const d of (ch.days || [])) {
                                        priorStopsCount += (d.stops?.length || 0)
                                      }
                                    }
                                    const currentChapDays = chap.days || []
                                    for (let j = 0; j < dIdx; j++) {
                                      priorStopsCount += (currentChapDays[j]?.stops?.length || 0)
                                    }
                                    const computedStopNum = priorStopsCount + sIdx + 1

                                    return (
                                      <div
                                        key={sIdx}
                                        className="rounded border border-border/70 bg-card px-1.5 py-1.5 md:px-2 space-y-1 shadow-2xs"
                                      >
                                        <div className="flex items-center justify-between pb-0.5 border-b border-border/30">
                                          <span className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                                            <span className="rounded bg-accent/15 px-1.5 py-0.5">
                                              STOP {computedStopNum}
                                            </span>
                                            {stop.title && typeof stop.title === "string" && (
                                              <span className="text-foreground font-medium truncate max-w-[140px]">
                                                {stop.title}
                                              </span>
                                            )}
                                          </span>

                                          <div className="flex items-center gap-0.5">
                                            <button
                                              type="button"
                                              onClick={() => moveStopInDay(cIdx, dIdx, sIdx, sIdx - 1)}
                                              disabled={sIdx === 0}
                                              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                              title="Move Stop Up"
                                            >
                                              <ChevronUp className="h-3 w-3" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => moveStopInDay(cIdx, dIdx, sIdx, sIdx + 1)}
                                              disabled={sIdx === (day.stops || []).length - 1}
                                              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                              title="Move Stop Down"
                                            >
                                              <ChevronDown className="h-3 w-3" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => removeStopFromDay(cIdx, dIdx, sIdx)}
                                              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer ml-0.5"
                                              title="Remove Stop"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </button>
                                          </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                          <DynamicStyledField
                                            type="text"
                                            label="Stop Title (e.g. Castle Tour or Wine Tasting)"
                                            fieldName={`itinerary.items.${cIdx}.days.${dIdx}.stops.${sIdx}.title`}
                                            placeholder="e.g. Krujë Castle & Old Bazaar"
                                            value={stop.title}
                                            onChange={(val) => updateField(`itinerary.items.${cIdx}.days.${dIdx}.stops.${sIdx}.title`, val)}
                                          />

                                          <ParentLocationSelect
                                            value={stop.locationId || ""}
                                            currentName={stop.locationName || ""}
                                            label="Stop Specific Location / Spot"
                                            noneLabel="Inherit Day Location or Pick..."
                                            onChange={(locId, locName) => {
                                              updateField(`itinerary.items.${cIdx}.days.${dIdx}.stops.${sIdx}.locationId`, locId || "")
                                              if (locName) {
                                                updateField(`itinerary.items.${cIdx}.days.${dIdx}.stops.${sIdx}.locationName`, locName)
                                              }
                                            }}
                                          />

                                          <DynamicStyledField
                                            type="richtext"
                                            label="Stop Highlight / Details"
                                            fieldName={`itinerary.items.${cIdx}.days.${dIdx}.stops.${sIdx}.description`}
                                            placeholder="Details of this specific stop activity..."
                                            value={stop.description}
                                            onChange={(val) => updateField(`itinerary.items.${cIdx}.days.${dIdx}.stops.${sIdx}.description`, val)}
                                          />
                                        </div>
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
                )}
              </div>
            )
          })}
        </div>
      </div>
    </FormSection>
  )
}

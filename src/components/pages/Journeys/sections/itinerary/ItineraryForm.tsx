/* =====================================================
   JOURNEYS — ITINERARY (DAY-BY-DAY) FORM SECTION
   Directly reflects Prisma model JourneyItinerary
===================================================== */

import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { removeFiles } from "@/services/fileUpload"
import { useJourneyDraft } from "../../shared/JourneyDraftContext"
import {
  FormSection,
  DynamicStyledField,
  UniversalMultimediaForm,
} from "../../shared/fields"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import {
  getJourneyItineraryDays,
  sanitizeItineraryDay,
  sanitizeFieldStyle,
  sanitizeMultimedia,
  sanitizeLocation,
  getDayEyebrow,
  getDayTitle,
  getDayLocation,
  getDayDescription,
  getDayMedia,
  type Journey,
  type ItineraryDayItem,
} from "../../journeyTypes"
import { LocationSearchCombobox } from "./LocationSearchCombobox"

export type ItineraryFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

function extractMediaUrlsFromDay(day: ItineraryDayItem): string[] {
  const urls: string[] = []

  const addUrl = (u: any) => {
    if (typeof u === "string" && u.trim() && !u.startsWith("/images/")) {
      urls.push(u.trim())
    }
  }

  // 1. itineraryMedia
  const media = day.itineraryMedia as any
  if (media) {
    addUrl(media.url)
    addUrl(media.image?.url)
    addUrl(media.video?.url)
    addUrl(media.video?.poster)
    addUrl(media.posterUrl)
  }

  // 2. legacy multimedia
  const mm = (day as any).multimedia
  if (mm) {
    addUrl(mm.url)
    addUrl(mm.image?.url)
    addUrl(mm.video?.url)
    addUrl(mm.video?.poster)
    addUrl(mm.posterUrl)
  }

  // 3. thumbnail
  addUrl(day.thumbnail)

  // 4. images array
  if (Array.isArray(day.images)) {
    day.images.forEach(addUrl)
  }

  // 5. journeyItineraryImage array
  if (Array.isArray(day.journeyItineraryImage)) {
    day.journeyItineraryImage.forEach(addUrl)
  }

  // 6. nested day.data
  const dayData = (day as any).data
  if (dayData) {
    const dataMedia = dayData.itineraryMedia || dayData.multimedia
    if (dataMedia) {
      addUrl(dataMedia.url)
      addUrl(dataMedia.image?.url)
      addUrl(dataMedia.video?.url)
      addUrl(dataMedia.video?.poster)
    }
    if (Array.isArray(dayData.images)) {
      dayData.images.forEach(addUrl)
    }
  }

  return Array.from(new Set(urls))
}

export function ItineraryForm({
  draft,
  updateField: _updateField,
  openSections,
  toggleSection,
}: ItineraryFormProps) {
  const { setDraft } = useJourneyDraft()
  const itineraryDays = getJourneyItineraryDays(draft)
  const [expandedDay, setExpandedDay] = useState<number | null>(0)

  const syncItinerary = (next: ItineraryDayItem[]) => {
    const cleanDays = next.map((d, i) => sanitizeItineraryDay(d, i))
    setDraft((prev) => {
      const cleanData = { ...(prev.data || {}) }
      cleanData.itineraryData = cleanDays
      cleanData.itinerary = cleanDays
      if (cleanData.itinerarySection) {
        cleanData.itinerarySection = {
          ...cleanData.itinerarySection,
          days: cleanDays,
        }
      }
      if (cleanData.dayByDay) {
        cleanData.dayByDay = {
          ...cleanData.dayByDay,
          days: cleanDays,
        }
      }
      return {
        ...prev,
        itineraryData: cleanDays,
        itineraryDays: cleanDays,
        itinerary: cleanDays,
        data: cleanData,
      }
    })
  }

  const handleAddDay = () => {
    const nextDayNum = itineraryDays.length + 1
    const titleText = `Day ${nextDayNum}: Exploration & Discovery`

    const newDay: ItineraryDayItem = {
      dayNumber: nextDayNum,
      dayLabel: `Day ${nextDayNum}`,
      eyebrow: {
        text: "",
        style: {
          textColor: null,
          backgroundColor: null,
        },
      },
      title: {
        text: titleText,
        style: {
          textColor: null,
          backgroundColor: null,
        },
      },
      location: {
        id: null,
        name: "",
        geoData: {
          latitude: null,
          longitude: null,
        },
      },
      description: {
        text: "",
        style: {
          textColor: null,
          backgroundColor: null,
        },
      },
      itineraryMedia: {
        type: "image",
        color: "#F8F6F0",
        url: null,
        alt: null,
        image: {
          url: null,
          alt: null,
          opacity: 100,
          overlayColor: "#000000",
          overlayOpacity: 0,
        },
        video: {
          url: null,
          alt: null,
          poster: null,
          autoplay: true,
          loop: true,
          muted: true,
          opacity: 100,
          overlayColor: "#000000",
          overlayOpacity: 0,
        },
      },
    }
    const updated = [...itineraryDays, newDay]
    syncItinerary(updated)
    setExpandedDay(updated.length - 1)
  }

  const handleUpdateDayFields = (index: number, patch: Record<string, any>) => {
    const updated = itineraryDays.map((curr, idx) => {
      if (idx !== index) return curr
      return sanitizeItineraryDay({ ...curr, ...patch }, idx)
    })
    syncItinerary(updated)
  }


  const handleRemoveDay = async (index: number) => {
    const targetDay = itineraryDays[index]
    if (targetDay) {
      // 1. Delete all multimedia uploaded files from server
      const mediaUrls = extractMediaUrlsFromDay(targetDay)
      if (mediaUrls.length > 0) {
        try {
          await removeFiles(mediaUrls)
        } catch (err) {
          console.error("Failed to delete media files from server:", err)
        }
      }
    }

    // 2. Remove day card and renumber remaining days
    const updated = itineraryDays
      .filter((_: ItineraryDayItem, i: number) => i !== index)
      .map((d: ItineraryDayItem, i: number) => ({
        ...d,
        dayNumber: i + 1,
        dayLabel: `Day ${i + 1}`,
      }))

    syncItinerary(updated)

    if (expandedDay === index) {
      setExpandedDay(null)
    } else if (expandedDay !== null && expandedDay > index) {
      setExpandedDay(expandedDay - 1)
    }
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
            Configure each day of the journey with titles, descriptions, and media.
          </p>
          <button
            type="button"
            onClick={handleAddDay}
            className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Plus className="h-3.5 w-3.5" /> Add Day
          </button>
        </div>

        {/* Days Accordion */}
        <div className="space-y-3">
          {itineraryDays.map((day: ItineraryDayItem, idx: number) => {
            const isExpanded = expandedDay === idx
            const dayEyebrow = getDayEyebrow(day)
            const dayTitle = getDayTitle(day, idx + 1)
            const dayLoc = getDayLocation(day)
            const dayDesc = getDayDescription(day)
            const dayMedia = getDayMedia(day)

            return (
              <div
                key={idx}
                className={cn(
                  "rounded-xl border border-border/70 bg-background transition-all",
                  isExpanded ? "shadow-sm ring-1 ring-primary/20" : ""
                )}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-muted/30"
                  onClick={() => setExpandedDay(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {day.dayNumber || idx + 1}
                    </span>

                    {/* Day Media Thumbnail */}
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30">
                      <UniversalMultimediaPreview
                        multimedia={dayMedia}
                        fallbackImageSrc={dayMedia.url || day.thumbnail}
                        fallbackAlt={dayTitle.text}
                        mode="background"
                        className="h-full w-full object-cover object-center"
                        containerClassName="absolute inset-0"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {dayTitle.text}
                      </span>
                      {dayLoc.name && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                          <MapPin className="h-2.5 w-2.5 text-primary shrink-0" />
                          {dayLoc.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveDay(idx)
                      }}
                      className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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

                {/* Day Details */}
                {isExpanded && (
                  <div className="border-t border-border/50 p-4 space-y-4">
                    {/* Eyebrow with DynamicStyledField */}
                    <DynamicStyledField
                      type="text"
                      label="Eyebrow"
                      value={dayEyebrow.text}
                      onChange={(val: string) => {
                        handleUpdateDayFields(idx, {
                          eyebrow: { text: val, style: sanitizeFieldStyle(dayEyebrow.style) },
                        })
                      }}
                      placeholder="e.g. The Northern Frontier"
                      enableStyle
                      style={dayEyebrow.style}
                      onStyleChange={(style) => {
                        handleUpdateDayFields(idx, {
                          eyebrow: { text: dayEyebrow.text, style: sanitizeFieldStyle(style) },
                        })
                      }}
                    />

                    {/* Day Title with DynamicStyledField */}
                    <DynamicStyledField
                      type="text"
                      label="Day Title"
                      value={dayTitle.text}
                      onChange={(val: string) => {
                        handleUpdateDayFields(idx, {
                          title: { text: val, style: sanitizeFieldStyle(dayTitle.style) },
                        })
                      }}
                      placeholder="e.g. Day 1: Tirana to Shkodra & The Southern Gates"
                      enableStyle
                      style={dayTitle.style}
                      onStyleChange={(style) => {
                        handleUpdateDayFields(idx, {
                          title: { text: dayTitle.text, style: sanitizeFieldStyle(style) },
                        })
                      }}
                    />

                    {/* Location Search Box (Allows same location across days) */}
                    <LocationSearchCombobox
                      valueLocationId={dayLoc.id}
                      valueLocationName={dayLoc.name}
                      onSelect={(loc) => {
                        handleUpdateDayFields(idx, {
                          location: sanitizeLocation(loc),
                        })
                      }}
                    />

                    {/* Day Description with DynamicStyledField */}
                    <DynamicStyledField
                      type="textarea"
                      label="Day Description"
                      value={dayDesc.text}
                      onChange={(val: string) => {
                        handleUpdateDayFields(idx, {
                          description: { text: val, style: sanitizeFieldStyle(dayDesc.style) },
                        })
                      }}
                      placeholder="Detailed narrative of this day's highlights, sights, and encounters..."
                      enableStyle
                      style={dayDesc.style}
                      onStyleChange={(style) => {
                        handleUpdateDayFields(idx, {
                          description: { text: dayDesc.text, style: sanitizeFieldStyle(style) },
                        })
                      }}
                    />

                    {/* Day Universal Multimedia (Image / Video / Background Color) */}
                    <div className="rounded-lg border border-border/60 p-3 space-y-2.5 bg-card/40">
                      <UniversalMultimediaForm
                        sectionTitle={`Day ${day.dayNumber || idx + 1} Media`}
                        section={{
                          ...day,
                          itineraryMedia: dayMedia,
                        } as any}
                        content={{
                          ...day,
                          itineraryMedia: dayMedia,
                        }}
                        contentMediaKey="itineraryMedia"
                        backgroundType={dayMedia.type || "image"}
                        onBackgroundTypeChange={(type) => {
                          handleUpdateDayFields(idx, {
                            itineraryMedia: sanitizeMultimedia({
                              ...dayMedia,
                              type,
                            }),
                          })
                        }}
                        onColorChange={(color) => {
                          handleUpdateDayFields(idx, {
                            itineraryMedia: sanitizeMultimedia({
                              ...dayMedia,
                              type: "color" as const,
                              color,
                            }),
                          })
                        }}
                        image={dayMedia.image}
                        onImageChange={(nextImg) => {
                          handleUpdateDayFields(idx, {
                            itineraryMedia: sanitizeMultimedia({
                              ...dayMedia,
                              type: "image" as const,
                              image: {
                                ...(dayMedia.image || {}),
                                ...nextImg,
                              },
                            }),
                          })
                        }}
                        video={dayMedia.video}
                        onVideoChange={(nextVid) => {
                          handleUpdateDayFields(idx, {
                            itineraryMedia: sanitizeMultimedia({
                              ...dayMedia,
                              type: "video" as const,
                              video: {
                                ...(dayMedia.video || {}),
                                ...nextVid,
                              },
                            }),
                          })
                        }}
                        updateSection={(patch: any) => {
                          const raw = patch?.itineraryMedia || patch?.multimedia || patch
                          handleUpdateDayFields(idx, {
                            itineraryMedia: sanitizeMultimedia(raw),
                          })
                        }}
                        updateSectionContent={(patch: any) => {
                          const raw = patch?.itineraryMedia || patch?.multimedia || patch
                          handleUpdateDayFields(idx, {
                            itineraryMedia: sanitizeMultimedia(raw),
                          })
                        }}
                        showColorPicker={true}
                        colorLabel="Day Background / Card Color"
                        defaultColor="#F8F6F0"
                        allowImage={true}
                        allowVideo={true}
                        imageTitle="Day Photo / Image"
                        imageLabel="Day Image"
                        imageFieldName="itineraryImage"
                        videoTitle="Day Video"
                        videoLabel="Day Video (mp4, webm)"
                        videoHint="Upload or link an mp4/webm video clip for this itinerary day."
                        videoFieldName="itineraryVideo"
                        showImageAltField={true}
                        showVideoAltField={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-border/60">
          <button
            type="button"
            onClick={handleAddDay}
            className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Plus className="h-3.5 w-3.5" /> Add Day
          </button>
        </div>
      </div>
    </FormSection>
  )
}

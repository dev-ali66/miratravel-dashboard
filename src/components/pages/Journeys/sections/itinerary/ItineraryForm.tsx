/* =====================================================
   JOURNEYS — ITINERARY (DAY-BY-DAY) FORM SECTION
   Directly reflects Prisma model JourneyItinerary
===================================================== */

import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  FormSection,
  DynamicStyledField,
  UniversalMultimediaForm,
} from "../../shared/fields"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import {
  getJourneyItineraryDays,
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

export function ItineraryForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: ItineraryFormProps) {
  const itineraryDays = getJourneyItineraryDays(draft)
  const [expandedDay, setExpandedDay] = useState<number | null>(0)

  const syncItinerary = (next: ItineraryDayItem[]) => {
    updateField("itineraryData", next)
    updateField("itineraryDays", next)
    updateField("itinerary", next)
    updateField("data.itineraryData", next)
    updateField("data.itinerary", next)
  }

  const handleAddDay = () => {
    const nextDayNum = itineraryDays.length + 1
    const titleText = `Day ${nextDayNum}: Exploration & Discovery`

    const newDay: ItineraryDayItem = {
      dayNumber: nextDayNum,
      dayLabel: `Day ${nextDayNum}`,
      // Grouped structure: eyebrow: {}, title: {}, location: {}, description: {}, itineraryMedia: {}
      eyebrow: {
        text: "",
        style: null,
      },
      title: {
        text: titleText,
        style: null,
      },
      location: {
        id: null,
        name: "",
      },
      description: {
        text: "",
        style: null,
      },
      itineraryMedia: {
        type: "image",
        color: "#F8F6F0",
        url: "",
        alt: titleText,
        image: {
          url: "",
          alt: titleText,
          opacity: 100,
          overlayColor: "#000000",
          overlayOpacity: 0,
        },
        video: {
          url: "",
          alt: titleText,
          poster: "",
          autoplay: true,
          loop: true,
          muted: true,
          opacity: 100,
          overlayColor: "#000000",
          overlayOpacity: 0,
        },
      },
      thumbnail: "",
      journeyItineraryImage: [],
      images: [],
      data: {},
      metadata: {},
    }
    const updated = [...itineraryDays, newDay]
    syncItinerary(updated)
    setExpandedDay(updated.length - 1)
  }

  const handleUpdateDayFields = (index: number, patch: Record<string, any>) => {
    const updated = [...itineraryDays]
    const current = updated[index] || {}
    const day = { ...current, ...patch }

    if ("journeyItineraryImage" in patch) {
      day.images = patch.journeyItineraryImage
    }

    updated[index] = day
    syncItinerary(updated)
  }


  const handleRemoveDay = (index: number) => {
    const updated = itineraryDays
      .filter((_: ItineraryDayItem, i: number) => i !== index)
      .map((d: ItineraryDayItem, i: number) => ({
        ...d,
        dayNumber: i + 1,
      }))
    syncItinerary(updated)
    if (expandedDay === index) {
      setExpandedDay(null)
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
                          eyebrow: { text: val, style: dayEyebrow.style },
                          eyebrowStyle: dayEyebrow.style,
                        })
                      }}
                      placeholder="e.g. The Northern Frontier"
                      enableStyle
                      style={dayEyebrow.style}
                      onStyleChange={(style) => {
                        handleUpdateDayFields(idx, {
                          eyebrow: { text: dayEyebrow.text, style },
                          eyebrowStyle: style,
                          data: { ...((day.data as any) || {}), eyebrowStyle: style },
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
                          title: { text: val, style: dayTitle.style },
                          titleStyle: dayTitle.style,
                        })
                      }}
                      placeholder="e.g. Day 1: Tirana to Shkodra & The Southern Gates"
                      enableStyle
                      style={dayTitle.style}
                      onStyleChange={(style) => {
                        handleUpdateDayFields(idx, {
                          title: { text: dayTitle.text, style },
                          titleStyle: style,
                          data: { ...((day.data as any) || {}), titleStyle: style },
                        })
                      }}
                    />

                    {/* Location Search Box (Allows same location across days) */}
                    <LocationSearchCombobox
                      valueLocationId={dayLoc.id}
                      valueLocationName={dayLoc.name}
                      onSelect={(loc) => {
                        if (loc) {
                          handleUpdateDayFields(idx, {
                            location: { id: loc.id, name: loc.name },
                            locationId: loc.id,
                            locationName: loc.name,
                          })
                        } else {
                          handleUpdateDayFields(idx, {
                            location: { id: null, name: "" },
                            locationId: null,
                            locationName: "",
                          })
                        }
                      }}
                    />

                    {/* Day Description with DynamicStyledField */}
                    <DynamicStyledField
                      type="textarea"
                      label="Day Description"
                      value={dayDesc.text}
                      onChange={(val: string) => {
                        handleUpdateDayFields(idx, {
                          description: { text: val, style: dayDesc.style },
                          descriptionStyle: dayDesc.style,
                        })
                      }}
                      placeholder="Detailed narrative of this day's highlights, sights, and encounters..."
                      enableStyle
                      style={dayDesc.style}
                      onStyleChange={(style) => {
                        handleUpdateDayFields(idx, {
                          description: { text: dayDesc.text, style },
                          descriptionStyle: style,
                          data: { ...((day.data as any) || {}), descriptionStyle: style },
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
                          multimedia: dayMedia,
                        } as any}
                        content={{
                          ...day,
                          itineraryMedia: dayMedia,
                          multimedia: dayMedia,
                        }}
                        contentMediaKey="itineraryMedia"
                        backgroundType={dayMedia.type || "image"}
                        onBackgroundTypeChange={(type) => {
                          const nextMedia = {
                            ...dayMedia,
                            type,
                          }
                          handleUpdateDayFields(idx, {
                            itineraryMedia: nextMedia,
                            multimedia: nextMedia,
                          })
                        }}
                        onColorChange={(color) => {
                          const nextMedia = {
                            ...dayMedia,
                            type: "color" as const,
                            color,
                          }
                          handleUpdateDayFields(idx, {
                            itineraryMedia: nextMedia,
                            multimedia: nextMedia,
                          })
                        }}
                        image={dayMedia.image}
                        onImageChange={(nextImg) => {
                          const nextImageObj = {
                            ...(dayMedia.image || {}),
                            ...nextImg,
                            url: nextImg.url || "",
                            alt: nextImg.alt || dayTitle.text,
                          }
                          const nextMedia = {
                            ...dayMedia,
                            type: "image" as const,
                            url: nextImg.url || "",
                            alt: nextImg.alt || dayTitle.text,
                            image: nextImageObj,
                            imageData: nextImageObj,
                          }
                          handleUpdateDayFields(idx, {
                            itineraryMedia: nextMedia,
                            multimedia: nextMedia,
                            thumbnail: nextImg.url || "",
                            journeyItineraryImage: nextImg.url ? [nextImg.url] : [],
                            images: nextImg.url ? [nextImg.url] : [],
                          })
                        }}
                        video={dayMedia.video}
                        onVideoChange={(nextVid) => {
                          const nextVideoObj = {
                            ...(dayMedia.video || {}),
                            ...nextVid,
                            url: nextVid.url || "",
                            alt: nextVid.alt || dayTitle.text,
                            poster: (nextVid as any)?.posterUrl || (nextVid as any)?.poster || "",
                          }
                          const nextMedia = {
                            ...dayMedia,
                            type: "video" as const,
                            url: nextVid.url || "",
                            alt: nextVid.alt || dayTitle.text,
                            video: nextVideoObj,
                            videoData: nextVideoObj,
                          }
                          handleUpdateDayFields(idx, {
                            itineraryMedia: nextMedia,
                            multimedia: nextMedia,
                            thumbnail: nextVideoObj.poster || nextVid.url || "",
                            journeyItineraryImage: nextVid.url ? [nextVid.url] : [],
                            images: nextVid.url ? [nextVid.url] : [],
                          })
                        }}
                        updateSection={(patch: any) => {
                          const nextMedia = patch?.itineraryMedia || patch?.multimedia || patch
                          const dayPatch: Record<string, any> = {
                            itineraryMedia: nextMedia,
                            multimedia: nextMedia,
                          }
                          if (nextMedia?.type === "image" && nextMedia?.url) {
                            dayPatch.thumbnail = nextMedia.url
                            dayPatch.journeyItineraryImage = [nextMedia.url]
                            dayPatch.images = [nextMedia.url]
                          } else if (nextMedia?.type === "video" && (nextMedia?.posterUrl || nextMedia?.url)) {
                            dayPatch.thumbnail = nextMedia.posterUrl || nextMedia.url
                            dayPatch.journeyItineraryImage = [nextMedia.url]
                            dayPatch.images = [nextMedia.url]
                          }
                          handleUpdateDayFields(idx, dayPatch)
                        }}
                        updateSectionContent={(patch: any) => {
                          const nextMedia = patch?.itineraryMedia || patch?.multimedia || patch
                          const dayPatch: Record<string, any> = {
                            itineraryMedia: nextMedia,
                            multimedia: nextMedia,
                          }
                          if (nextMedia?.type === "image" && nextMedia?.url) {
                            dayPatch.thumbnail = nextMedia.url
                            dayPatch.journeyItineraryImage = [nextMedia.url]
                            dayPatch.images = [nextMedia.url]
                          } else if (nextMedia?.type === "video" && (nextMedia?.posterUrl || nextMedia?.url)) {
                            dayPatch.thumbnail = nextMedia.posterUrl || nextMedia.url
                            dayPatch.journeyItineraryImage = [nextMedia.url]
                            dayPatch.images = [nextMedia.url]
                          }
                          handleUpdateDayFields(idx, dayPatch)
                        }}
                        showColorPicker={true}
                        colorLabel="Day Background / Card Color"
                        defaultColor="#F8F6F0"
                        allowImage={true}
                        allowVideo={true}
                        imageTitle="Day Photo / Image"
                        imageLabel="Day Image"
                        imageFieldName={`itinerary_day_${idx}_multimedia_img`}
                        videoTitle="Day Video"
                        videoLabel="Day Video (mp4, webm)"
                        videoHint="Upload or link an mp4/webm video clip for this itinerary day."
                        videoFieldName={`itinerary_day_${idx}_multimedia_vid`}
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
      </div>
    </FormSection>
  )
}

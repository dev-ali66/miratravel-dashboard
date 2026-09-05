/* =====================================================
   ACCOMMODATION — FORM SECTION
   Auto-created from frontend layout for CMS edit UI.
===================================================== */

import { useState } from "react"
import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import { ButtonsField } from "../../../CMS/shared/ButtonsField"
import { ChevronDown, Plus, Trash2 } from "lucide-react"
import type { LocationData, AccommodationStayItem } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type AccommodationStaysFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function AccommodationStaysForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: AccommodationStaysFormProps) {
  const accommodation = draft.data?.accommodation_stays ?? {}
  const stays = Array.isArray(accommodation.stays) ? accommodation.stays : []
  const [openStays, setOpenStays] = useState<Record<number, boolean>>({
    0: true,
  })

  const toggleStay = (index: number) => {
    setOpenStays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const updateStay = (
    index: number,
    field: keyof AccommodationStayItem,
    value: unknown
  ) =>
    updateArrayItem(stays, index, field, value, (next) =>
      updateField("data.accommodation_stays.stays", next)
    )

  const updateStayPatch = (
    index: number,
    patch: Partial<AccommodationStayItem>
  ) => {
    const next = stays.map((s, i) => (i === index ? { ...s, ...patch } : s))
    updateField("data.accommodation_stays.stays", next)
  }

  return (
    <FormSection
      title="Accommodation"
      active={!!openSections["accommodation"]}
      onClick={() => toggleSection("accommodation")}
    >
      <div className="space-y-5">
        <DynamicStyledField
          type="text"
          label="Badge"
          value={accommodation.badge ?? ""}
          onChange={(value: string) =>
            updateField("data.accommodation_stays.badge", value)
          }
          enableStyle
          style={(accommodation as any)?.badgeStyle}
          onStyleChange={(style) =>
            updateField("data.accommodation_stays.badgeStyle", style)
          }
        />

        <DynamicStyledField
          type="text"
          label="Title"
          value={accommodation.title ?? ""}
          onChange={(value: string) =>
            updateField("data.accommodation_stays.title", value)
          }
          enableStyle
          style={(accommodation as any)?.titleStyle}
          onStyleChange={(style) =>
            updateField("data.accommodation_stays.titleStyle", style)
          }
        />

        <DynamicStyledField
          type="textarea"
          label="Description"
          value={accommodation.description ?? ""}
          onChange={(value: string) =>
            updateField("data.accommodation_stays.description", value)
          }
          enableStyle
          style={(accommodation as any)?.descriptionStyle}
          onStyleChange={(style) =>
            updateField("data.accommodation_stays.descriptionStyle", style)
          }
        />

        <UniversalMultimediaForm
          section={accommodation as any}
          content={accommodation as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.accommodation_stays", {
              ...accommodation,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.accommodation_stays", {
              ...accommodation,
              ...patch,
            })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={accommodation.backgroundMultimedia?.type ?? "color"}
          backgroundTypeStyleKey="locationAccommodationBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#F7F6F2"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationAccommodationBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationAccommodationBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Stays</h4>

            <button
              type="button"
              onClick={() => {
                const next = [
                  ...stays,
                  {
                    id: Date.now(),
                    image: "",
                    step: `STAGE 0${stays.length + 1}`,
                    day: undefined,
                    duration: "",
                    city: "",
                    subtitle: "",
                    stayType: "",
                    confirmedBy: "Specialist Team",
                    confirmationBadge: "VERIFIED STAY",
                    description: "",
                    nights: undefined,
                    buttons: [],
                  },
                ]
                updateField("data.accommodation_stays.stays", next)
                setOpenStays((prev) => ({ ...prev, [stays.length]: true }))
              }}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Stay
            </button>
          </div>

          {stays.map((stay, index) => {
            const isOpen = !!openStays[index]
            const stayTitle =
              stay.city || stay.subtitle || stay.step || `Stay ${index + 1}`

            return (
              <div
                key={stay.id ?? index}
                className="overflow-hidden rounded-xl border border-border/60 bg-muted/10 transition-colors"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleStay(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      toggleStay(index)
                    }
                  }}
                  className="flex cursor-pointer items-center justify-between p-3.5 transition-colors select-none hover:bg-muted/30 sm:p-4"
                >
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <div
                      className={`flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>

                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="shrink-0 text-xs font-semibold">
                        Stay {index + 1}:
                      </span>
                      <span className="truncate text-xs font-medium text-foreground/85">
                        {stayTitle}
                      </span>
                      {stay.stayType && (
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {stay.stayType}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateField(
                        "data.accommodation_stays.stays",
                        stays.filter((_, i) => i !== index)
                      )
                    }}
                    className="ml-2 shrink-0 p-1 text-destructive transition-opacity hover:opacity-80"
                    title="Delete stay"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {isOpen && (
                  <div className="space-y-4 border-t border-border/40 p-4 pt-2">
                    <UniversalMultimediaForm
                      section={stay as any}
                      content={stay as Record<string, any>}
                      updateSection={(patch) =>
                        updateField(
                          "data.accommodation_stays.stays",
                          stays.map((s, i) =>
                            i === index
                              ? {
                                  ...s,
                                  ...patch,
                                  image:
                                    (patch as any)?.imageMultimedia?.url ??
                                    (patch as any)?.image ??
                                    s.image,
                                }
                              : s
                          )
                        )
                      }
                      updateSectionContent={(patch) =>
                        updateField(
                          "data.accommodation_stays.stays",
                          stays.map((s, i) =>
                            i === index
                              ? {
                                  ...s,
                                  ...patch,
                                  image:
                                    patch?.imageMultimedia?.url ??
                                    patch?.image ??
                                    s.image,
                                }
                              : s
                          )
                        )
                      }
                      contentMediaKey="imageMultimedia"
                      backgroundType={stay.imageMultimedia?.type ?? "image"}
                      enableTypeSelector={true}
                      showColorPicker={true}
                      allowImage={true}
                      allowVideo={true}
                      showVideoSwitches={true}
                      sectionTitle="Stay Image / Media"
                      imageTitle="Stay Image"
                      imageLabel="Accommodation stay image"
                      imageFieldName={`locationAccommodationStay${index + 1}Image`}
                      showImageAltField
                    />

                    <DynamicStyledField
                      type="text"
                      label="Step / Stage"
                      value={stay.step ?? ""}
                      onChange={(value: string) =>
                        updateStay(index, "step", value)
                      }
                      enableStyle
                      style={stay.stepStyle}
                      onStyleChange={(style) =>
                        updateStay(index, "stepStyle", style)
                      }
                    />

                    <DynamicStyledField
                      type="number"
                      label="Day (number)"
                      value={stay.day ?? ""}
                      onChange={(value: any) =>
                        updateStay(
                          index,
                          "day",
                          value ? Number(value) : undefined
                        )
                      }
                    />

                    <DynamicStyledField
                      type="text"
                      label="Duration"
                      value={stay.duration ?? ""}
                      onChange={(value: string) =>
                        updateStay(index, "duration", value)
                      }
                      enableStyle
                      style={stay.durationStyle}
                      onStyleChange={(style) =>
                        updateStay(index, "durationStyle", style)
                      }
                    />

                    <DynamicStyledField
                      type="text"
                      label="City / Location"
                      value={stay.city ?? stay.location ?? ""}
                      onChange={(value: string) => {
                        updateStayPatch(index, { city: value, location: value })
                      }}
                      enableStyle
                      style={stay.cityStyle ?? stay.locationStyle}
                      onStyleChange={(style) => {
                        updateStayPatch(index, {
                          cityStyle: style,
                          locationStyle: style,
                        })
                      }}
                    />

                    <DynamicStyledField
                      type="text"
                      label="Subtitle / Hotel Name"
                      value={stay.subtitle ?? ""}
                      onChange={(value: string) =>
                        updateStay(index, "subtitle", value)
                      }
                      enableStyle
                      style={stay.subtitleStyle}
                      onStyleChange={(style) =>
                        updateStay(index, "subtitleStyle", style)
                      }
                    />

                    <DynamicStyledField
                      type="text"
                      label="Stay Type"
                      value={stay.stayType ?? ""}
                      onChange={(value: string) =>
                        updateStay(index, "stayType", value)
                      }
                      enableStyle
                      style={stay.stayTypeStyle}
                      onStyleChange={(style) =>
                        updateStay(index, "stayTypeStyle", style)
                      }
                    />

                    <DynamicStyledField
                      type="text"
                      label="Confirmed By"
                      value={stay.confirmedBy ?? ""}
                      onChange={(value: string) =>
                        updateStay(index, "confirmedBy", value)
                      }
                      enableStyle
                      style={stay.confirmedStyle}
                      onStyleChange={(style) =>
                        updateStay(index, "confirmedStyle", style)
                      }
                    />

                    <DynamicStyledField
                      type="text"
                      label="Confirmation Badge"
                      value={stay.confirmationBadge ?? ""}
                      onChange={(value: string) =>
                        updateStay(index, "confirmationBadge", value)
                      }
                    />

                    <DynamicStyledField
                      type="number"
                      label="Nights (number)"
                      value={stay.nights ?? ""}
                      onChange={(value: any) =>
                        updateStay(
                          index,
                          "nights",
                          value ? Number(value) : undefined
                        )
                      }
                    />

                    <DynamicStyledField
                      type="textarea"
                      label="Description"
                      value={stay.description ?? ""}
                      onChange={(value: string) =>
                        updateStay(index, "description", value)
                      }
                      enableStyle
                      style={stay.descriptionStyle}
                      onStyleChange={(style) =>
                        updateStay(index, "descriptionStyle", style)
                      }
                    />

                    <ButtonsField
                      label="Stay Buttons / Actions"
                      value={stay.buttons ?? []}
                      onChange={(buttons) =>
                        updateStay(index, "buttons", buttons)
                      }
                    />
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

export default AccommodationStaysForm

/* =====================================================
   TRAVELINFO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

export type TravelInfoFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function TravelInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: TravelInfoFormProps) {
  const beforeTravel = {
    ...emptyLocation.data.travelInfo?.beforeTravel,
    ...draft.data.travelInfo?.beforeTravel,
  }
  const items = beforeTravel.items ?? []

  const updateItem = (index: number, field: string, value: any) => {
    const next = [...items]
    next[index] = { ...next[index], [field]: value }
    updateField("data.travelInfo.beforeTravel.items", next)
  }

  return (
    <FormSection
      title="Travel Information"
      active={!!openSections["travel-info"]}
      onClick={() => toggleSection("travel-info")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="text"
          label="Before Travel Label"
          value={beforeTravel.label ?? ""}
          onChange={(value: string) =>
            updateField("data.travelInfo.beforeTravel.label", value)
          }
          enableStyle
          style={(beforeTravel as any).labelStyle}
          onStyleChange={(style) =>
            updateField("data.travelInfo.beforeTravel.labelStyle", style)
          }
        />
        <DynamicStyledField
          type="text"
          label="Before Travel Title"
          value={beforeTravel.title ?? ""}
          onChange={(value: string) =>
            updateField("data.travelInfo.beforeTravel.title", value)
          }
          enableStyle
          style={(beforeTravel as any).titleStyle}
          onStyleChange={(style) =>
            updateField("data.travelInfo.beforeTravel.titleStyle", style)
          }
        />
        <UniversalMultimediaForm
          section={beforeTravel as any}
          content={beforeTravel as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.travelInfo.beforeTravel", {
              ...beforeTravel,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.travelInfo.beforeTravel", {
              ...beforeTravel,
              ...patch,
            })
          }
          contentMediaKey="imageMultimedia"
          backgroundType={beforeTravel.imageMultimedia?.type}
          sectionTitle="Before Travel Image"
          imageTitle="Before Travel Image"
          imageLabel="Before travel image"
          imageFieldName="locationTravelInfoBeforeTravelImage"
          showImageAltField
        />
        <UniversalMultimediaForm
          section={beforeTravel as any}
          content={beforeTravel as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.travelInfo.beforeTravel", {
              ...beforeTravel,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.travelInfo.beforeTravel", {
              ...beforeTravel,
              ...patch,
            })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={(beforeTravel as any).backgroundMultimedia?.type}
          backgroundTypeStyleKey="locationTravelInfoBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#E9E7DF"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationTravelInfoBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationTravelInfoBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-muted-foreground">
              Accordion Items
            </label>
            <button
              type="button"
              className="text-[10px] font-medium text-primary"
              onClick={() =>
                updateField("data.travelInfo.beforeTravel.items", [
                  ...items,
                  { id: String(Date.now()), title: "", content: "" },
                ])
              }
            >
              + Add
            </button>
          </div>
          {items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="space-y-3 rounded-lg border border-border/60 p-3"
            >
              <DynamicStyledField
                type="text"
                label="Item Title"
                value={item.title ?? ""}
                onChange={(value: string) => updateItem(index, "title", value)}
                enableStyle
                style={(item as any).titleStyle}
                onStyleChange={(style) =>
                  updateItem(index, "titleStyle", style)
                }
              />
              <DynamicStyledField
                type="textarea"
                label="Item Content"
                value={item.content ?? ""}
                onChange={(value: string) =>
                  updateItem(index, "content", value)
                }
                enableStyle
                style={(item as any).contentStyle}
                onStyleChange={(style) =>
                  updateItem(index, "contentStyle", style)
                }
              />
              <button
                type="button"
                className="text-[10px] font-medium text-destructive"
                onClick={() =>
                  updateField(
                    "data.travelInfo.beforeTravel.items",
                    items.filter((_, itemIndex) => itemIndex !== index)
                  )
                }
              >
                Remove item
              </button>
            </div>
          ))}
        </div>
      </div>
    </FormSection>
  )
}

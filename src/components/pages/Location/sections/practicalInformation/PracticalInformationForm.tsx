/* =====================================================
   PRACTICALINFORMATION — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import {
  DynamicStyledField,
  FormSection,
  SwitchField,
} from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2 } from "lucide-react"
import type { LocationData, PracticalItem } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type PracticalInformationFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function PracticalInformationForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: PracticalInformationFormProps) {
  const updatePractical = (
    index: number,
    field: keyof PracticalItem,
    value: any
  ) =>
    updateArrayItem(
      draft.data.practical_information.accordion_items,
      index,
      field,
      value,
      (next) => updateField("data.practical_information.accordion_items", next)
    )

  return (
    <FormSection
      title="Practical Information"
      active={!!openSections["practical-information"]}
      onClick={() => toggleSection("practical-information")}
    >
      <div className="space-y-5">
        <DynamicStyledField
          type="text"
          label="Title"
          value={draft.data.practical_information.title ?? ""}
          onChange={(value: string) =>
            updateField("data.practical_information.title", value)
          }
          enableStyle
          style={(draft.data.practical_information as any).titleStyle}
          onStyleChange={(style) =>
            updateField("data.practical_information.titleStyle", style)
          }
        />

        <DynamicStyledField
          type="text"
          label="Sub Heading"
          value={draft.data.practical_information.sub_heading ?? ""}
          onChange={(value: string) =>
            updateField("data.practical_information.sub_heading", value)
          }
          enableStyle
          style={(draft.data.practical_information as any).subHeadingStyle}
          onStyleChange={(style) =>
            updateField("data.practical_information.subHeadingStyle", style)
          }
        />

        <UniversalMultimediaForm
          section={draft.data.practical_information as any}
          content={draft.data.practical_information as Record<string, any>}
          updateSection={(patch) => {
            const sideMedia = (patch as any).sideImageMultimedia || patch
            updateField("data.practical_information", {
              ...draft.data.practical_information,
              ...patch,
              sideImageMultimedia: sideMedia,
              side_image:
                sideMedia?.image?.url ||
                (draft.data.practical_information as any).side_image,
            })
          }}
          updateSectionContent={(patch) => {
            const sideMedia = (patch as any).sideImageMultimedia || patch
            updateField("data.practical_information", {
              ...draft.data.practical_information,
              ...patch,
              sideImageMultimedia: sideMedia,
              side_image:
                sideMedia?.image?.url ||
                (draft.data.practical_information as any).side_image,
            })
          }}
          contentMediaKey="sideImageMultimedia"
          backgroundType={
            draft.data.practical_information.sideImageMultimedia?.type ||
            "image"
          }
          sectionTitle="Side Image"
          imageTitle="Side Image"
          imageLabel="Practical side image"
          imageFieldName="locationPracticalInformationImage"
          showImageAltField
          showColorPicker
          allowImage
          allowVideo
          showVideoSwitches
        />

        <UniversalMultimediaForm
          section={draft.data.practical_information as any}
          content={draft.data.practical_information as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.practical_information", {
              ...draft.data.practical_information,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.practical_information", {
              ...draft.data.practical_information,
              ...patch,
            })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={
            (draft.data.practical_information as any)?.backgroundMultimedia
              ?.type
          }
          backgroundTypeStyleKey="locationPracticalBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#EFE8DE"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationPracticalInformationBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationPracticalInformationBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Accordion Items</h4>

            <button
              type="button"
              onClick={() => {
                const items = [
                  ...draft.data.practical_information.accordion_items,
                  {
                    id: String(Date.now()),
                    title: "",
                    content: "",
                    is_expanded: false,
                  },
                ]

                updateField("data.practical_information.accordion_items", items)
              }}
              className="flex items-center gap-1 text-xs text-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>

          {draft.data.practical_information.accordion_items.map(
            (item, index) => (
              <div
                key={item.id}
                className="rounded-xl border border-border/60 p-4"
              >
                <div className="mb-3 flex justify-between">
                  <span className="text-xs font-semibold">
                    Item {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "data.practical_information.accordion_items",
                        draft.data.practical_information.accordion_items.filter(
                          (_, i) => i !== index
                        )
                      )
                    }
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <DynamicStyledField
                    type="text"
                    label="Title"
                    value={item.title ?? ""}
                    onChange={(value: string) =>
                      updatePractical(index, "title", value)
                    }
                    enableStyle
                    style={item.titleStyle}
                    onStyleChange={(style) =>
                      updatePractical(index, "titleStyle" as any, style)
                    }
                  />

                  <DynamicStyledField
                    type="textarea"
                    label="Content"
                    value={item.content ?? ""}
                    onChange={(value: string) =>
                      updatePractical(index, "content", value)
                    }
                    enableStyle
                    style={item.contentStyle}
                    onStyleChange={(style) =>
                      updatePractical(index, "contentStyle" as any, style)
                    }
                  />

                  <SwitchField
                    label="Expanded by default"
                    checked={item.is_expanded}
                    onChange={(checked) =>
                      updatePractical(index, "is_expanded", checked)
                    }
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </FormSection>
  )
}

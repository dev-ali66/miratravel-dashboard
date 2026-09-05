/* =====================================================
   ESSENCE — FORM SECTION
   Every field here maps 1:1 onto the real frontend
   `<Essence />` component's props (label/title/paragraphs/
   quote/imageSrc/imageAlt/statValue/statLabel), plus a
   CMS-only `style` group so text color, font size, image
   and background are all editable per element.
===================================================== */

import { Plus, Trash2 } from "lucide-react"
import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

export type EssenceFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function EssenceForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: EssenceFormProps) {
  const essence = draft?.data?.essence ?? emptyLocation.data.essence
  const paragraphs = essence.paragraphs ?? []
  const paragraphStyles = (essence as any).paragraphStyles ?? []

  return (
    <FormSection
      title="Essence"
      active={!!openSections["essence"]}
      onClick={() => toggleSection("essence")}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <DynamicStyledField
            type="text"
            label="Eyebrow Label"
            value={essence.label ?? ""}
            onChange={(value: string) =>
              updateField("data.essence.label", value)
            }
            enableStyle
            style={(essence as any).labelStyle}
            onStyleChange={(style) =>
              updateField("data.essence.labelStyle", style)
            }
          />

          <DynamicStyledField
            type="text"
            label="Title"
            value={essence.title ?? ""}
            onChange={(value: string) =>
              updateField("data.essence.title", value)
            }
            enableStyle
            style={(essence as any).titleStyle}
            onStyleChange={(style) =>
              updateField("data.essence.titleStyle", style)
            }
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Paragraphs</h4>
              <button
                type="button"
                onClick={() => {
                  updateField("data.essence.paragraphs", [...paragraphs, ""])
                  updateField("data.essence.paragraphStyles", [
                    ...paragraphStyles,
                    {},
                  ])
                }}
                className="flex items-center gap-1 text-xs text-primary"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Paragraph
              </button>
            </div>

            {paragraphs.map((paragraph, index) => (
              <div
                key={index}
                className="space-y-3 rounded-xl border border-border/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">
                    Paragraph {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      updateField(
                        "data.essence.paragraphs",
                        paragraphs.filter((_, i) => i !== index)
                      )
                      updateField(
                        "data.essence.paragraphStyles",
                        paragraphStyles.filter(
                          (_: any, i: number) => i !== index
                        )
                      )
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <DynamicStyledField
                  type="textarea"
                  label={`Paragraph ${index + 1}`}
                  value={paragraph ?? ""}
                  onChange={(val: string) => {
                    const next = [...paragraphs]
                    next[index] = val
                    updateField("data.essence.paragraphs", next)
                  }}
                  enableStyle
                  style={paragraphStyles[index]}
                  onStyleChange={(style) => {
                    const nextStyles = [...paragraphStyles]
                    nextStyles[index] = style
                    updateField("data.essence.paragraphStyles", nextStyles)
                  }}
                />
              </div>
            ))}
          </div>

          <DynamicStyledField
            type="textarea"
            label="Quote"
            value={essence.quote ?? ""}
            onChange={(value: string) =>
              updateField("data.essence.quote", value)
            }
            enableStyle
            style={(essence as any).quoteStyle}
            onStyleChange={(style) =>
              updateField("data.essence.quoteStyle", style)
            }
          />

          <UniversalMultimediaForm
            section={essence as any}
            content={essence as Record<string, any>}
            updateSection={(patch) =>
              updateField("data.essence", { ...essence, ...patch })
            }
            updateSectionContent={(patch) =>
              updateField("data.essence", { ...essence, ...patch })
            }
            contentMediaKey="backgroundMultimedia"
            backgroundType={(essence as any).backgroundMultimedia?.type}
            backgroundTypeStyleKey="locationEssenceBackgroundTypeStyle"
            sectionTitle="Background"
            showColorPicker
            colorLabel="Background color"
            defaultColor="#FFFFFF"
            imageTitle="Background Image"
            imageLabel="Background image"
            imageFieldName="locationEssenceBackgroundImage"
            videoTitle="Background Video"
            videoLabel="Background video"
            videoFieldName="locationEssenceBackgroundVideo"
            showImageAltField
            showVideoSwitches
          />

          <UniversalMultimediaForm
            section={essence as any}
            content={essence as Record<string, any>}
            updateSection={(patch) =>
              updateField("data.essence", { ...essence, ...patch })
            }
            updateSectionContent={(patch) =>
              updateField("data.essence", { ...essence, ...patch })
            }
            contentMediaKey="imageMultimedia"
            backgroundType={essence.imageMultimedia?.type}
            sectionTitle="Essence Image"
            imageTitle="Essence Image"
            imageLabel="Essence image"
            imageFieldName="locationEssenceImage"
            showImageAltField
          />

          <DynamicStyledField
            type="text"
            label="Image Alt Text"
            value={essence.imageAlt ?? ""}
            onChange={(value: string) =>
              updateField("data.essence.imageAlt", value)
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <DynamicStyledField
              type="text"
              label="Stat Value"
              value={essence.statValue ?? ""}
              placeholder="e.g. 2,753"
              onChange={(value: string) =>
                updateField("data.essence.statValue", value)
              }
            />

            <DynamicStyledField
              type="text"
              label="Stat Label"
              value={essence.statLabel ?? ""}
              placeholder="e.g. km of rivers and lakes"
              onChange={(value: string) =>
                updateField("data.essence.statLabel", value)
              }
            />
          </div>
        </div>
      </div>
    </FormSection>
  )
}

/* =====================================================
   STATISTICS — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

export type StatisticsFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function StatisticsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: StatisticsFormProps) {
  const statistics = draft.data?.statistics ?? emptyLocation.data.statistics
  const facts = statistics.facts ?? emptyLocation.data.statistics.facts ?? []

  return (
    <FormSection
      title="Statistics"
      active={!!openSections["statistics"]}
      onClick={() => toggleSection("statistics")}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {facts.map((fact, index) => (
          <div
            key={`${fact.label}-${index}`}
            className="space-y-4 rounded-xl border border-border/60 p-4 md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Fact {index + 1}</span>
              <button
                type="button"
                onClick={() =>
                  updateField(
                    "data.statistics.facts",
                    facts.filter((_, factIndex) => factIndex !== index)
                  )
                }
                className="text-[11px] font-medium text-destructive"
              >
                Remove fact
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <DynamicStyledField
                type="text"
                label="Fact Label"
                value={fact.label ?? ""}
                onChange={(value: string) => {
                  const next = [...facts]
                  next[index] = { ...fact, label: value }
                  updateField("data.statistics.facts", next)
                }}
                enableStyle
                style={fact.labelStyle ?? undefined}
                onStyleChange={(s) => {
                  const next = [...facts]
                  next[index] = { ...fact, labelStyle: s }
                  updateField("data.statistics.facts", next)
                }}
              />
              <DynamicStyledField
                type="text"
                label="Fact Value"
                value={fact.value ?? ""}
                onChange={(value: string) => {
                  const next = [...facts]
                  next[index] = { ...fact, value }
                  updateField("data.statistics.facts", next)
                }}
                enableStyle
                style={fact.valueStyle ?? undefined}
                onStyleChange={(s) => {
                  const next = [...facts]
                  next[index] = { ...fact, valueStyle: s }
                  updateField("data.statistics.facts", next)
                }}
              />
            </div>
            <DynamicStyledField
              type="textarea"
              label="Fact Description"
              value={fact.description ?? ""}
              onChange={(value: string) => {
                const next = [...facts]
                next[index] = { ...fact, description: value }
                updateField("data.statistics.facts", next)
              }}
              enableStyle
              style={fact.descriptionStyle ?? undefined}
              onStyleChange={(s) => {
                const next = [...facts]
                next[index] = { ...fact, descriptionStyle: s }
                updateField("data.statistics.facts", next)
              }}
            />

            <UniversalMultimediaForm
              section={fact as any}
              content={fact as any}
              updateSection={(patch) => {
                const media = (patch as any).media || patch
                const next = [...facts]
                next[index] = {
                  ...next[index],
                  ...patch,
                  media,
                  image: media?.image?.url || next[index].image,
                }
                updateField("data.statistics.facts", next)
              }}
              updateSectionContent={(patch) => {
                const media = (patch as any).media || patch
                const next = [...facts]
                next[index] = {
                  ...next[index],
                  ...patch,
                  media,
                  image: media?.image?.url || next[index].image,
                }
                updateField("data.statistics.facts", next)
              }}
              contentMediaKey="media"
              backgroundType={fact.media?.type || "image"}
              sectionTitle="Fact Media / Icon"
              imageTitle="Fact Media"
              imageLabel="Fact image / icon"
              imageFieldName={`fact_${index}_media`}
              showImageAltField
              showColorPicker
              allowImage
              allowVideo
              showVideoSwitches
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            updateField("data.statistics.facts", [
              ...facts,
              { label: "", value: "", description: "" },
            ])
          }
          className="text-left text-xs font-semibold text-primary md:col-span-2"
        >
          + Add Fact
        </button>

        <div className="md:col-span-2">
          <UniversalMultimediaForm
            section={statistics as any}
            content={statistics as Record<string, any>}
            updateSection={(patch) =>
              updateField("data.statistics", { ...statistics, ...patch })
            }
            updateSectionContent={(patch) =>
              updateField("data.statistics", { ...statistics, ...patch })
            }
            contentMediaKey="backgroundMultimedia"
            backgroundType={(statistics as any).backgroundMultimedia?.type}
            backgroundTypeStyleKey="locationStatisticsBackgroundTypeStyle"
            sectionTitle="Background"
            showColorPicker
            colorLabel="Background color"
            defaultColor="#E8E5DF"
            imageTitle="Background Image"
            imageLabel="Background image"
            imageFieldName="locationStatisticsBackgroundImage"
            videoTitle="Background Video"
            videoLabel="Background video"
            videoFieldName="locationStatisticsBackgroundVideo"
            showImageAltField
            showVideoSwitches
          />
        </div>
      </div>
    </FormSection>
  )
}

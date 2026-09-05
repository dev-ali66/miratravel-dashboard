/* =====================================================
   CLIMATE — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import {
  DynamicStyledField,
  ArrayField,
  FormSection,
} from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../../locationTypes"

export type ClimateFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function ClimateForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: ClimateFormProps) {
  return (
    <FormSection
      title="Climate"
      active={!!openSections["climate"]}
      onClick={() => toggleSection("climate")}
    >
      <div className="space-y-4">
        <ArrayField
          label="Climate Types"
          values={draft.data.climate.types}
          onChange={(values) => updateField("data.climate.types", values)}
        />

        <DynamicStyledField
          type="textarea"
          label="Description"
          value={draft.data.climate.description ?? ""}
          onChange={(value: string) =>
            updateField("data.climate.description", value)
          }
          enableStyle
          style={(draft.data.climate as any).descriptionStyle}
          onStyleChange={(style) =>
            updateField("data.climate.descriptionStyle", style)
          }
        />

        <UniversalMultimediaForm
          section={draft.data.climate as any}
          content={draft.data.climate as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.climate", { ...draft.data.climate, ...patch })
          }
          updateSectionContent={(patch) =>
            updateField("data.climate", { ...draft.data.climate, ...patch })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={
            (draft.data.climate as any).backgroundMultimedia?.type
          }
          backgroundTypeStyleKey="locationClimateBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#e9e7df"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationClimateBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationClimateBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />
      </div>
    </FormSection>
  )
}

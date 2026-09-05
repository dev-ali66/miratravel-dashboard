/* =====================================================
   GEOGRAPHY — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import {
  DynamicStyledField,
  ArrayField,
  FormSection,
} from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../../locationTypes"

export type GeographyFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function GeographyForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: GeographyFormProps) {
  return (
    <FormSection
      title="Geography"
      active={!!openSections["geography"]}
      onClick={() => toggleSection("geography")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="text"
          label="Highest Point Name"
          value={draft.data.geography.highestPoint.name ?? ""}
          onChange={(value: string) =>
            updateField("data.geography.highestPoint.name", value)
          }
          enableStyle
          style={(draft.data.geography.highestPoint as any).nameStyle}
          onStyleChange={(style) =>
            updateField("data.geography.highestPoint.nameStyle", style)
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DynamicStyledField
            type="number"
            label="Highest Point Elevation"
            value={draft.data.geography.highestPoint.elevation ?? ""}
            onChange={(value: any) =>
              updateField(
                "data.geography.highestPoint.elevation",
                Number(value)
              )
            }
          />

          <DynamicStyledField
            type="text"
            label="Unit"
            value={draft.data.geography.highestPoint.unit ?? ""}
            onChange={(value: string) =>
              updateField("data.geography.highestPoint.unit", value)
            }
          />
        </div>

        <ArrayField
          label="Major Landscapes"
          values={draft.data.geography.majorLandscapes}
          onChange={(values) =>
            updateField("data.geography.majorLandscapes", values)
          }
        />

        <UniversalMultimediaForm
          section={draft.data.geography as any}
          content={draft.data.geography as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.geography", { ...draft.data.geography, ...patch })
          }
          updateSectionContent={(patch) =>
            updateField("data.geography", { ...draft.data.geography, ...patch })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={
            (draft.data.geography as any).backgroundMultimedia?.type
          }
          backgroundTypeStyleKey="locationGeographyBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#171717"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationGeographyBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationGeographyBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />
      </div>
    </FormSection>
  )
}

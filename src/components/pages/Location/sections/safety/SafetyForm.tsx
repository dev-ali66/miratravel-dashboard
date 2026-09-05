/* =====================================================
   SAFETY — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../../locationTypes"

export type SafetyFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function SafetyForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: SafetyFormProps) {
  return (
    <FormSection
      title="Safety"
      active={!!openSections["safety"]}
      onClick={() => toggleSection("safety")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="text"
          label="Emergency Number"
          value={draft.data.safety.emergencyNumber ?? ""}
          onChange={(value: string) =>
            updateField("data.safety.emergencyNumber", value)
          }
          enableStyle
          style={(draft.data.safety as any).emergencyNumberStyle}
          onStyleChange={(style) =>
            updateField("data.safety.emergencyNumberStyle", style)
          }
        />

        <DynamicStyledField
          type="textarea"
          label="Description"
          value={draft.data.safety.description ?? ""}
          onChange={(value: string) =>
            updateField("data.safety.description", value)
          }
          enableStyle
          style={(draft.data.safety as any).descriptionStyle}
          onStyleChange={(style) =>
            updateField("data.safety.descriptionStyle", style)
          }
        />

        <UniversalMultimediaForm
          section={draft.data.safety as any}
          content={draft.data.safety as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.safety", { ...draft.data.safety, ...patch })
          }
          updateSectionContent={(patch) =>
            updateField("data.safety", { ...draft.data.safety, ...patch })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={(draft.data.safety as any).backgroundMultimedia?.type}
          backgroundTypeStyleKey="locationSafetyBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#deddd5"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationSafetyBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationSafetyBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />
      </div>
    </FormSection>
  )
}

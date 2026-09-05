/* =====================================================
   INFO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../../locationTypes"

export type InfoFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function InfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: InfoFormProps) {
  return (
    <FormSection
      title="Info"
      active={!!openSections["info"]}
      onClick={() => toggleSection("info")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="textarea"
          label="Headline"
          value={draft.data.info.headline ?? ""}
          onChange={(value: string) => updateField("data.info.headline", value)}
          enableStyle
          style={(draft.data.info as any).headlineStyle}
          onStyleChange={(style) =>
            updateField("data.info.headlineStyle", style)
          }
        />

        <DynamicStyledField
          type="textarea"
          label="Description"
          value={draft.data.info.description ?? ""}
          onChange={(value: string) =>
            updateField("data.info.description", value)
          }
          enableStyle
          style={(draft.data.info as any).descriptionStyle}
          onStyleChange={(style) =>
            updateField("data.info.descriptionStyle", style)
          }
        />

        <UniversalMultimediaForm
          section={draft.data.info as any}
          content={draft.data.info as Record<string, any>}
          updateSection={(patch: any) =>
            updateField("data.info", { ...draft.data.info, ...patch })
          }
          updateSectionContent={(patch: any) =>
            updateField("data.info", { ...draft.data.info, ...patch })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={(draft.data.info as any).backgroundMultimedia?.type}
          backgroundTypeStyleKey="locationInfoBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#1a2e2a"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationInfoBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationInfoBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />
      </div>
    </FormSection>
  )
}

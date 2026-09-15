/* =====================================================
   SHARED INFO — FORM SECTION
   Simple form to edit shared info text used by previews.
===================================================== */

import { DynamicStyledField, FormSection } from "./fields"
import { UniversalMultimediaForm } from "../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../locationTypes"

export type SharedInfoFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function SharedInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: SharedInfoFormProps) {
  const sharedInfo = draft?.data?.sharedInfo ?? {}

  return (
    <FormSection
      title="Shared Info"
      active={!!openSections["shared-info"]}
      onClick={() => toggleSection("shared-info")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="textarea"
          label="Text"
          value={sharedInfo.text || "Add shared info details here."}
          onChange={(value: string) =>
            updateField("data.sharedInfo.text", value)
          }
          enableStyle
          style={sharedInfo.textStyle ?? undefined}
          onStyleChange={(style) =>
            updateField("data.sharedInfo.textStyle", style)
          }
        />

        <UniversalMultimediaForm
          section={sharedInfo as any}
          content={sharedInfo as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.sharedInfo", {
              ...sharedInfo,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.sharedInfo", {
              ...sharedInfo,
              ...patch,
            })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={(sharedInfo as any)?.backgroundMultimedia?.type}
          backgroundTypeStyleKey="locationSharedInfoBackgroundTypeStyle"
          sectionTitle="Shared Info Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#F7F6F2"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationSharedInfoBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationSharedInfoBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />
      </div>
    </FormSection>
  )
}

export default SharedInfoForm

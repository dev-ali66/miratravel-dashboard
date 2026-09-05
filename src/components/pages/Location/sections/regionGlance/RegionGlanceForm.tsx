/* =====================================================
   REGION GLANCE — FORM SECTION
   Card content is static demo content in the preview and
   intentionally has no CMS fields.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

export type RegionGlanceFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function RegionGlanceForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: RegionGlanceFormProps) {
  const glance = {
    ...emptyLocation.data.regionGlance,
    ...draft.data.regionGlance,
  }

  return (
    <FormSection
      title="Region Glance"
      active={!!openSections["region-glance"]}
      onClick={() => toggleSection("region-glance")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="text"
          label="Label"
          value={glance.label ?? ""}
          onChange={(value: string) =>
            updateField("data.regionGlance.label", value)
          }
          enableStyle
          style={(glance as any).labelStyle}
          onStyleChange={(style) =>
            updateField("data.regionGlance.labelStyle", style)
          }
        />
        <DynamicStyledField
          type="text"
          label="Title"
          value={glance.title ?? ""}
          onChange={(value: string) =>
            updateField("data.regionGlance.title", value)
          }
          enableStyle
          style={(glance as any).titleStyle}
          onStyleChange={(style) =>
            updateField("data.regionGlance.titleStyle", style)
          }
        />
        <DynamicStyledField
          type="textarea"
          label="Description"
          value={glance.description ?? ""}
          onChange={(value: string) =>
            updateField("data.regionGlance.description", value)
          }
          enableStyle
          style={(glance as any).descriptionStyle}
          onStyleChange={(style) =>
            updateField("data.regionGlance.descriptionStyle", style)
          }
        />

        <UniversalMultimediaForm
          section={glance as any}
          content={glance as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.regionGlance", { ...glance, ...patch })
          }
          updateSectionContent={(patch) =>
            updateField("data.regionGlance", { ...glance, ...patch })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={(glance as any).backgroundMultimedia?.type}
          backgroundTypeStyleKey="locationRegionGlanceBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#F7F6F2"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationRegionGlanceBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationRegionGlanceBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />
      </div>
    </FormSection>
  )
}

export default RegionGlanceForm

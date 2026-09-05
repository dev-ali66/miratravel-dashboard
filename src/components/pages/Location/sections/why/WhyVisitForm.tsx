/* =====================================================
   WHYVISIT — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import {
  DynamicStyledField,
  ArrayField,
  TextArrayField,
  FormSection,
} from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../../locationTypes"

export type WhyVisitFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function WhyVisitForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: WhyVisitFormProps) {
  return (
    <FormSection
      title="Why Visit"
      active={!!openSections["why"]}
      onClick={() => toggleSection("why")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="text"
          label="Subtitle"
          value={draft.data.why.subtitle ?? ""}
          onChange={(value: string) => updateField("data.why.subtitle", value)}
          enableStyle
          style={(draft.data.why as any).subtitleStyle}
          onStyleChange={(style) =>
            updateField("data.why.subtitleStyle", style)
          }
        />

        <DynamicStyledField
          type="text"
          label="Title"
          value={draft.data.why.title ?? ""}
          onChange={(value: string) => updateField("data.why.title", value)}
          enableStyle
          style={(draft.data.why as any).titleStyle}
          onStyleChange={(style) => updateField("data.why.titleStyle", style)}
        />

        <UniversalMultimediaForm
          section={draft.data.why as any}
          content={draft.data.why as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.why", { ...draft.data.why, ...patch })
          }
          updateSectionContent={(patch) =>
            updateField("data.why", { ...draft.data.why, ...patch })
          }
          contentMediaKey="imageMultimedia"
          backgroundType={draft.data.why.imageMultimedia?.type}
          sectionTitle="Why Visit Image"
          imageTitle="Why Visit Image"
          imageLabel="Why Visit image"
          imageFieldName="locationWhyVisitImage"
          showImageAltField
        />

        <UniversalMultimediaForm
          section={draft.data.why as any}
          content={draft.data.why as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.why", { ...draft.data.why, ...patch })
          }
          updateSectionContent={(patch) =>
            updateField("data.why", { ...draft.data.why, ...patch })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={(draft.data.why as any).backgroundMultimedia?.type}
          backgroundTypeStyleKey="locationWhyVisitBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#FFFFFF"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationWhyVisitBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationWhyVisitBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />

        <ArrayField
          label="Tags"
          values={draft.data.why.tags}
          onChange={(values) => updateField("data.why.tags", values)}
        />

        <TextArrayField
          label="Description Paragraphs"
          values={draft.data.why.description_paragraphs}
          onChange={(values) =>
            updateField("data.why.description_paragraphs", values)
          }
        />
      </div>
    </FormSection>
  )
}

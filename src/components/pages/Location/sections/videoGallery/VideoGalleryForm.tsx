/* =====================================================
   VIDEOGALLERY — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../../locationTypes"

export type VideoGalleryFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function VideoGalleryForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: VideoGalleryFormProps) {
  return (
    <FormSection
      title="Video Gallery"
      active={!!openSections["video-gallery"]}
      onClick={() => toggleSection("video-gallery")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="text"
          label="Alt"
          value={draft.data.videoGalary.alt ?? ""}
          onChange={(value: string) =>
            updateField("data.videoGalary.alt", value)
          }
        />

        <UniversalMultimediaForm
          section={draft.data.videoGalary as any}
          content={draft.data.videoGalary as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.videoGalary", {
              ...draft.data.videoGalary,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.videoGalary", {
              ...draft.data.videoGalary,
              ...patch,
            })
          }
          contentMediaKey="multimedia"
          backgroundType={draft.data.videoGalary.multimedia?.type}
          sectionTitle="Video Gallery Media"
          imageTitle="Video Gallery Thumbnail"
          imageLabel="Video gallery thumbnail"
          imageFieldName="locationVideoGalleryThumbnail"
          videoTitle="Video Gallery Video"
          videoLabel="Video gallery video"
          videoFieldName="locationVideoGalleryVideo"
          showImageAltField
          showVideoAltField
          showVideoSwitches
        />

        <UniversalMultimediaForm
          section={draft.data.videoGalary as any}
          content={draft.data.videoGalary as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.videoGalary", {
              ...draft.data.videoGalary,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.videoGalary", {
              ...draft.data.videoGalary,
              ...patch,
            })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={
            (draft.data.videoGalary as any).backgroundMultimedia?.type
          }
          backgroundTypeStyleKey="locationVideoGalleryBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#000000"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationVideoGalleryBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationVideoGalleryBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />
      </div>
    </FormSection>
  )
}

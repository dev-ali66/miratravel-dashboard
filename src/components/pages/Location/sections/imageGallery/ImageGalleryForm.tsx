/* =====================================================
   IMAGEGALLERY — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2 } from "lucide-react"
import type { LocationData, GalleryItem } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type ImageGalleryFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function ImageGalleryForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: ImageGalleryFormProps) {
  const updateGallery = (
    index: number,
    field: keyof GalleryItem,
    value: string
  ) =>
    updateArrayItem(draft.data.imageGalary, index, field, value, (next) =>
      updateField("data.imageGalary", next)
    )

  return (
    <FormSection
      title="Image Gallery"
      active={!!openSections["image-gallery"]}
      onClick={() => toggleSection("image-gallery")}
    >
      <div className="space-y-4">
        <UniversalMultimediaForm
          section={draft.data.imageGalary as any}
          content={draft.data.imageGalary as unknown as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.imageGalary", {
              ...draft.data.imageGalary,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.imageGalary", {
              ...draft.data.imageGalary,
              ...patch,
            })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={
            (draft.data.imageGalary as any)?.backgroundMultimedia?.type
          }
          backgroundTypeStyleKey="locationImageGalleryBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#000000"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationImageGalleryBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationImageGalleryBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {draft.data.imageGalary.length} image
            {draft.data.imageGalary.length !== 1 ? "s" : ""}
          </p>

          <button
            type="button"
            onClick={() =>
              updateField("data.imageGalary", [
                ...draft.data.imageGalary,
                { id: Date.now(), src: "", alt: "" },
              ])
            }
            className="flex items-center gap-1 text-xs font-medium text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Image
          </button>
        </div>

        <div className="space-y-4">
          {draft.data.imageGalary.map((item, index) => (
            <div
              key={(item as any).id ?? index}
              className="flex items-start gap-3 rounded-lg border border-border/60 p-3"
            >
              <div className="flex-1 space-y-3">
                <UniversalMultimediaForm
                  section={item as any}
                  content={item as Record<string, any>}
                  updateSection={(patch) =>
                    updateField(
                      "data.imageGalary",
                      draft.data.imageGalary.map((galleryItem, itemIndex) =>
                        itemIndex === index
                          ? { ...galleryItem, ...patch }
                          : galleryItem
                      )
                    )
                  }
                  updateSectionContent={(patch) =>
                    updateField(
                      "data.imageGalary",
                      draft.data.imageGalary.map((galleryItem, itemIndex) =>
                        itemIndex === index
                          ? { ...galleryItem, ...patch }
                          : galleryItem
                      )
                    )
                  }
                  contentMediaKey="imageMultimedia"
                  backgroundType={item.imageMultimedia?.type}
                  sectionTitle="Gallery Image"
                  imageTitle="Gallery Image"
                  imageLabel="Gallery image"
                  imageFieldName={`locationImageGallery${index + 1}`}
                  showImageAltField
                />

                <DynamicStyledField
                  type="text"
                  label="Alt"
                  value={item.alt ?? ""}
                  onChange={(value: string) =>
                    updateGallery(index, "alt", value)
                  }
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  updateField(
                    "data.imageGalary",
                    draft.data.imageGalary.filter((_, i) => i !== index)
                  )
                }
                className="mt-6 h-9 rounded-lg border border-border/60 px-2 text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </FormSection>
  )
}

/* =====================================================
   JOURNEYS — GALLERY FORM SECTION
===================================================== */

import { Plus, Trash2 } from "lucide-react"
import { FormSection, JourneyInputField } from "../../shared/fields"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import type { Journey } from "../../journeyTypes"

export type GalleryFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function GalleryForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: GalleryFormProps) {
  const galleryData = draft.data?.gallery || {
    title: "Journey Visuals & Moments",
    images: [],
  }

  const images = galleryData.images || []

  const handleAddImage = () => {
    const next = [
      ...images,
      {
        url: "",
        caption: "",
        alt: "",
      },
    ]
    updateField("data.gallery.images", next)
  }

  const handleUpdateImage = (index: number, field: string, val: string) => {
    const next = [...images]
    next[index] = { ...next[index], [field]: val }
    updateField("data.gallery.images", next)
  }

  const handleRemoveImage = (index: number) => {
    const next = images.filter((_, i) => i !== index)
    updateField("data.gallery.images", next)
  }

  return (
    <FormSection
      title="Curated Image Gallery"
      active={!!openSections["gallery"]}
      onClick={() => toggleSection("gallery")}
      badge={`${images.length} Photos`}
    >
      <div className="space-y-4">
        <JourneyInputField
          label="Gallery Title"
          value={galleryData.title ?? "Journey Visuals & Moments"}
          onChange={(val) => updateField("data.gallery.title", val)}
        />

        <div className="space-y-3 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Images ({images.length})
            </label>
            <button
              type="button"
              onClick={handleAddImage}
              className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <Plus className="h-3.5 w-3.5" /> Add Photo
            </button>
          </div>

          <div className="space-y-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border/70 bg-background p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Photo #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <ImageUploadField
                  label=""
                  value={img.url}
                  onChange={(url) => handleUpdateImage(idx, "url", url || "")}
                  fieldName={`gallery_img_${idx + 1}`}

                />

                <div className="grid grid-cols-2 gap-2">
                  <JourneyInputField
                    label="Caption"
                    value={img.caption ?? ""}
                    onChange={(val) => handleUpdateImage(idx, "caption", val)}
                    placeholder="e.g. Grunas waterfall in afternoon light"
                  />
                  <JourneyInputField
                    label="Alt Text"
                    value={img.alt ?? ""}
                    onChange={(val) => handleUpdateImage(idx, "alt", val)}
                    placeholder="e.g. Grunas waterfall cascade"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  )
}

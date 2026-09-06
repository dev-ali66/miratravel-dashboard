/* =====================================================
   JOURNEYS — GALLERY FORM SECTION
   Directly manages Prisma field: journeyGallery String[]
===================================================== */

import { Plus, Trash2 } from "lucide-react"
import {
  FormSection,
  DynamicStyledField,
  UniversalMultimediaForm,
} from "../../shared/fields"
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

  const images: { url: string; caption?: string; alt?: string }[] =
    galleryData.images || []

  const syncGallery = (next: typeof images) => {
    updateField("data.gallery.images", next)
    const urls = next.map((img) => img.url).filter(Boolean)
    updateField("journeyGallery", urls)
  }

  const handleAddImage = () => {
    const next = [
      ...images,
      {
        url: "",
        caption: "",
        alt: "",
      },
    ]
    syncGallery(next)
  }

  const handleUpdateImage = (index: number, field: string, val: string) => {
    const next = [...images]
    next[index] = { ...next[index], [field]: val }
    syncGallery(next)
  }

  const handleRemoveImage = (index: number) => {
    const next = images.filter((_, i) => i !== index)
    syncGallery(next)
  }

  return (
    <FormSection
      title="Curated Image Gallery"
      active={!!openSections["gallery"]}
      onClick={() => toggleSection("gallery")}
      badge={`${images.length} Photos`}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="text"
          label="Gallery Section Title"
          value={galleryData.title ?? "Journey Visuals & Moments"}
          onChange={(val: string) => updateField("data.gallery.title", val)}
          enableStyle
          style={(draft.data?.gallery as any)?.titleStyle}
          onStyleChange={(style) => updateField("data.gallery.titleStyle", style)}
        />

        {/* Section Background Multimedia */}
        <div className="pt-2 border-t border-border/60">
          <UniversalMultimediaForm
            section={((draft.data?.gallery as any) || {}) as any}
            content={((draft.data?.gallery as any) || {}) as Record<string, any>}
            updateSection={(patch) =>
              updateField("data.gallery", {
                ...((draft.data?.gallery as any) || {}),
                ...patch,
              })
            }
            updateSectionContent={(patch) =>
              updateField("data.gallery", {
                ...((draft.data?.gallery as any) || {}),
                ...patch,
              })
            }
            contentMediaKey="backgroundMultimedia"
            backgroundType={(draft.data?.gallery as any)?.backgroundMultimedia?.type ?? "color"}
            backgroundTypeStyleKey="journeyGalleryBackgroundTypeStyle"
            sectionTitle="Gallery Section Background"
            showColorPicker
            colorLabel="Gallery background color"
            defaultColor="#000000"
            imageTitle="Background Image"
            imageLabel="Background image"
            imageFieldName="journeyGalleryBackgroundImage"
            videoTitle="Background Video"
            videoLabel="Background video"
            videoFieldName="journeyGalleryBackgroundVideo"
            showImageAltField
            showVideoSwitches
          />
        </div>

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
            {images.map((img, idx) => {
              const imgItem = {
                id: idx,
                url: img.url,
                caption: img.caption,
                alt: img.alt,
                imageMultimedia: {
                  type: "image" as const,
                  url: img.url,
                  alt: img.alt || img.caption || `Gallery photo ${idx + 1}`,
                },
              }

              return (
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

                  <UniversalMultimediaForm
                    section={imgItem as any}
                    content={imgItem}
                    updateSection={(patch) => {
                      const nextUrl =
                        (patch as any)?.imageMultimedia?.url ??
                        (patch as any)?.url ??
                        img.url
                      handleUpdateImage(idx, "url", nextUrl)
                    }}
                    updateSectionContent={(patch) => {
                      const nextUrl =
                        (patch as any)?.imageMultimedia?.url ??
                        (patch as any)?.url ??
                        img.url
                      handleUpdateImage(idx, "url", nextUrl)
                    }}
                    contentMediaKey="imageMultimedia"
                    backgroundType="image"
                    sectionTitle={`Gallery Photo #${idx + 1}`}
                    showColorPicker={false}
                    imageTitle="Gallery Photo"
                    imageLabel="Photo"
                    imageFieldName={`gallery_img_${idx + 1}`}
                    showImageAltField
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <DynamicStyledField
                      type="text"
                      label="Caption"
                      value={img.caption ?? ""}
                      onChange={(val: string) => handleUpdateImage(idx, "caption", val)}
                      placeholder="e.g. Grunas waterfall in afternoon light"
                    />
                    <DynamicStyledField
                      type="text"
                      label="Alt Text"
                      value={img.alt ?? ""}
                      onChange={(val: string) => handleUpdateImage(idx, "alt", val)}
                      placeholder="e.g. Grunas waterfall cascade"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </FormSection>
  )
}

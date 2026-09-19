import type { JourneyData, GalleryMediaItem } from "../../journeyTypes"
import { FormSection, Field, ImageField, VideoField } from "../../shared/fields"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2, Image as ImageIcon } from "lucide-react"

interface GalleryFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function GalleryForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: GalleryFormProps) {
  const isOpen = Boolean(openSections["gallery"])
  const galleryData = draft.gallery || {}
  const items = galleryData.items || []

  const addMediaItem = (type: "image" | "video") => {
    const newItem: GalleryMediaItem = {
      id: `gal-${Date.now()}`,
      title: type === "image" ? "Photo Shot" : "Video Experience",
      type,
      url: "",
      caption: "",
    }
    updateField("gallery.items", [...items, newItem])
  }

  const removeItem = (index: number) => {
    updateField(
      "gallery.items",
      items.filter((_, i) => i !== index)
    )
  }

  return (
    <FormSection
      title="Journey Photo & Media Gallery"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("gallery")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Badge Text"
          value={galleryData.badge || ""}
          onChange={(val) => updateField("gallery.badge", val)}
          placeholder="e.g. Visual Story"
        />

        <Field
          label="Section Title"
          value={galleryData.title || ""}
          onChange={(val) => updateField("gallery.title", val)}
          placeholder="e.g. Journey Gallery"
        />
      </div>

      <Field
        label="Gallery Description"
        value={galleryData.description || ""}
        onChange={(val) => updateField("gallery.description", val)}
        multiline
        rows={2}
      />

      {/* Media Items Grid / List */}
      <div className="space-y-4 pt-3 border-t border-border/40">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4 text-primary" />
            Gallery Items ({items.length})
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addMediaItem("image")}
              className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Photo
            </button>
            <button
              type="button"
              onClick={() => addMediaItem("video")}
              className="flex items-center gap-1 rounded bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Video
            </button>
          </div>
        </div>

        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="rounded-xl border border-border/70 bg-card p-4 space-y-3 relative shadow-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                #{idx + 1} [{item.type.toUpperCase()}] {item.title || "Untitled"}
              </span>

              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field
                label="Media Title"
                value={item.title || ""}
                onChange={(val) => updateField(`gallery.items.${idx}.title`, val)}
              />

              <Field
                label="Caption / Subtitle"
                value={item.caption || ""}
                onChange={(val) => updateField(`gallery.items.${idx}.caption`, val)}
              />
            </div>

            {item.type === "image" ? (
              <ImageField
                label="Image URL"
                value={item.url || ""}
                onChange={(url) => updateField(`gallery.items.${idx}.url`, url)}
              />
            ) : (
              <VideoField
                label="Video URL"
                value={item.url || ""}
                onChange={(url) => updateField(`gallery.items.${idx}.url`, url)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mandatory Section Background Multimedia */}
      <div className="pt-4 border-t border-border/40">
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">
          Gallery Section Background Multimedia
        </label>
        <UniversalMultimediaForm
          value={galleryData.backgroundMultimedia || { show: "color", color: { color: "#0f172a" } }}
          onChange={(val) => updateField("gallery.backgroundMultimedia", val)}
        />
      </div>
    </FormSection>
  )
}

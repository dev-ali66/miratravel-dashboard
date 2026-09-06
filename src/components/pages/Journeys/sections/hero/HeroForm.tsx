/* =====================================================
   JOURNEYS — HERO FORM SECTION
===================================================== */

import { Plus, Trash2 } from "lucide-react"
import {
  FormSection,
  JourneyInputField,
  JourneySelectField,
} from "../../shared/fields"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import type { Journey } from "../../journeyTypes"

export type HeroFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function HeroForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: HeroFormProps) {
  const heroData = (draft.data?.hero || {}) as Record<string, any>
  const media = heroData.media || { type: "image", src: "", alt: "" }
  const benefits = heroData.benefits || []

  const handleAddBenefit = () => {
    const next = [...benefits, ""]
    updateField("data.hero.benefits", next)
  }

  const handleBenefitChange = (index: number, val: string) => {
    const next = [...benefits]
    next[index] = val
    updateField("data.hero.benefits", next)
  }

  const handleRemoveBenefit = (index: number) => {
    const next = benefits.filter((_: any, i: number) => i !== index)
    updateField("data.hero.benefits", next)
  }

  return (
    <FormSection
      title="Hero & Media"
      active={!!openSections["hero"]}
      onClick={() => toggleSection("hero")}
    >
      <div className="space-y-4">
        <JourneyInputField
          label="Hero Badge Label"
          value={heroData.badge ?? ""}
          onChange={(val) => updateField("data.hero.badge", val)}
          placeholder="e.g. Signature Itinerary"
          description="Displays as a small pill badge above the hero title."
        />

        {/* Media Type */}
        <JourneySelectField<"image" | "video">
          label="Background Media Type"
          value={media.type || "image"}
          options={[
            { label: "Image", value: "image" },
            { label: "Video", value: "video" },
          ]}
          onChange={(val) =>
            updateField("data.hero.media", { ...media, type: val })
          }
        />

        {/* Image Upload */}
        {media.type !== "video" && (
          <ImageUploadField
            label="Hero Background Image"
            value={media.src || ""}
            onChange={(url) =>
              updateField("data.hero.media", {
                ...media,
                src: url || "",
              })
            }
            fieldName="journey_hero_image"
          />
        )}

        {/* Video URL */}
        {media.type === "video" && (
          <JourneyInputField
            label="Hero Background Video URL"
            value={media.src || ""}
            onChange={(val) =>
              updateField("data.hero.media", { ...media, src: val })
            }
            placeholder="https://res.cloudinary.com/.../hero.mp4"
          />
        )}

        {/* Alt Text */}
        <JourneyInputField
          label="Media Alt Text / Description"
          value={media.alt || ""}
          onChange={(val) =>
            updateField("data.hero.media", { ...media, alt: val })
          }
          placeholder="e.g. Aerial view of the Albanian Riviera"
        />

        {/* Also support legacy background_image field */}
        <JourneyInputField
          label="Legacy Background Image URL"
          value={heroData.background_image ?? ""}
          onChange={(val) => updateField("data.hero.background_image", val)}
          placeholder="https://res.cloudinary.com/..."
          description="Used as fallback if Media above is not set."
        />

        {/* Hero Benefits / Quick Highlights */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Hero Key Highlights / Benefits
            </label>
            <button
              type="button"
              onClick={handleAddBenefit}
              className="flex items-center gap-1 rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <Plus className="h-3 w-3" /> Add Benefit
            </button>
          </div>

          <div className="space-y-2">
            {benefits.map((benefit: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  placeholder="e.g. Private boat charter through Komani Lake"
                  className="flex-1 rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(index)}
                  className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  )
}

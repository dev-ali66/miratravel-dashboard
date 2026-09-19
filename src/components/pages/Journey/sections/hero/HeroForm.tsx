import type { JourneyData } from "../../journeyTypes"
import { FormSection, Field } from "../../shared/fields"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"

interface HeroFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function HeroForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: HeroFormProps) {
  const isOpen = Boolean(openSections["hero"])
  const heroData = draft.hero || {}

  return (
    <FormSection
      title="Hero Banner & Header Configuration"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("hero")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Hero Label"
          value={heroData.label || ""}
          onChange={(val) => updateField("hero.label", val)}
          placeholder="e.g. MIRA EXCLUSIVE JOURNEY"
        />

        <Field
          label="Hero Badge Text"
          value={heroData.badge || ""}
          onChange={(val) => updateField("hero.badge", val)}
          placeholder="e.g. Bespoke Experience"
        />
      </div>

      <Field
        label="Hero Main Title"
        value={heroData.title || ""}
        onChange={(val) => updateField("hero.title", val)}
        placeholder="Defaults to Journey Title if empty"
      />

      <Field
        label="Hero Subtitle / Narrative"
        value={heroData.subtitle || ""}
        onChange={(val) => updateField("hero.subtitle", val)}
        multiline
        rows={3}
        placeholder="Captivating introductory narrative for hero section..."
      />

      {/* Mandatory Section Background Multimedia */}
      <div className="pt-4 border-t border-border/40">
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">
          Hero Section Background Multimedia (Image / Video / Color Overlay)
        </label>
        <UniversalMultimediaForm
          value={heroData.backgroundMultimedia || { show: "image" }}
          onChange={(val) => updateField("hero.backgroundMultimedia", val)}
        />
      </div>
    </FormSection>
  )
}

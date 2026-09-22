import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { JourneyData } from "../../journeyTypes"

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

  const updateHeroField = (fieldKey: string, value: any) => {
    updateField(`hero.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Hero Banner & Header Configuration"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("hero")}
    >
      <div className="flex flex-col gap-5">
        {/* Hero Label */}
        <DynamicStyledField
          type="text"
          label="Hero Category Label"
          fieldName="hero.label"
          placeholder="e.g. MIRA EXCLUSIVE JOURNEY"
          value={heroData.label}
          onChange={(val) => updateHeroField("label", val)}
        />

        {/* Hero Badge */}
        <DynamicStyledField
          type="text"
          label="Hero Badge Text"
          fieldName="hero.badge"
          placeholder="e.g. Bespoke Experience"
          value={heroData.badge}
          onChange={(val) => updateHeroField("badge", val)}
        />

        {/* Hero Title */}
        <DynamicStyledField
          type="textarea"
          rows={2}
          label="Hero Main Title"
          fieldName="hero.title"
          placeholder="e.g. Classic Albania & The Ionian Coast"
          value={heroData.title}
          onChange={(val) => updateHeroField("title", val)}
        />

        {/* Hero Subtitle */}
        <DynamicStyledField
          type="textarea"
          rows={3}
          label="Hero Subtitle / Tagline"
          fieldName="hero.subtitle"
          placeholder="Captivating introductory narrative for hero section..."
          value={heroData.subtitle}
          onChange={(val) => updateHeroField("subtitle", val)}
        />

        {/* CTA Buttons */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <ButtonsField
            label="Call to Action (CTA) Buttons"
            fieldName="hero.buttons"
            buttons={Array.isArray(heroData.buttons) ? heroData.buttons : []}
            onChange={(buttons) => updateHeroField("buttons", buttons)}
          />
        </div>

        {/* Universal Multimedia Background */}
        <UniversalMultimediaForm
          title="Hero Background Media (Image / Video / Color Overlay)"
          fieldName="hero.backgroundMultimedia"
          imageFieldName="journeyHeroBackgroundImage"
          videoFieldName="journeyHeroBackgroundVideo"
          value={heroData.backgroundMultimedia || { show: "image" }}
          onChange={(val) => updateHeroField("backgroundMultimedia", val)}
        />
      </div>
    </FormSection>
  )
}

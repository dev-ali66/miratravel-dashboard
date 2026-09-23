import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
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
      title="Hero Banner Configuration"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("hero")}
    >
      <div className="flex flex-col gap-5">
        {/* Eyebrow / Label */}
        <DynamicStyledField
          type="text"
          label="Eyebrow Text"
          fieldName="hero.label"
          placeholder="e.g. MIRA EXCLUSIVE JOURNEY"
          value={heroData.label}
          onChange={(val) => updateHeroField("label", val)}
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


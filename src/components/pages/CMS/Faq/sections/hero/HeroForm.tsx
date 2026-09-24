import {
  FormSection,
  DynamicStyledField,
} from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { emptyFaqHero } from "../../config/emptyFaqPayload"

export interface HeroFormProps {
  section: any
  index: number
  updateSection: (index: number, patch: Record<string, any>) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number
}

export function HeroForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: HeroFormProps) {
  const hero = section || {}
  const isOpen = Boolean(openSections["hero"])

  const updateHeroField = (fieldKey: string, value: any) => {
    updateSection(index, { [fieldKey]: value })
  }

  return (
    <FormSection
      title="FAQ Hero & Header Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("hero")}
    >
      <div className="flex flex-col gap-5">
        {/* Eyebrow */}
        <DynamicStyledField
          type="text"
          label="Eyebrow / Category Tag"
          fieldName="hero.eyebrow"
          placeholder="e.g. Support & Information"
          value={hero.eyebrow}
          onChange={(val) => updateHeroField("eyebrow", val)}
        />

        {/* Main Title */}
        <DynamicStyledField
          type="text"
          label="Hero Title"
          fieldName="hero.title"
          placeholder="e.g. Frequently Asked Questions"
          value={hero.title}
          onChange={(val) => updateHeroField("title", val)}
        />

        {/* Subtitle / Description */}
        <DynamicStyledField
          type="textarea"
          rows={3}
          label="Hero Description"
          fieldName="hero.description"
          placeholder="Practical answers for every stage of your journey..."
          value={hero.description}
          onChange={(val) => updateHeroField("description", val)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-border/70 bg-card p-4">
          <DynamicStyledField
            type="text"
            label="Help Callout Title"
            fieldName="hero.helpTitle"
            placeholder="e.g. Can't find your answer?"
            value={hero.helpTitle}
            onChange={(val) => updateHeroField("helpTitle", val)}
          />

          <DynamicStyledField
            type="text"
            label="Help Callout Subtitle"
            fieldName="hero.helpSubtitle"
            placeholder="e.g. Our Mira Travel Specialist are always happy to help."
            value={hero.helpSubtitle}
            onChange={(val) => updateHeroField("helpSubtitle", val)}
          />
        </div>

        {/* Universal Multimedia / Panoramic Hero Image */}
        <UniversalMultimediaForm
          title="Hero Right Side Panoramic Image / Media"
          fieldName="hero.imageMultimedia"
          defaultShow="image"
          imageFieldName="cmsFaqHeroImage"
          value={
            hero.imageMultimedia || emptyFaqHero.imageMultimedia
          }
          onChange={(multimedia) =>
            updateHeroField("imageMultimedia", multimedia)
          }
        />
      </div>
    </FormSection>
  )
}

export default HeroForm

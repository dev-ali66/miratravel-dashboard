import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "@/components/pages/Location/shared/fields"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"
import { emptyHero } from "../../shared/emptyExperience"

export function HeroForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: ExperienceFormSectionProps) {
  const hero = draft?.hero || {}
  const isOpen = Boolean(openSections["hero"])

  const updateHeroField = (fieldKey: string, value: any) => {
    updateField(`hero.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Hero Banner"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("hero")}
    >
      <div className="flex flex-col gap-5">
        {/* Breadcrumb / Navigation Tag */}
        <DynamicStyledField
          type="text"
          label="Category Tag / Breadcrumb"
          fieldName="hero.breadcrumb"
          placeholder="e.g. CURATED EXPERIENCE / HELICOPTER SAFARI"
          value={hero.breadcrumb}
          onChange={(val) => updateHeroField("breadcrumb", val)}
        />

        {/* Hero Main Title */}
        <DynamicStyledField
          type="text"
          label="Hero Title"
          fieldName="hero.title"
          placeholder="e.g. Soar Above the Wild Peaks of Albania"
          value={hero.title}
          onChange={(val) => updateHeroField("title", val)}
        />

        {/* Hero Subtitle / Tagline */}
        <DynamicStyledField
          type="text"
          label="Subtitle / Tagline"
          fieldName="hero.subtitle"
          placeholder="e.g. An exclusive private expedition above untamed glacial canyons"
          value={hero.subtitle}
          onChange={(val) => updateHeroField("subtitle", val)}
        />

        {/* Editorial Description with RichText Editor */}
        <DynamicStyledField
          type="richtext"
          label="Editorial Description"
          fieldName="hero.description"
          placeholder="Write the introduction narrative shown on the experience hero banner..."
          value={hero.description}
          onChange={(val) => updateHeroField("description", val)}
        />

        {/* CTA Buttons */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <ButtonsField
            label="Call to Action (CTA) Buttons"
            fieldName="hero.buttons"
            buttons={Array.isArray(hero.buttons) ? hero.buttons : []}
            onChange={(buttons) => updateHeroField("buttons", buttons)}
          />
        </div>

        {/* Universal Multimedia / Background Media */}
        <UniversalMultimediaForm
          title="Hero Background Media"
          fieldName="hero.backgroundMultimedia"
          imageFieldName="experienceHeroBackgroundImage"
          videoFieldName="experienceHeroBackgroundVideo"
          value={hero.backgroundMultimedia || hero.multimedia || emptyHero.backgroundMultimedia}
          onChange={(multimedia) => updateHeroField("backgroundMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default HeroForm

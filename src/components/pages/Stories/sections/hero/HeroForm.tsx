import { useDevMode } from "@/context/DevModeContext"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { StoryFormSectionProps } from "../../config/storySections"
import { emptyHero } from "./emptyHero"

export function HeroForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: StoryFormSectionProps) {
  const { isDevMode } = useDevMode()
  const hero = draft?.hero || (draft as any)?.data?.hero || {}
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
          label="Breadcrumb / Category Tag"
          fieldName="hero.breadcrumb"
          placeholder="e.g. THE BALKANS / STORIES / NORTH ALBANIA"
          value={hero.breadcrumb}
          onChange={(val) => updateHeroField("breadcrumb", val)}
        />

        {/* Hero Main Title */}
        <DynamicStyledField
          type="text"
          label="Hero Title"
          fieldName="hero.title"
          placeholder="e.g. Exploring the Northern Peaks & Valleys"
          value={hero.title}
          onChange={(val) => updateHeroField("title", val)}
        />

        {/* Hero Subtitle / Catchphrase */}
        <DynamicStyledField
          type="text"
          label="Subtitle / Tagline"
          fieldName="hero.subtitle"
          placeholder="e.g. A Journey Through Uncharted Valleys"
          value={hero.subtitle}
          onChange={(val) => updateHeroField("subtitle", val)}
        />

        {/* Editorial Description with RichText Editor */}
        <DynamicStyledField
          type="richtext"
          label="Editorial Description"
          fieldName="hero.description"
          placeholder="Write the introduction paragraph shown on the hero banner..."
          value={hero.description}
          onChange={(val) => updateHeroField("description", val)}
        />

        {/* Content Alignment (Only shown when Dev Mode is ON) */}
        {isDevMode && (
          <DynamicStyledField
            type="radio"
            label="Layout Alignment"
            fieldName="hero.isCenter"
            value={hero.isCenter === false ? "left" : "center"}
            options={[
              { label: "Bottom-Left Aligned", value: "left" },
              { label: "Center Aligned", value: "center" },
            ]}
            onChange={(val) => updateHeroField("isCenter", val === "center")}
          />
        )}

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
          imageFieldName="storyHeroBackgroundImage"
          videoFieldName="storyHeroBackgroundVideo"
          value={hero.backgroundMultimedia || hero.multimedia || emptyHero.backgroundMultimedia}
          onChange={(multimedia) => updateHeroField("backgroundMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default HeroForm

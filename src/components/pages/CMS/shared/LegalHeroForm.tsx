import {
  FormSection,
  DynamicStyledField,
} from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import type { LegalHeroData } from "@/components/pages/CMS/shared/legalHeroDefaults"

export interface LegalHeroFormProps {
  hero: LegalHeroData
  onChange: (updatedHero: LegalHeroData) => void
  isOpen?: boolean
  onToggle?: () => void
  sectionNumber?: number | string
  title?: string
}

export function LegalHeroForm({
  hero,
  onChange,
  isOpen = true,
  onToggle,
  sectionNumber = 1,
  title = "Hero Banner",
}: LegalHeroFormProps) {
  const updateHeroField = (fieldKey: string, value: any) => {
    onChange({
      ...hero,
      [fieldKey]: value,
    })
  }

  return (
    <FormSection
      title={title}
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={onToggle || (() => {})}
    >
      <div className="flex flex-col gap-5">
        {/* Breadcrumb / Category Tag */}
        <DynamicStyledField
          type="text"
          label="Breadcrumb / Category Tag"
          fieldName="hero.breadcrumb"
          placeholder="e.g. MIRA ARCHIVE"
          value={hero?.breadcrumb}
          onChange={(val) => updateHeroField("breadcrumb", val)}
        />

        {/* Hero Main Title */}
        <DynamicStyledField
          type="textarea"
          rows={2}
          label="Hero Title"
          fieldName="hero.title"
          placeholder="e.g. Terms & Conditions"
          value={hero?.title}
          onChange={(val) => updateHeroField("title", val)}
        />

        {/* Hero Subtitle / Catchphrase */}
        <DynamicStyledField
          type="text"
          label="Subtitle / Tagline"
          fieldName="hero.subtitle"
          placeholder="e.g. Please review the legal terms..."
          value={hero?.subtitle}
          onChange={(val) => updateHeroField("subtitle", val)}
        />

        {/* Editorial Description with RichText Editor */}
        <DynamicStyledField
          type="richtext"
          label="Editorial Description"
          fieldName="hero.description"
          placeholder="Write the introduction paragraph shown on the hero banner..."
          value={hero?.description}
          onChange={(val) => updateHeroField("description", val)}
        />

        {/* Content Alignment */}
        <DynamicStyledField
          type="radio"
          label="Layout Alignment"
          fieldName="hero.isCenter"
          value={hero?.isCenter ? "center" : "left"}
          options={[
            { label: "Center Aligned", value: "center" },
            { label: "Bottom-Left Aligned", value: "left" },
          ]}
          onChange={(val) => updateHeroField("isCenter", val === "center")}
        />

        {/* CTA Buttons */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <ButtonsField
            label="Call to Action (CTA) Buttons"
            fieldName="hero.buttons"
            buttons={Array.isArray(hero?.buttons) ? hero.buttons : []}
            onChange={(buttons) => updateHeroField("buttons", buttons)}
          />
        </div>

        {/* Universal Multimedia / Background Media */}
        <UniversalMultimediaForm
          title="Hero Background Media"
          fieldName="hero.backgroundMultimedia"
          defaultShow="image"
          value={hero?.backgroundMultimedia}
          onChange={(multimedia) =>
            updateHeroField("backgroundMultimedia", multimedia)
          }
          allowImage={true}
          allowVideo={true}
          allowColor={true}
          collapsible={true}
          defaultOpen={true}
        />
      </div>
    </FormSection>
  )
}

export default LegalHeroForm

import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { StoryFormSectionProps } from "../../config/storySections"
import { emptyIntro } from "./emptyIntro"

export function IntroForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: StoryFormSectionProps) {
  const intro = draft?.intro || (draft as any)?.data?.intro || emptyIntro
  const isOpen = Boolean(openSections["intro"])

  const updateIntroField = (fieldKey: string, value: any) => {
    updateField(`intro.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Story Intro / Overview"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("intro")}
    >
      <div className="flex flex-col gap-5">
        {/* Intro Section Title */}
        <DynamicStyledField
          type="text"
          label="Section Title"
          fieldName="intro.title"
          placeholder="e.g. Story Overview"
          value={intro.title}
          onChange={(val) => updateIntroField("title", val)}
        />

        {/* Intro Subtitle */}
        <DynamicStyledField
          type="text"
          label="Subtitle / Tagline"
          fieldName="intro.subtitle"
          placeholder="e.g. A quick summary before diving deep..."
          value={intro.subtitle}
          onChange={(val) => updateIntroField("subtitle", val)}
        />

        {/* Lead Narrative Description (RichText) */}
        <DynamicStyledField
          type="richtext"
          label="Lead Story Summary (RichText)"
          fieldName="intro.description"
          placeholder="Write the introduction summary..."
          value={intro.description}
          onChange={(val) => updateIntroField("description", val)}
        />

        {/* Background / Side Multimedia */}
        <UniversalMultimediaForm
          title="Intro Section Media"
          fieldName="intro.backgroundMultimedia"
          imageFieldName="storyIntroMediaImage"
          videoFieldName="storyIntroMediaVideo"
          value={intro.backgroundMultimedia || emptyIntro.backgroundMultimedia}
          onChange={(multimedia) => updateIntroField("backgroundMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default IntroForm

import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "@/components/pages/Location/shared/fields"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"
import { emptyTheExperience } from "../../shared/emptyExperience"

export function TheExperienceForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: ExperienceFormSectionProps) {
  const theExp = draft?.theExperience || emptyTheExperience
  const isOpen = Boolean(openSections["the-experience"])

  const updateExpField = (fieldKey: string, value: any) => {
    updateField(`theExperience.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="The Experience (Core Narrative & Intro)"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("the-experience")}
    >
      <div className="flex flex-col gap-5">
        {/* Section Label */}
        <DynamicStyledField
          type="text"
          label="Section Eyebrow / Label"
          fieldName="theExperience.label"
          placeholder="e.g. THE EXPERIENCE"
          value={theExp.label}
          onChange={(val) => updateExpField("label", val)}
        />

        {/* Section Main Title */}
        <DynamicStyledField
          type="text"
          label="Headline Title"
          fieldName="theExperience.title"
          placeholder="e.g. An Aerial Odyssey Above Glacial Valleys & Untamed Canyons"
          value={theExp.title}
          onChange={(val) => updateExpField("title", val)}
        />

        {/* Short Inspirational Introduction / Summary */}
        <DynamicStyledField
          type="textarea"
          label="Inspirational Introduction"
          fieldName="theExperience.summary"
          placeholder="A vivid, evocative overview capturing the emotional resonance and sensory landscape of this encounter..."
          value={theExp.summary}
          onChange={(val) => updateExpField("summary", val)}
        />

        {/* Deep Dive Narrative (Rich Text) */}
        <DynamicStyledField
          type="richtext"
          label="Detailed Experience Narrative"
          fieldName="theExperience.narrative"
          placeholder="Detailed narrative describing what the guest will actually do, feel, and witness during this journey..."
          value={theExp.narrative}
          onChange={(val) => updateExpField("narrative", val)}
        />

        {/* Callout Quote */}
        <DynamicStyledField
          type="text"
          label="Editorial Pull Quote"
          fieldName="theExperience.quote"
          placeholder="e.g. 'To view the peaks from above is to witness Albania as only the eagles do.'"
          value={theExp.quote}
          onChange={(val) => updateExpField("quote", val)}
        />

        {/* Featured Experience Visual */}
        <UniversalMultimediaForm
          title="Featured Experience Visual"
          fieldName="theExperience.imageMultimedia"
          imageFieldName="theExperienceImage"
          videoFieldName="theExperienceVideo"
          value={theExp.imageMultimedia || emptyTheExperience.imageMultimedia}
          onChange={(multimedia) => updateExpField("imageMultimedia", multimedia)}
        />

        {/* Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background"
          fieldName="theExperience.backgroundMultimedia"
          imageFieldName="theExperienceBgImage"
          videoFieldName="theExperienceBgVideo"
          value={theExp.backgroundMultimedia || emptyTheExperience.backgroundMultimedia}
          onChange={(multimedia) => updateExpField("backgroundMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default TheExperienceForm

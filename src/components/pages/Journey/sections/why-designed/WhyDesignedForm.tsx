import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { FormSection } from "../../shared/fields"
import type { JourneyData } from "../../journeyTypes"

interface WhyDesignedFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function WhyDesignedForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: WhyDesignedFormProps) {
  const isOpen = Boolean(openSections["why-designed"])
  const whyData = draft.whyDesigned || draft.data?.whyDesigned || {}

  const updateWhyField = (fieldKey: string, value: any) => {
    updateField(`whyDesigned.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Why We Designed This Journey Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("why-designed")}
    >
      <div className="flex flex-col gap-5">
        {/* Eyebrow / Section Badge */}
        <DynamicStyledField
          type="text"
          label="Section Eyebrow Badge"
          fieldName="whyDesigned.badge"
          placeholder="e.g. THE MIRA DIFFERENCE"
          value={whyData.badge}
          onChange={(val) => updateWhyField("badge", val)}
        />

        {/* Section Main Title */}
        <DynamicStyledField
          type="textarea"
          rows={2}
          label="Main Title"
          fieldName="whyDesigned.title"
          placeholder="e.g. Why we designed this journey?"
          value={whyData.title}
          onChange={(val) => updateWhyField("title", val)}
        />

        {/* Narrative Description Paragraphs */}
        <DynamicStyledField
          type="textarea"
          rows={6}
          label="Narrative Description Paragraphs"
          fieldName="whyDesigned.description"
          placeholder="Write the editorial narrative paragraphs..."
          value={whyData.description}
          onChange={(val) => updateWhyField("description", val)}
        />

        {/* Signature Line */}
        <DynamicStyledField
          type="text"
          label="Signature Text"
          fieldName="whyDesigned.signature"
          placeholder="e.g. MIRA"
          value={whyData.signature}
          onChange={(val) => updateWhyField("signature", val)}
        />
      </div>
    </FormSection>
  )
}

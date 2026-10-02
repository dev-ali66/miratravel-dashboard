import {
  FormSection,
  DynamicStyledField,
} from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import type { JourneyCmsFormSectionProps } from "../../journeyCmsTypes"

export function JourneyCmsEditorialHighlightForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: JourneyCmsFormSectionProps) {
  const sectionKey = "editorial_highlight"
  const isOpen = Boolean(openSections[sectionKey])

  const highlightData =
    draft.editorial_highlight || draft?.data?.editorial_highlight || draft.sharedInfo || {}

  const updateHighlightField = (fieldKey: string, value: any) => {
    updateField(`editorial_highlight.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Journey CMS Editorial Highlight Statement"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex flex-col gap-5">
        {/* Main Editorial Statement / Quote Text */}
        <DynamicStyledField
          type="textarea"
          rows={3}
          label="Highlight Statement / Quote Text"
          fieldName="editorial_highlight.text"
          placeholder="e.g. Every journey with MIRA is an invitation to experience the soul of the Balkans..."
          value={highlightData.text}
          onChange={(val: any) => updateHighlightField("text", val)}
        />

        {/* Section Background Multimedia & Styling */}
        <UniversalMultimediaForm
          title="Section Background Media & Styling"
          value={highlightData.backgroundMultimedia}
          onChange={(val: any) => updateHighlightField("backgroundMultimedia", val)}
          defaultColor="#FAF6F0"
        />
      </div>
    </FormSection>
  )
}

export default JourneyCmsEditorialHighlightForm

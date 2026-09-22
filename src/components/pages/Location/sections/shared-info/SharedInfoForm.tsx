import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"

export function SharedInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const sectionKey = "shared-info"
  const isOpen = Boolean(openSections[sectionKey])

  const sharedData = draft.sharedInfo || (draft as any)?.data?.sharedInfo || {}
  const textData = sharedData.text

  const updateSharedInfoField = (fieldKey: string, value: any) => {
    updateField(`sharedInfo.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Shared Info / Editorial Highlight Statement"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex flex-col gap-5">
        {/* Main Editorial Statement / Quote Text */}
        <DynamicStyledField
          type="textarea"
          label="Highlight Statement / Quote Text"
          fieldName="sharedInfo.text"
          placeholder="e.g. Dhermi is not just a beach destination. It's where the mountains quietly meet the sea..."
          value={typeof textData === "object" && textData !== null ? textData.value : textData}
          onChange={(val: string) => updateSharedInfoField("text.value", val)}
          enableStyle
          style={typeof textData === "object" ? textData : { textColor: "#AF6348" }}
          onStyleChange={(st: any) =>
            updateSharedInfoField("text", {
              ...(typeof textData === "object" ? textData : {}),
              ...st,
            })
          }
        />

        {/* Section Background Multimedia & Styling */}
        <UniversalMultimediaForm
          title="Section Background Media & Styling"
          value={sharedData.backgroundMultimedia}
          onChange={(val: any) => updateSharedInfoField("backgroundMultimedia", val)}
          defaultColor="#FAF6F0"
        />
      </div>
    </FormSection>
  )
}

export default SharedInfoForm

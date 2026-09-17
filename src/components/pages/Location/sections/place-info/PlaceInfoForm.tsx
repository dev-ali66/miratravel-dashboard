import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"

export function PlaceInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const sectionKey = "place-info"
  const isOpen = Boolean(openSections[sectionKey])

  const infoData = draft.infoCard || draft.info || {}

  return (
    <FormSection
      title="Place Overview Statement"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex flex-col gap-5">
        {/* Main Headline / Title */}
        <DynamicStyledField
          type="text"
          label="Overview Title / Question"
          fieldName="headline"
          value={infoData.headline}
          onChange={(val: any) => updateField("infoCard.headline", val)}
          placeholder="e.g. What kind of city survives 2,400 years without losing its character?"
        />

        {/* Main Description */}
        <DynamicStyledField
          type="textarea"
          label="Overview Description"
          fieldName="description"
          value={infoData.description}
          onChange={(val: any) => updateField("infoCard.description", val)}
          placeholder="e.g. Dhërmi is one of the oldest continuously inhabited villages..."
        />

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Styling & Multimedia"
          value={infoData.backgroundMultimedia}
          onChange={(val: any) => updateField("infoCard.backgroundMultimedia", val)}
          defaultColor="#182d09"
        />
      </div>
    </FormSection>
  )
}


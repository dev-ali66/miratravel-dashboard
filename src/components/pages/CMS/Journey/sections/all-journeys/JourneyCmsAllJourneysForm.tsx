import {
  FormSection,
  DynamicStyledField,
} from "@/components/pages/CMS/shared/FormControls"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import type { JourneyCmsFormSectionProps } from "../../journeyCmsTypes"

export function JourneyCmsAllJourneysForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: JourneyCmsFormSectionProps) {
  const sectionKey = "all_journeys"
  const isOpen = Boolean(openSections[sectionKey])

  const allData =
    draft.all_journeys || draft?.data?.all_journeys || {}

  const updateAllField = (fieldKey: string, value: any) => {
    updateField(`all_journeys.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Journey CMS All Journeys Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex flex-col gap-5">
        {/* Eyebrow Label */}
        <DynamicStyledField
          type="text"
          label="Eyebrow / Category Tag"
          fieldName="all_journeys.eyebrow"
          placeholder="e.g. EXPLORE ALL"
          value={allData.eyebrow}
          onChange={(val: any) => updateAllField("eyebrow", val)}
        />

        {/* Section Title */}
        <DynamicStyledField
          type="textarea"
          rows={2}
          label="Section Title"
          fieldName="all_journeys.title"
          placeholder="e.g. All Journeys"
          value={allData.title}
          onChange={(val: any) => updateAllField("title", val)}
        />

        {/* Subtitle / Description */}
        <DynamicStyledField
          type="text"
          label="Subtitle / Description"
          fieldName="all_journeys.subtitle"
          placeholder="e.g. Browse our complete portfolio of Balkan journeys..."
          value={allData.subtitle}
          onChange={(val: any) => updateAllField("subtitle", val)}
        />

        {/* Search Placeholder Input */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Search Input Placeholder Text
          </Label>
          <Input
            type="text"
            placeholder="e.g. Search journeys by keyword..."
            value={allData.searchPlaceholder || ""}
            onChange={(e) => updateAllField("searchPlaceholder", e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        {/* Section Background Multimedia & Styling */}
        <UniversalMultimediaForm
          title="Section Background Media & Styling"
          value={allData.backgroundMultimedia}
          onChange={(val: any) => updateAllField("backgroundMultimedia", val)}
          defaultColor="#FFFFFF"
        />
      </div>
    </FormSection>
  )
}

export default JourneyCmsAllJourneysForm

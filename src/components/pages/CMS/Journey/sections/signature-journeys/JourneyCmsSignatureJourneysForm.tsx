import {
  FormSection,
  DynamicStyledField,
} from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import type { JourneyCmsFormSectionProps } from "../../journeyCmsTypes"

export function JourneyCmsSignatureJourneysForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: JourneyCmsFormSectionProps) {
  const sectionKey = "signature_journeys"
  const isOpen = Boolean(openSections[sectionKey])

  const sigData =
    draft.signature_journeys || draft?.data?.signature_journeys || {}

  const updateSigField = (fieldKey: string, value: any) => {
    updateField(`signature_journeys.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Journey CMS Signature Journeys"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex flex-col gap-5">
        {/* Eyebrow Label */}
        <DynamicStyledField
          type="text"
          label="Eyebrow / Subhead"
          fieldName="signature_journeys.eyebrow"
          placeholder="e.g. CURATED EXPERIENCES"
          value={sigData.eyebrow}
          onChange={(val: any) => updateSigField("eyebrow", val)}
        />

        {/* Section Title */}
        <DynamicStyledField
          type="textarea"
          rows={2}
          label="Section Title"
          fieldName="signature_journeys.title"
          placeholder="e.g. Signature Journeys"
          value={sigData.title}
          onChange={(val: any) => updateSigField("title", val)}
        />

        {/* Subtitle / Description */}
        <DynamicStyledField
          type="text"
          label="Subtitle / Description"
          fieldName="signature_journeys.subtitle"
          placeholder="e.g. Handcrafted multi-day itineraries..."
          value={sigData.subtitle}
          onChange={(val: any) => updateSigField("subtitle", val)}
        />

        {/* CTA Buttons */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <ButtonsField
            label="Section Action Buttons"
            fieldName="signature_journeys.buttons"
            buttons={Array.isArray(sigData.buttons) ? sigData.buttons : []}
            onChange={(buttons) => updateSigField("buttons", buttons)}
          />
        </div>

        {/* Section Background Multimedia & Styling */}
        <UniversalMultimediaForm
          title="Section Background Media & Styling"
          value={sigData.backgroundMultimedia}
          onChange={(val: any) => updateSigField("backgroundMultimedia", val)}
          defaultColor="#FAF7F2"
        />
      </div>
    </FormSection>
  )
}

export default JourneyCmsSignatureJourneysForm

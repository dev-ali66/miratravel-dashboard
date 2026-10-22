import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "@/components/pages/Location/shared/fields"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"
import { emptyEnquiryCta } from "../../shared/emptyExperience"

export function EnquiryCtaForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: ExperienceFormSectionProps) {
  const cta = draft?.enquiryCta || emptyEnquiryCta
  const isOpen = Boolean(openSections["enquiry-cta"])

  const updateCtaField = (fieldKey: string, value: any) => {
    updateField(`enquiryCta.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Enquiry CTA (Booking & Tailored Request)"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("enquiry-cta")}
    >
      <div className="flex flex-col gap-5">
        <p className="text-xs text-muted-foreground">
          Encourage travelers to include this experience into their custom journey or request a dedicated consultation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicStyledField
            type="text"
            label="Badge / Header Tag"
            fieldName="enquiryCta.badgeText"
            placeholder="e.g. EXPERIENCE RESERVATION"
            enableStyle={false}
            value={cta.badgeText || "EXPERIENCE RESERVATION"}
            onChange={(val) => updateCtaField("badgeText", val)}
          />

          <DynamicStyledField
            type="text"
            label="CTA Headline Title"
            fieldName="enquiryCta.title"
            placeholder="e.g. Include This Experience in Your Journey"
            value={cta.title}
            onChange={(val) => updateCtaField("title", val)}
          />
        </div>

        <DynamicStyledField
          type="textarea"
          label="Subtitle / Subtext"
          fieldName="enquiryCta.subtitle"
          placeholder="e.g. Our travel architects will seamlessly integrate this into your bespoke itinerary..."
          value={cta.subtitle}
          onChange={(val) => updateCtaField("subtitle", val)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DynamicStyledField
            type="text"
            label="Primary Button Label"
            fieldName="enquiryCta.primaryButtonText"
            placeholder="e.g. Include in My Journey"
            enableStyle={false}
            value={cta.primaryButtonText || "Include in My Journey"}
            onChange={(val) => updateCtaField("primaryButtonText", val)}
          />

          <DynamicStyledField
            type="text"
            label="Secondary Button Label"
            fieldName="enquiryCta.secondaryButtonText"
            placeholder="e.g. Enquire About This Experience"
            enableStyle={false}
            value={cta.secondaryButtonText || "Enquire About This Experience"}
            onChange={(val) => updateCtaField("secondaryButtonText", val)}
          />
        </div>

        <DynamicStyledField
          type="text"
          label="Bottom Explanatory Note"
          fieldName="enquiryCta.note"
          placeholder="e.g. Available exclusively as part of MIRA bespoke private journeys."
          value={cta.note}
          onChange={(val) => updateCtaField("note", val)}
        />

        <UniversalMultimediaForm
          title="CTA Background Media"
          fieldName="enquiryCta.backgroundMultimedia"
          imageFieldName="enquiryCtaBgImage"
          videoFieldName="enquiryCtaBgVideo"
          value={cta.backgroundMultimedia || emptyEnquiryCta.backgroundMultimedia}
          onChange={(multimedia) => updateCtaField("backgroundMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default EnquiryCtaForm

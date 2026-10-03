import {
  FormSection,
  DynamicStyledField,
} from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import type { NewsletterCmsFormSectionProps } from "../../newsletterCmsTypes"

export function SubscribeForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: NewsletterCmsFormSectionProps) {
  const subscribe =
    draft?.subscribe || draft?.data?.subscribe || draft?.hero || draft?.data?.hero || {}
  const isOpen = Boolean(openSections["subscribe"] || openSections["hero"])

  const updateSubscribeField = (fieldKey: string, value: any) => {
    updateField(`subscribe.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Newsletter Subscribe Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("subscribe")}
    >
      <div className="flex flex-col gap-5">
        {/* Title */}
        <DynamicStyledField
          type="textarea"
          rows={2}
          label="Subscribe Main Title"
          fieldName="subscribe.title"
          placeholder="e.g. A Curated Travel Perspective"
          value={subscribe.title}
          onChange={(val) => updateSubscribeField("title", val)}
          enableStyle
        />

        {/* Subtitle / Paragraph */}
        <DynamicStyledField
          type="textarea"
          rows={3}
          label="Subtitle / Introductory Paragraph"
          fieldName="subscribe.subtitle"
          placeholder="e.g. Thoughtful dispatches featuring curated Balkan travel inspiration..."
          value={subscribe.subtitle}
          onChange={(val) => updateSubscribeField("subtitle", val)}
          enableStyle
        />

        {/* Side Image / Media */}
        <UniversalMultimediaForm
          title="Left Column Showcase Image"
          fieldName="subscribe.leftSideMultimedia"
          allowImage={true}
          allowVideo={true}
          allowColor={true}
          defaultShow="image"
          imageTitle="Showcase Image"
          imageLabel="Expedition Showcase Image"
          value={subscribe.leftSideMultimedia}
          onChange={(val) => {
            updateSubscribeField("leftSideMultimedia", val)
          }}
        />

        {/* Background Multimedia */}
        <UniversalMultimediaForm
          title="Background Multimedia"
          fieldName="subscribe.backgroundMultimedia"
          allowImage={true}
          allowVideo={true}
          allowColor={true}
          defaultShow="color"
          imageTitle="Background Image"
          imageLabel="Page Background Image"
          value={subscribe.backgroundMultimedia}
          onChange={(val) => {
            updateSubscribeField("backgroundMultimedia", val)
          }}
        />
      </div>
    </FormSection>
  )
}

export default SubscribeForm

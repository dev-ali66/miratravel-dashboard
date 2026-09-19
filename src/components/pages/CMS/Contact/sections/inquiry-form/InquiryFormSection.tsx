import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import type { ContactFormSectionProps } from "../../config/contactSections"
import { emptyInquiryForm } from "./emptyInquiryForm"

export function InquiryFormSection({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: ContactFormSectionProps) {
  const inquiry = section || {}
  const isOpen = Boolean(openSections["inquiry-form"])

  const updateInquiryField = (fieldKey: string, value: any) => {
    updateSection(index, { [fieldKey]: value })
  }

  return (
    <FormSection
      title="Inquiry Form & Image Header"
      sectionNumber={String(sectionNumber)}
      active={isOpen}
      onClick={() => toggleSection("inquiry-form")}
    >
      <div className="flex flex-col gap-5">
        <DynamicStyledField
          type="text"
          label="Eyebrow / Subhead"
          fieldName="inquiry.eyebrow"
          placeholder="e.g. THE INQUIRY"
          value={inquiry.eyebrow}
          onChange={(val) => updateInquiryField("eyebrow", val)}
        />

        <DynamicStyledField
          type="text"
          label="Main Section Title"
          fieldName="inquiry.title"
          placeholder="e.g. Plan your escape"
          value={inquiry.title}
          onChange={(val) => updateInquiryField("title", val)}
        />

        <UniversalMultimediaForm
          title="Right-side Featured Image / Media"
          fieldName="inquiry.rightSideMultimedia"
          defaultShow="image"
          imageFieldName="cmsContactInquiryImage"
          videoFieldName="cmsContactInquiryVideo"
          value={
            inquiry.rightSideMultimedia ||
            (inquiry as any).multimedia ||
            emptyInquiryForm.rightSideMultimedia
          }
          onChange={(multimedia) =>
            updateInquiryField("rightSideMultimedia", multimedia)
          }
        />

        <UniversalMultimediaForm
          title="Background Media"
          fieldName="inquiry.backgroundMultimedia"
          defaultShow="color"
          imageFieldName="cmsContactInquiryBackgroundImage"
          videoFieldName="cmsContactInquiryBackgroundVideo"
          value={
            inquiry.backgroundMultimedia ||
            emptyInquiryForm.backgroundMultimedia
          }
          onChange={(multimedia) =>
            updateInquiryField("backgroundMultimedia", multimedia)
          }
        />
      </div>
    </FormSection>
  )
}

export default InquiryFormSection

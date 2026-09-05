import { FormBuilder } from "../../../shared/formBuilder/FormBuilder"
import type { ContactFormSectionProps } from "./sectionTypes"
export const InquiryForm = ({
  section,
  index,
  updateSectionField,
  addField,
  removeField,
}: ContactFormSectionProps) => (
  <div className="flex flex-col gap-4">
    <FormBuilder
      fields={section.fields ?? []}
      onChange={(fieldIndex, patch) =>
        updateSectionField(index, fieldIndex, patch)
      }
      onAdd={() => addField(index)}
      onRemove={(fieldIndex) => removeField(index, fieldIndex)}
    />
    {/* <UniversalMultimediaForm
            section={section as any}
            content={(section.content ?? {}) as Record<string, any>}
            updateSection={(patch) =>
                updateSection(index, patch as Partial<ContactSection>)
            }
            updateSectionContent={(patch) => updateSectionContent(index, patch)}
            contentMediaKey="sideMultimedia"
            backgroundType={(section.content as any)?.sideMultimedia?.type}
            sectionTitle="Inquiry Side Media"
            showColorPicker
            colorLabel="Inquiry side media color"
            defaultColor="#F5F0E8"
            imageFieldName="contactInquirySideImage"
            videoFieldName="contactInquirySideVideo"
            videoHint="Upload a video for the inquiry side media."
            showImageAltField
            showVideoAltField
            showVideoSwitches
        />
        <UniversalMultimediaForm
            section={section as any}
            content={(section.content ?? {}) as Record<string, any>}
            updateSection={(patch) => updateSection(index, patch as Partial<ContactSection>)}
            updateSectionContent={(patch) => updateSectionContent(index, patch)}
            contentMediaKey="contentMultimedia"
            backgroundType={(section.content as any)?.contentMultimedia?.type}
            sectionTitle="Inquiry Background"
            showColorPicker
            colorLabel="Inquiry background color"
            defaultColor="#F5F0E8"
            imageFieldName="contactInquiryBackgroundImage"
            videoFieldName="contactInquiryBackgroundVideo"
            videoHint="Upload a video for the inquiry form background."
            showImageAltField
            showVideoAltField
            showVideoSwitches
        /> */}
  </div>
)

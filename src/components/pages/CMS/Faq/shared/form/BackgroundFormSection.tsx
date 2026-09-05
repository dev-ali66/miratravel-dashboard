import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import type { FaqSectionFormProps } from "./sectionTypes"

export const BackgroundFormSection = ({
  data,
  index,
  updateData,
  updateSectionContent,
}: FaqSectionFormProps) => (
  <UniversalMultimediaForm
    section={data as any}
    content={data as Record<string, any>}
    updateSection={(patch) => updateData(patch as any)}
    updateSectionContent={(patch) => updateSectionContent(index, patch)}
    contentMediaKey="backgroundMultimedia"
    backgroundTypeStyleKey="faqBackgroundTypeStyle"
    showColorPicker
    colorLabel="Background color"
    defaultColor="#0F2A2E"
    imageTitle="Background Image"
    imageLabel="Background image"
    imageFieldName="cmsFaqBackgroundImage"
    imageAltStyleKey="faqBackgroundImageAltStyle"
    videoTitle="Background Video"
    videoLabel="FAQ background video"
    videoHint="Upload a video to use as the FAQ background."
    videoFieldName="cmsFaqBackgroundVideo"
    videoAltStyleKey="faqBackgroundVideoAltStyle"
    showVideoSwitches
  />
)

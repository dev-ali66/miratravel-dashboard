import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import type { CtaFormSectionProps } from "./sectionTypes"

export const CtaBackgroundForm = ({
  data,
  updateData,
}: CtaFormSectionProps) => (
  <div className="flex flex-col gap-4">
    <UniversalMultimediaForm
      section={data as any}
      content={data as Record<string, any>}
      updateSection={(patch) => updateData(patch as any)}
      updateSectionContent={(patch) => updateData(patch as any)}
      contentMediaKey="backgroundMultimedia"
      backgroundType={data.backgroundMultimedia?.type}
      sectionTitle="CTA Background"
      showColorPicker
      colorLabel="CTA background color"
      defaultColor={data.bgColor ?? "#FFFFFF"}
      imageTitle="CTA Background Image"
      imageLabel="CTA background image"
      imageFieldName="ctaBackgroundImage"
      videoTitle="CTA Background Video"
      videoLabel="CTA background video"
      videoFieldName="ctaBackgroundVideo"
      showImageAltField
      showVideoAltField
      showVideoSwitches
    />
    <UniversalMultimediaForm
      section={data as any}
      content={data as Record<string, any>}
      updateSection={(patch) => updateData(patch as any)}
      updateSectionContent={(patch) => updateData(patch as any)}
      contentMediaKey="rightMultimedia"
      backgroundType={data.rightMultimedia?.type}
      sectionTitle="CTA Right Media"
      showColorPicker
      colorLabel="CTA right media color"
      defaultColor="#E9E7DE"
      imageTitle="CTA Right Image"
      imageLabel="CTA right image"
      imageFieldName="ctaRightImage"
      videoTitle="CTA Right Video"
      videoLabel="CTA right video"
      videoFieldName="ctaRightVideo"
      showImageAltField
      showVideoAltField
      showVideoSwitches
    />
  </div>
)

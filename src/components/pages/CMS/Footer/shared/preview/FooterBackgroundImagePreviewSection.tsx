import type { FooterPreviewSectionProps } from "./sectionTypes"
import { UniversalMultimediaPreview } from "../../../Home/shared/preview/UniversalMultimediaPreview"

export const FooterBackgroundImagePreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const {
    theme: { backgroundImage, backgroundVideo, backgroundMultimedia },
  } = context

  const multimedia = backgroundMultimedia

  if (!multimedia && !backgroundImage && !backgroundVideo) {
    return null
  }

  return (
    <UniversalMultimediaPreview
      multimedia={
        multimedia ?? {
          type: backgroundVideo ? "video" : "image",
          url: backgroundVideo ?? backgroundImage,
        }
      }
      mode="background"
      className="absolute inset-0"
      containerClassName="absolute inset-0"
    />
  )
}

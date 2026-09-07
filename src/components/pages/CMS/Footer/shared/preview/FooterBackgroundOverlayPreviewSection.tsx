import type { FooterPreviewSectionProps } from "./sectionTypes"

export const FooterBackgroundOverlayPreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const {
    theme: { backgroundImage, backgroundVideo, backgroundMultimedia },
  } = context

  const isImageOrVideo =
    Boolean(backgroundImage) ||
    Boolean(backgroundVideo) ||
    backgroundMultimedia?.type === "image" ||
    backgroundMultimedia?.type === "video"

  if (!isImageOrVideo) {
    return null
  }

  return (
    <div
      className="absolute inset-0 bg-black/40 pointer-events-none"
    />
  )
}

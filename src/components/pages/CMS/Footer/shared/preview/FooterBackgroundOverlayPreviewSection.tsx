import type { FooterPreviewSectionProps } from "./sectionTypes"

export const FooterBackgroundOverlayPreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const {
    theme: { backgroundImage, backgroundMultimedia, backgroundColor },
  } = context

  if (!backgroundImage && !backgroundMultimedia) {
    return null
  }

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor,
        opacity: 0.84,
      }}
    />
  )
}

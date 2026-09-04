import type { FooterPreviewSectionProps } from "./sectionTypes"

export const FooterBackgroundOverlayPreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const {
    theme: {
      backgroundImage,
      backgroundColor,
    },
  } = context

  if (!backgroundImage) {
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

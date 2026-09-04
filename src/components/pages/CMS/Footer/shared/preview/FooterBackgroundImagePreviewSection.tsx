import type { FooterPreviewSectionProps } from "./sectionTypes"

export const FooterBackgroundImagePreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const {
    theme: {
      backgroundImage,
    },
  } = context

  if (!backgroundImage) {
    return null
  }

  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          `url(${backgroundImage})`,
      }}
    />
  )
}

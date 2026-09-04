import type { FooterPreviewSectionProps } from "./sectionTypes"

export const FooterCopyrightPreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const {
    theme,
    content,
  } = context

  if (!content.copyright) {
    return null
  }

  return (
    <div
      className="
        border-t
        py-4
        text-center
      "
      style={{
        borderColor:
          theme.borderColor,
      }}
    >
      <p
        className="text-[9px]"
        style={{
          color:
            theme.bottomTextColor,
        }}
      >
        {content.copyright}
      </p>
    </div>
  )
}

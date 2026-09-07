import type { FooterPreviewSectionProps } from "./sectionTypes"

export const FooterCopyrightPreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const { theme, content } = context

  const copyrightText = content.copyright || "© 2026 Mira. All rights reserved."

  return (
    <div className="w-full py-4 md:py-5 xl:py-6">
      <div className="container px-4 lg:px-0 mx-auto text-center">
        <p
          className="font-normal text-sm md:text-[15px] xl:text-base xl:leading-5 md:leading-[18px] leading-4"
          style={{
            color: theme.bottomTextColor || "rgba(255, 255, 255, 0.60)",
          }}
        >
          {copyrightText}
        </p>
      </div>
    </div>
  )
}

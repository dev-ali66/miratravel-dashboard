import { useCmsDraft } from "../shared/CmsDraftContext"

import {
  footerPreviewSectionOrder,
  footerPreviewSectionRegistry,
} from "./config/footerSections"
import type {
  FooterPageData,
  FooterSocialLink,
} from "./footerTypes"
import type { FooterPreviewSectionContext } from "./shared/preview/sectionTypes"

export const FooterPreview = () => {
  const page =
    useCmsDraft<FooterPageData>()

  const data = page?.data

  const theme = data?.theme ?? {}
  const content = data?.content ?? {}

  const resolvedTheme = {
    backgroundColor:
      theme.backgroundColor ??
      "#16330D",

    backgroundImage:
      theme.backgroundImage,

    textColor:
      theme.textColor ??
      "#FFFFFF",

    headingColor:
      theme.headingColor ??
      "#FFFFFF",

    mutedTextColor:
      theme.mutedTextColor ??
      "rgba(255,255,255,0.72)",

    accentColor:
      theme.accentColor ??
      "#C97B4A",

    borderColor:
      theme.borderColor ??
      "rgba(255,255,255,0.15)",

    bottomTextColor:
      theme.bottomTextColor ??
      "rgba(255,255,255,0.60)",

    socialBackgroundColor:
      theme.socialBackgroundColor ??
      "rgba(255,255,255,0.10)",

    socialTextColor:
      theme.socialTextColor ??
      "#FFFFFF",

    socialBorderColor:
      theme.socialBorderColor ??
      "transparent",

    socialHoverBackgroundColor:
      theme.socialHoverBackgroundColor ??
      "rgba(255,255,255,0.18)",

    socialHoverTextColor:
      theme.socialHoverTextColor ??
      "#FFFFFF",

    socialIconSize:
      theme.socialIconSize ??
      "14px",

    socialItemSize:
      theme.socialItemSize ??
      "32px",

    socialBorderRadius:
      theme.socialBorderRadius ??
      "4px",

    socialGap:
      theme.socialGap ??
      "8px",
  }

  const renderSocialIcon = (
    link: FooterSocialLink
  ) => {
    if (link.icon) {
      return (
        <img
          src={link.icon}
          alt={
            link.iconAlt ??
            link.platform ??
            "Social icon"
          }
          className="object-contain"
          style={{
            width:
              link.iconSize ??
              resolvedTheme.socialIconSize,

            height:
              link.iconSize ??
              resolvedTheme.socialIconSize,
          }}
        />
      )
    }

    const platform =
      link.platform?.trim() ?? ""

    const fallback =
      platform.length > 0
        ? platform
            .slice(0, 2)
            .toUpperCase()
        : "•"

    return (
      <span
        className="font-semibold leading-none"
        style={{
          fontSize:
            link.iconSize ??
            resolvedTheme.socialIconSize,
        }}
      >
        {fallback}
      </span>
    )
  }

  const sectionContext: FooterPreviewSectionContext = {
    theme: resolvedTheme,
    content,
    renderSocialIcon,
  }

  const outerSections =
    footerPreviewSectionOrder.filter(
      (key) =>
        footerPreviewSectionRegistry[key]
          .placement === "outer"
    )

  const innerSections =
    footerPreviewSectionOrder.filter(
      (key) =>
        footerPreviewSectionRegistry[key]
          .placement === "inner"
    )

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor:
          resolvedTheme.backgroundColor,
        color: resolvedTheme.textColor,
      }}
    >
      {outerSections.map((key) => {
        const sectionEntry =
          footerPreviewSectionRegistry[key]

        const PreviewSection =
          sectionEntry.preview

        return (
          <PreviewSection
            key={key}
            context={
              sectionContext
            }
          />
        )
      })}

      <div
        className="
          relative
          mx-auto
          max-w-295
          px-6
          py-10
          md:px-10
          md:py-12
        "
      >
        {innerSections.map((key) => {
          const sectionEntry =
            footerPreviewSectionRegistry[key]

          const PreviewSection =
            sectionEntry.preview

          return (
            <PreviewSection
              key={key}
              context={
                sectionContext
              }
            />
          )
        })}
      </div>
    </footer>
  )
}

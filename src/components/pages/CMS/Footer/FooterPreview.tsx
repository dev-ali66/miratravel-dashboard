import { useCmsDraft } from "../shared/CmsDraftContext"
import { getSafeString } from "../shared/FormControls"

import {
  footerPreviewSectionOrder,
  footerPreviewSectionRegistry,
} from "./config/footerSections"
import type { FooterPageData, FooterSocialLink } from "./footerTypes"
import type { FooterPreviewSectionContext } from "./shared/preview/sectionTypes"

export const FooterPreview = ({
  footerData,
}: {
  footerData?: FooterPageData
} = {}) => {
  const draftPage = useCmsDraft<FooterPageData>()

  const page = footerData ?? draftPage

  const data = page?.data

  const theme = data?.theme ?? {}
  const content = data?.content ?? {}

  const rawBgColor =
    getSafeString(theme.backgroundColor) ||
    (typeof theme.footerBackgroundMultimedia?.color === "object"
      ? theme.footerBackgroundMultimedia?.color?.color
      : getSafeString(theme.footerBackgroundMultimedia?.color)) ||
    "#16330D"

  const resolvedTheme = {
    backgroundColor:
      rawBgColor && rawBgColor !== "#09090b" && rawBgColor !== "#000000"
        ? rawBgColor
        : "#16330D",

    backgroundImage: theme.backgroundImage,

    backgroundVideo: theme.backgroundVideo,

    backgroundMultimedia:
      theme.footerBackgroundMultimedia ??
      theme.footerBrandMultimedia ??
      theme.navbarBrandMultimedia,

    textColor: getSafeString(theme.textColor, "#FFFFFF"),

    headingColor: getSafeString(theme.headingColor, "#FFFFFF"),

    mutedTextColor: getSafeString(theme.mutedTextColor, "rgba(255,255,255,0.72)"),

    accentColor: getSafeString(theme.accentColor, "#C97B4A"),

    borderColor: getSafeString(theme.borderColor, "rgba(255,255,255,0.15)"),

    bottomTextColor: getSafeString(theme.bottomTextColor, "rgba(255,255,255,0.60)"),

    socialBackgroundColor: getSafeString(
      theme.socialBackgroundColor,
      "rgba(255,255,255,0.10)"
    ),

    socialTextColor: getSafeString(theme.socialTextColor, "#FFFFFF"),

    socialBorderColor: getSafeString(theme.socialBorderColor, "transparent"),

    socialHoverBackgroundColor: getSafeString(
      theme.socialHoverBackgroundColor,
      "rgba(255,255,255,0.18)"
    ),

    socialHoverTextColor: getSafeString(theme.socialHoverTextColor, "#FFFFFF"),

    socialIconSize: getSafeString(theme.socialIconSize, "14px"),

    socialItemSize: getSafeString(theme.socialItemSize, "32px"),

    socialBorderRadius: getSafeString(theme.socialBorderRadius, "4px"),

    socialGap: getSafeString(theme.socialGap, "8px"),
  }

  const renderSocialIcon = (link: FooterSocialLink) => {
    const iconSrc = typeof link.icon === "object" ? (link.icon as any)?.url || (link.icon as any)?.value : link.icon
    const iconSize = getSafeString(link.iconSize || resolvedTheme.socialIconSize)

    if (iconSrc) {
      return (
        <img
          src={iconSrc}
          alt={getSafeString(link.iconAlt || link.platform || "Social icon")}
          className="object-contain"
          style={{
            width: iconSize,
            height: iconSize,
          }}
        />
      )
    }

    const platform = getSafeString(link.platform).trim()
    const fallback =
      platform.length > 0 ? platform.slice(0, 2).toUpperCase() : "•"

    return (
      <span
        className="leading-none font-semibold"
        style={{
          fontSize: iconSize,
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

  const outerSections = footerPreviewSectionOrder.filter(
    (key) => footerPreviewSectionRegistry[key].placement === "outer"
  )

  const innerSections = footerPreviewSectionOrder.filter(
    (key) => footerPreviewSectionRegistry[key].placement === "inner"
  )

  return (
    <footer
      className="relative w-full self-stretch flex flex-col overflow-hidden"
      style={{
        backgroundColor: resolvedTheme.backgroundColor,
        color: resolvedTheme.textColor,
      }}
    >
      {/* Background image & overlay */}
      {outerSections.map((key) => {
        const sectionEntry = footerPreviewSectionRegistry[key]

        const PreviewSection = sectionEntry.preview

        return <PreviewSection key={key} context={sectionContext} />
      })}

      {/* Main Top, Newsletter/Partners, and Copyright sections */}
      <div className="relative z-10 w-full flex flex-col">
        {innerSections.map((key) => {
          const sectionEntry = footerPreviewSectionRegistry[key]

          const PreviewSection = sectionEntry.preview

          return <PreviewSection key={key} context={sectionContext} />
        })}
      </div>
    </footer>
  )
}

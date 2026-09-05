import type { ReactNode } from "react"

import type { FooterContent, FooterSocialLink } from "../../footerTypes"

export type FooterResolvedTheme = {
  backgroundColor: string
  backgroundImage?: string
  backgroundVideo?: string
  backgroundMultimedia?: Record<string, any>
  navbarBrandMultimedia?: Record<string, any>
  footerBrandMultimedia?: Record<string, any>
  textColor: string
  headingColor: string
  mutedTextColor: string
  accentColor: string
  borderColor: string
  bottomTextColor: string
  socialBackgroundColor: string
  socialTextColor: string
  socialBorderColor: string
  socialHoverBackgroundColor: string
  socialHoverTextColor: string
  socialIconSize: string
  socialItemSize: string
  socialBorderRadius: string
  socialGap: string
}

export type FooterPreviewSectionContext = {
  theme: FooterResolvedTheme
  content: FooterContent
  renderSocialIcon: (link: FooterSocialLink) => ReactNode
}

export type FooterPreviewSectionProps = {
  context: FooterPreviewSectionContext
}

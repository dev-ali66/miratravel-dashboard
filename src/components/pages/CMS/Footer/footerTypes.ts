export interface FooterTheme {
  backgroundColor?: string
  backgroundImage?: string
  backgroundVideo?: string
  footerBackgroundMultimedia?: Record<string, any>
  navbarBrandMultimedia?: Record<string, any>
  footerBrandMultimedia?: Record<string, any>

  textColor?: string
  headingColor?: string
  mutedTextColor?: string

  accentColor?: string
  borderColor?: string

  socialBackgroundColor?: string
  socialTextColor?: string
  socialBorderColor?: string
  socialHoverBackgroundColor?: string
  socialHoverTextColor?: string
  socialIconSize?: string
  socialItemSize?: string
  socialBorderRadius?: string
  socialGap?: string

  newsletterBackgroundColor?: string
  newsletterTextColor?: string

  bottomTextColor?: string
}

export interface FooterLogo {
  url?: string
  alt?: string
}

export interface FooterBrand {
  logo?: FooterLogo
  name?: string
  description?: string
  footerBrandMultimedia?: Record<string, any>
}

export interface FooterColumnLink {
  label?: string
  url?: string
}

export interface FooterColumn {
  title?: string
  titleColor?: string
  links?: FooterColumnLink[]
}

export interface FooterSocialLink {
  platform?: string
  url?: string

  /*
   * Fully custom icon.
   * Can be an uploaded image, SVG URL, PNG, WebP etc.
   */
  icon?: string
  iconAlt?: string

  /*
   * Optional per-item customization.
   * If empty, global theme values are used.
   */
  iconSize?: string
  itemSize?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderWidth?: string
  borderRadius?: string
  hoverBackgroundColor?: string
  hoverTextColor?: string
}

export interface FooterContact {
  title?: string
  email?: string
  phone?: string
  address?: string
}

export interface FooterNewsletter {
  text?: string
  linkText?: string
  url?: string
}

export interface FooterCertification {
  name?: string
  image?: string
  url?: string
  alt?: string
}

export interface FooterContent {
  brand?: FooterBrand
  columns?: FooterColumn[]
  contact?: FooterContact
  socialLinks?: FooterSocialLink[]
  newsletter?: FooterNewsletter
  certifications?: FooterCertification[]
  copyright?: string
}

export interface FooterPageData {
  name?: string

  metadata?: {
    title?: string
    description?: string
    keywords?: string[]
    canonicalUrl?: string
    robots?: {
      index?: boolean
      follow?: boolean
    }
  }

  data?: {
    page?: "footer"

    theme?: FooterTheme

    content?: FooterContent
  }
}

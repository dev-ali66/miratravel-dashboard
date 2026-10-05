export const emptyImageMultimedia = {
  show: "image" as const,
  color: { color: "#ffffff", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
  image: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const },
  video: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, autoplay: true, loop: true, muted: true, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const }
}

export const emptyVideoMultimedia = {
  show: "video" as const,
  color: { color: "#ffffff", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
  image: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const },
  video: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, autoplay: true, loop: true, muted: true, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const }
}

export function normalizeMultimediaField(rawVal: any, defaultShowMode: "image" | "video" = "image") {
  const base = defaultShowMode === "video" ? emptyVideoMultimedia : emptyImageMultimedia
  if (!rawVal) return { ...base }
  if (typeof rawVal === "string") {
    if (defaultShowMode === "video") {
      return {
        ...base,
        video: { ...base.video, url: rawVal }
      }
    }
    return {
      ...base,
      image: { ...base.image, url: rawVal }
    }
  }
  if (typeof rawVal === "object") {
    return {
      show: rawVal.show || defaultShowMode,
      color: { ...base.color, ...(rawVal.color || {}) },
      image: { ...base.image, ...(rawVal.image || {}), url: typeof rawVal.image?.url === "string" ? rawVal.image.url : typeof rawVal.image === "string" ? rawVal.image : base.image.url },
      video: { ...base.video, ...(rawVal.video || {}), url: typeof rawVal.video?.url === "string" ? rawVal.video.url : typeof rawVal.video === "string" ? rawVal.video : base.video.url }
    }
  }
  return { ...base }
}

export interface SocialLinkItem {
  id: string
  platform: string
  title: string
  url: string
  icon?: string
  iconImage?: string
}

export interface SiteSettingsState {
  // 1. IDENTITY
  siteName: string
  siteTagline: string
  siteDescription: string
  siteUrl: string
  defaultLanguage: string
  defaultTimezone: string
  contactEmail: string
  supportEmail: string
  phoneNumber: string
  secondaryPhoneNumber: string
  businessName: string
  businessAddress: string
  copyrightText: string

  // 2. BRAND & MULTIMEDIA LOGO ASSETS
  siteLogo: any
  siteLogoLight: any
  siteLogoDark: any
  siteFavicon: any
  navbarLogo: any
  footerLogo: any
  authLogo: any
  loadingVideo: any

  // 3. SOCIAL
  socialLinks: SocialLinkItem[]

  // 4. SOCIAL META
  seoOgTitle: string
  seoOgDescription: string
  seoOgImage: string
  seoTwitterTitle: string
  seoTwitterDescription: string
  seoTwitterImage: string
  seoTwitterCard: string

  // 5. SEO
  seoDefaultTitle: string
  seoTitleTemplate: string
  seoMetaDescription: string
  seoKeywords: string
  seoCanonicalUrl: string
  seoRobots: string
  seoAuthor: string
  seoGoogleVerification: string
  seoBingVerification: string
  seoSchemaEnabled: boolean
}

export const defaultState: SiteSettingsState = {
  siteName: "",
  siteTagline: "",
  siteDescription: "",
  siteUrl: "",
  defaultLanguage: "en",
  defaultTimezone: "UTC",
  contactEmail: "",
  supportEmail: "",
  phoneNumber: "",
  secondaryPhoneNumber: "",
  businessName: "",
  businessAddress: "",
  copyrightText: "",

  siteLogo: emptyImageMultimedia,
  siteLogoLight: emptyImageMultimedia,
  siteLogoDark: emptyImageMultimedia,
  siteFavicon: emptyImageMultimedia,
  navbarLogo: emptyImageMultimedia,
  footerLogo: emptyImageMultimedia,
  authLogo: emptyImageMultimedia,
  loadingVideo: emptyVideoMultimedia,

  socialLinks: [],

  seoOgTitle: "",
  seoOgDescription: "",
  seoOgImage: "",
  seoTwitterTitle: "",
  seoTwitterDescription: "",
  seoTwitterImage: "",
  seoTwitterCard: "summary_large_image",

  seoDefaultTitle: "",
  seoTitleTemplate: "",
  seoMetaDescription: "",
  seoKeywords: "",
  seoCanonicalUrl: "",
  seoRobots: "index, follow",
  seoAuthor: "",
  seoGoogleVerification: "",
  seoBingVerification: "",
  seoSchemaEnabled: true,
}

export const POPULAR_PLATFORMS = [
  "Facebook",
  "Instagram",
  "X (Twitter)",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "Pinterest",
  "Spotify",
  "WhatsApp",
  "Custom Platform",
]

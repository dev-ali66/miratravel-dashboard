import { THEME_COLORS } from "@/config/theme"
import type { UniversalMultimediaValue } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import {
  normalizeMultimedia,
  normalizeStyledField,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"

export type LegalHeroData = {
  breadcrumb: any
  title: any
  subtitle: any
  description: any
  isCenter: boolean
  buttons: any[]
  backgroundMultimedia: UniversalMultimediaValue
}

export const createDefaultHeroMultimedia = (): UniversalMultimediaValue => ({
  show: "image",
  color: {
    color: "#143224",
    opacity: 100,
    width: "100%",
    height: "100%",
    aspectRatio: "auto",
    isFullWidth: true,
    isFullHeight: true,
  },
  image: {
    url: "",
    alt: "Hero Background",
    opacity: 100,
    overlayColor: THEME_COLORS.overlayBlack,
    overlayOpacity: 40,
    width: "100%",
    height: "100%",
    aspectRatio: "auto",
    fit: "cover",
    isFullWidth: true,
    isFullHeight: true,
  },
  video: {
    url: "",
    alt: null,
    opacity: 100,
    overlayColor: THEME_COLORS.overlayBlack,
    overlayOpacity: 40,
    autoplay: true,
    loop: true,
    muted: true,
    width: "100%",
    height: "100%",
    aspectRatio: "auto",
    fit: "cover",
    isFullWidth: true,
    isFullHeight: true,
  },
})

export const createDefaultTermsHero = (existingMedia?: UniversalMultimediaValue): LegalHeroData => ({
  breadcrumb: {
    value: "MIRA ARCHIVE",
    textColor: THEME_COLORS.accentLight,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "Terms & Conditions",
    textColor: THEME_COLORS.white,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  subtitle: {
    value:
      "Please review the legal terms, booking requirements, and mutual commitments that govern our bespoke expeditions, private concierge services, and regional itineraries.",
    textColor: THEME_COLORS.mediaPlaceholder,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  description: {
    value: "",
    textColor: THEME_COLORS.lightText,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  isCenter: true,
  buttons: [],
  backgroundMultimedia: existingMedia || createDefaultHeroMultimedia(),
})

export const createDefaultPrivacyHero = (existingMedia?: UniversalMultimediaValue): LegalHeroData => ({
  breadcrumb: {
    value: "MIRA ARCHIVE",
    textColor: THEME_COLORS.accentLight,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "Privacy Policy",
    textColor: THEME_COLORS.white,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  subtitle: {
    value:
      "We are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your personal information across all MIRA journeys and platforms.",
    textColor: THEME_COLORS.mediaPlaceholder,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  description: {
    value: "",
    textColor: THEME_COLORS.lightText,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  isCenter: true,
  buttons: [],
  backgroundMultimedia: existingMedia || createDefaultHeroMultimedia(),
})

export function normalizeLegalHero(
  heroRaw: any,
  fallbackDefaults: {
    breadcrumb: string
    title: string
    subtitle: string
    existingMedia?: UniversalMultimediaValue
  }
): LegalHeroData {
  const safeHero = heroRaw && typeof heroRaw === "object" ? heroRaw : {}

  const defaultHero = {
    breadcrumb: {
      value: fallbackDefaults.breadcrumb,
      textColor: THEME_COLORS.accentLight,
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    title: {
      value: fallbackDefaults.title,
      textColor: THEME_COLORS.white,
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    subtitle: {
      value: fallbackDefaults.subtitle,
      textColor: THEME_COLORS.mediaPlaceholder,
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    description: {
      value: "",
      textColor: THEME_COLORS.lightText,
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    isCenter: true,
    buttons: [],
    backgroundMultimedia: fallbackDefaults.existingMedia || createDefaultHeroMultimedia(),
  }

  return {
    breadcrumb: normalizeStyledField(
      safeHero.breadcrumb ?? safeHero.eyebrow ?? defaultHero.breadcrumb,
      fallbackDefaults.breadcrumb,
      THEME_COLORS.accentLight
    ),
    title: normalizeStyledField(safeHero.title ?? defaultHero.title, fallbackDefaults.title, THEME_COLORS.white),
    subtitle: normalizeStyledField(safeHero.subtitle ?? defaultHero.subtitle, fallbackDefaults.subtitle, THEME_COLORS.mediaPlaceholder),
    description: normalizeStyledField(safeHero.description ?? defaultHero.description, "", THEME_COLORS.lightText),
    isCenter: safeHero.isCenter !== undefined ? Boolean(safeHero.isCenter) : true,
    buttons: normalizeButtonsArray(safeHero.buttons ?? defaultHero.buttons),
    backgroundMultimedia: normalizeMultimedia(
      safeHero.backgroundMultimedia ?? safeHero.heroMultimedia ?? fallbackDefaults.existingMedia ?? defaultHero.backgroundMultimedia
    ),
  }
}

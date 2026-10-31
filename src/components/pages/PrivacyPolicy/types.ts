import { THEME_COLORS } from "@/config/theme"
import type { UniversalMultimediaValue } from "@/components/pages/CMS/shared/UniversalMultimediaForm"

export type PolicyPart = {
  id: string
  tabTitle: string
  fullTitle: string
  content: string
}

export const DEFAULT_PARTS: PolicyPart[] = []

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


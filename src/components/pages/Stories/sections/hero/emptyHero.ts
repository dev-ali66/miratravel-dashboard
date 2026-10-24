import { THEME_COLORS } from "@/config/theme"
export const emptyHero = {
  breadcrumb: {
    value: "",
    textColor: THEME_COLORS.accentMuted,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "",
    textColor: THEME_COLORS.white,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  subtitle: {
    value: "",
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
  buttons: [],
  backgroundMultimedia: {
    show: "video",
    color: { color: THEME_COLORS.bgHeroDark, opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
    image: { url: "", alt: "", opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 45, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
    video: { url: "", alt: "", opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 45, autoplay: true, loop: true, muted: true, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
  },
  isCenter: true,
};

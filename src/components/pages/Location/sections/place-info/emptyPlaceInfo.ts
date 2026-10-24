import { THEME_COLORS } from "@/config/theme"
export const emptyPlaceInfo = {
  headline: {
    value: "What kind of city survives 2,400 years without losing its character?",
    textColor: THEME_COLORS.borderLight,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  description: {
    value: "Dhërmi is one of the oldest continuously inhabited villages on the Albanian Riviera, combining a historic hilltop settlement with one of the country's most beautiful coastlines.",
    textColor: THEME_COLORS.lightText,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  backgroundMultimedia: {
    show: "color",
    color: {
      color: THEME_COLORS.primary,
      opacity: 100,
      width: "100%",
      height: "100%",
      aspectRatio: "auto",
    },
    image: { url: "", alt: "", opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
    video: { url: "", alt: "", autoplay: true, loop: true, muted: true, opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
  },
}

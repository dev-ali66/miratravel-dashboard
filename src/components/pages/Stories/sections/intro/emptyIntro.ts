import { THEME_COLORS } from "@/config/theme"
export const emptyIntro = {
  title: {
    value: "",
    textColor: THEME_COLORS.bgHeroDark,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  subtitle: {
    value: "",
    textColor: THEME_COLORS.gold,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  description: {
    value: "",
    textColor: THEME_COLORS.body,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  backgroundMultimedia: {
    show: "color" as const,
    color: { color: THEME_COLORS.bgSand, opacity: 100, width: "100%", height: "auto", aspectRatio: "auto" },
    image: { url: "", alt: "", opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const },
    video: { url: "", alt: "", opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const, autoplay: true, loop: true, muted: true },
  },
};

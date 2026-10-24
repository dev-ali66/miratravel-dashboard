import { THEME_COLORS } from "@/config/theme"
export const createDefaultMultimedia = (show: "image" | "video" | "color" = "image") => ({
  show,
  color: { color: THEME_COLORS.bgHeroDark, opacity: 100, width: "100%", height: "auto", aspectRatio: "auto" },
  image: { url: "", alt: "", opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const },
  video: { url: "", alt: "", opacity: 100, overlayColor: THEME_COLORS.overlayBlack, overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const, autoplay: true, loop: true, muted: true },
});

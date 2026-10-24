import { THEME_COLORS } from "@/config/theme"
export const emptyHero = {
  label: {
    value: "MIRA EXCLUSIVE JOURNEY",
    textColor: THEME_COLORS.accent,
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
  backgroundMultimedia: {
    show: "image",
    image: {
      url: "",
      alt: "Classic Albania Hero View",
      opacity: 100,
      overlayColor: THEME_COLORS.overlayBlack,
      overlayOpacity: 30,
      width: "100%",
      height: "auto",
      aspectRatio: "auto",
      fit: "cover",
    },
    video: {
      url: "",
      alt: "Cinematic Journey Video",
      autoplay: true,
      loop: true,
      muted: true,
      opacity: 100,
      overlayColor: THEME_COLORS.overlayBlack,
      overlayOpacity: 30,
      width: "100%",
      height: "auto",
      aspectRatio: "auto",
      fit: "cover",
    },
    color: {
      color: THEME_COLORS.primary,
      opacity: 100,
      width: "100%",
      height: "100%",
      aspectRatio: "auto",
    },
  },
}



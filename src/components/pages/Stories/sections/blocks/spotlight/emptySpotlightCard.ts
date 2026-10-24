import { THEME_COLORS } from "@/config/theme"
import { createDefaultMultimedia } from "../shared/defaultMediaHelper"

export const emptySpotlightCard = {
  type: "spotlight",
  title: {
    value: "",
    textColor: THEME_COLORS.gold,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  content: {
    value: "",
    textColor: THEME_COLORS.navText,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  mediaPosition: "left" as "left" | "right",
  multimedia: createDefaultMultimedia("image"),
  items: [] as any[],
}

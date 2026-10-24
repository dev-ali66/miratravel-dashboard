import { THEME_COLORS } from "@/config/theme"
import { createDefaultMultimedia } from "../shared/defaultMediaHelper"

export const emptyVideoBlock = {
  type: "video",
  title: {
    value: "",
    textColor: THEME_COLORS.muted,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  multimedia: createDefaultMultimedia("video"),
  items: [] as any[],
}

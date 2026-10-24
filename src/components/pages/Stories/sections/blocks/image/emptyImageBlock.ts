import { THEME_COLORS } from "@/config/theme"
import { createDefaultMultimedia } from "../shared/defaultMediaHelper";

export const emptyImageBlock = {
  type: "image" as const,
  title: {
    value: "",
    textColor: THEME_COLORS.muted,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  multimedia: createDefaultMultimedia("image"),
  items: [] as any[],
};

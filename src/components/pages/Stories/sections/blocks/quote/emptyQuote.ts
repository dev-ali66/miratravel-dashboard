import { THEME_COLORS } from "@/config/theme"
export const emptyQuoteBlock = {
  type: "quote" as const,
  content: {
    value: "",
    textColor: THEME_COLORS.gold,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  author: {
    value: "",
    textColor: THEME_COLORS.muted,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
};

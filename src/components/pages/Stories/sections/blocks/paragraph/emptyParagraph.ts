import { THEME_COLORS } from "@/config/theme"
export const emptyParagraphBlock = {
  type: "paragraph" as const,
  content: {
    value: "",
    textColor: THEME_COLORS.body,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
};

import { THEME_COLORS } from "@/config/theme"
export const emptyParagraphBlock = {
  type: "paragraph" as const,
  title: {
    value: "",
    textColor: THEME_COLORS.bgHeroDark,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  content: {
    value: "",
    textColor: THEME_COLORS.body,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
};

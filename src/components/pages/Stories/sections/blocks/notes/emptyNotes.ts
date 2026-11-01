import { THEME_COLORS } from "@/config/theme"

export const emptyNotesItem = {
  description: {
    value: "",
    textColor: THEME_COLORS.sub,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
}

export const emptyNotesBlock = {
  type: "notes",
  description: {
    value: "Practical Notes & Insider Tips",
    textColor: THEME_COLORS.bgHeroDark,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "Practical Notes & Insider Tips",
    textColor: THEME_COLORS.bgHeroDark,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  items: [] as any[],
}

import { THEME_COLORS } from "@/config/theme"
export const emptyPracticalNotesItem = {
  title: {
    value: "",
    textColor: THEME_COLORS.bgHeroDark,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  description: {
    value: "",
    textColor: THEME_COLORS.sub,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  category: "General",
};

export const emptyPracticalNotes = {
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
  items: [],
};

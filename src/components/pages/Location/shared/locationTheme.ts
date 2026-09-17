/* =====================================================
   LOCATION — GLOBAL THEME & COLOR PALETTE CONSTANTS
   Single source of truth for location section forms, 
   previews, normalizers, and fallback defaults.
===================================================== */

export const LOCATION_THEME_COLORS = {
  /** Primary Dark Evergreen Title & Heading Color */
  primary: "#182D09",

  /** Terracotta Accent / Eyebrow Label Color */
  accent: "#AF6348",

  /** Muted Charcoal Body Text / Description Color */
  muted: "#565E69",

  /** Pure White */
  white: "#FFFFFF",

  /** Dark Theme Text Light Color */
  lightText: "#F3F4F6",

  /** Dark Theme Muted Text Color */
  lightMuted: "#9CA3AF",

  /** Section Backgrounds (Harmonious Frontend Palette) */
  bgIvory: "#FFF8F2",
  bgWarm: "#FAF8F5",
  bgSand: "#F8F5EE",
  bgSubdued: "#EDE7D8",
  bgLightGray: "#F5F5F5",
  bgForest: "#182D09",
} as const

export type LocationThemeColorKey = keyof typeof LOCATION_THEME_COLORS

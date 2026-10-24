/* =====================================================
   GLOBAL THEME & COLOR PALETTE
   Single source of truth for the entire MIRA Dashboard.
   Any change made here propagates globally to all default
   form values, normalizers, section previews, and shared components.

   - LIGHT_THEME_COLORS: Default Ivory & Forest Green Luxury Palette
   - DARK_THEME_COLORS: Travelling Albania Figma Deep Midnight & Obsidian Navy Palette
===================================================== */

export const LIGHT_THEME_COLORS = {
  // Brand Primary & Forest Greens
  primary: "#182D09",
  forest: "#182D09",
  sidebarActive: "#1F3D2B",
  primaryHover: "#2B3425",
  brandGreen: "#6E7F5B",

  // Terracotta & Warm Accents
  accent: "#AF6348",
  accentLight: "#B85C38",
  accentWarm: "#B86B3A",
  accentMuted: "#E5A84B",
  accentHover: "#FF7747",

  // Warm Golds
  gold: "#B3884D",
  goldMuted: "#C5A880",

  // Headings & Text
  dark: "#080C1D",
  darkNeutral: "#111827",
  title: "#0A0A0A",
  titleLight: "#313131",
  cardTitle: "#1A1A1A",
  textCardTitle: "#1B1712",
  quote: "#1A1209",
  navText: "#464136",
  body: "#4A4A4A",
  bodyMuted: "#4A4337",
  subtitle: "#565E69",
  sub: "#4B5563",
  subtext: "#717182",
  muted: "#565E69",
  extraLight: "#8A8070",
  placeholder: "#6B7280",
  placeholderLight: "#DADAD8",
  amberGold: "#8B7355",
  mutedSlate: "#7A8475",

  // Neutrals & Light Text
  white: "#FFFFFF",
  black: "#000000",
  lightText: "#F3F4F6",
  lightMuted: "#9CA3AF",
  lightIvoryText: "#E6E0D5",

  // Surfaces & Section Backgrounds
  background: "#FFF8F2",
  bgIvory: "#FFF8F2",
  bgWarm: "#FAF8F5",
  bgSand: "#FAF7F2",
  bgBeige: "#FAF6F0",
  bgSubdued: "#EDE7D8",
  bgLightGray: "#F5F5F5",
  bgForest: "#182D09",
  forestDark: "#101912",
  forestDeep: "#16330D",
  terminalBg: "#090D13",
  terminalHeader: "#0D121C",
  badgeYellowBg: "#FEF3C7",
  badgeYellowText: "#9A3412",
  bgCard: "#FFFFFF",
  bgHeroDark: "#171717",
  landFill: "#F1EEE5",

  // Cartographic & Route Map Palette
  secondary: "#235347",
  secondaryMuted: "#2B3424",
  leaderLine: "#B09C80",

  // Borders & Dividers
  borderLight: "#D8CBB8",
  borderMuted: "#E8E2D8",
  borderNeutral: "#F3F4F6",
  borderForm: "#C5C7C0",
  inputBorder: "#EFEFEF",

  // Multimedia Canvas Defaults
  overlayBlack: "#000000",
  mediaPlaceholder: "#E5E7EB",

  // Loader & System Indicators
  loaderBg: "#F2E9E3",
  loaderBorder: "#E8DCD5",
  loaderText: "#8C7A6B",

  // Status Indicators
  success: "#2E7D32",
  warning: "#C9A227",
  error: "#EF4444",
  blue: "#15428C",
} as const;

/* =====================================================
   DARK MODE PALETTE (Travelling Albania Figma Specs)
   Node: 15:2 — Deep Midnight & Obsidian Navy Design System
===================================================== */
export const DARK_THEME_COLORS = {
  // Brand Primary & Accents (Figma Adriatic Royal & Deep Sapphire)
  primary: "#142F68",
  forest: "#1F3D2B",
  sidebarActive: "#0E1B38",
  primaryHover: "#1E3A7B",
  brandGreen: "#4A7C59",

  // Terracotta & Warm Accents
  accent: "#B86B3A",
  accentLight: "#C97A48",
  accentWarm: "#B86B3A",
  accentMuted: "#E5A84B",
  accentHover: "#FF7747",

  // Warm Golds
  gold: "#C5A880",
  goldMuted: "#8B7355",

  // Headings & Text (High-contrast crisp white & muted slate)
  dark: "#080C1D",
  darkNeutral: "#0A162D",
  title: "#FFFFFF",
  titleLight: "#F3F4F6",
  cardTitle: "#F9FAFB",
  textCardTitle: "#F9FAFB",
  quote: "#E6E0D5",
  navText: "#CBD5E1",
  body: "#CBD5E1",
  bodyMuted: "#94A3B8",
  subtitle: "#94A3B8",
  sub: "#94A3B8",
  subtext: "#64748B",
  muted: "#64748B",
  extraLight: "#475569",
  placeholder: "#64748B",
  placeholderLight: "#475569",
  amberGold: "#C5A880",
  mutedSlate: "#808A96",

  // Neutrals & Light Text
  white: "#FFFFFF",
  black: "#000000",
  lightText: "#F9FAFB",
  lightMuted: "#94A3B8",
  lightIvoryText: "#F5EFEA",

  // Surfaces & Section Backgrounds (Deep Midnight Canvas #080C1D & #0D1529 Cards)
  background: "#080C1D",
  bgIvory: "#0C1524",
  bgWarm: "#0A162D",
  bgSand: "#0C1524",
  bgBeige: "#0D1529",
  bgSubdued: "#0E1B38",
  bgLightGray: "#0E1B38",
  bgForest: "#060A17",
  forestDark: "#050812",
  forestDeep: "#04060E",
  terminalBg: "#050812",
  terminalHeader: "#080C1D",
  badgeYellowBg: "#2E2005",
  badgeYellowText: "#FCD34D",
  bgCard: "#0D1529",
  bgHeroDark: "#060A17",
  landFill: "#0E1B38",

  // Cartographic & Route Map Palette
  secondary: "#0E1B38",
  secondaryMuted: "#121B36",
  leaderLine: "#4B5563",

  // Borders & Dividers (Figma subtle navy slate borders #1A2545 / #233256)
  borderLight: "#233256",
  borderMuted: "#1A2545",
  borderNeutral: "#1E293B",
  borderForm: "#233256",
  inputBorder: "#1A2545",

  // Multimedia Canvas Defaults
  overlayBlack: "#000000",
  mediaPlaceholder: "#0E1B38",

  // Loader & System Indicators
  loaderBg: "#0A162D",
  loaderBorder: "#1A2545",
  loaderText: "#94A3B8",

  // Status Indicators
  success: "#2E7D32",
  warning: "#C9A227",
  error: "#EF4444",
  blue: "#142F68",
} as const;

// Backward-compatible canonical default
export const THEME_COLORS = LIGHT_THEME_COLORS;

export type ThemeColorKey = keyof typeof THEME_COLORS;

/**
 * Returns the active color palette based on current theme mode
 */
export function getThemePalette(mode: "light" | "dark" = "light") {
  return mode === "dark" ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
}

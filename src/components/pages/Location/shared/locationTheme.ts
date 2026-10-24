/* =====================================================
   LOCATION — GLOBAL THEME & COLOR PALETTE CONSTANTS
   Re-exports from central global theme (@/config/theme)
   to ensure 100% backward compatibility.
===================================================== */

import { THEME_COLORS } from "@/config/theme"

export const LOCATION_THEME_COLORS = THEME_COLORS
export type LocationThemeColorKey = keyof typeof LOCATION_THEME_COLORS


import { THEME_COLORS } from "@/config/theme"
import { normalizeStyledField } from "@/components/pages/Journey/shared/normalizeHelpers"

export function normalizeWhyDesigned(data?: any) {
  const safeData = data || {}
  return {
    badge: normalizeStyledField(safeData.badge, "THE MIRA DIFFERENCE", THEME_COLORS.accent),
    title: normalizeStyledField(safeData.title, "Why we designed this journey?", THEME_COLORS.titleLight),
    description: normalizeStyledField(
      safeData.description ?? safeData.overviewText,
      "Viverra blandit neque ac risus euismod tincidunt ut nec velit. Hendrerit potenti eleifend hendrerit lobortis enim duis duis rhoncus vulputate. Integer volutpat purus feugiat eros sed volutpat mauris faucibus.\n\nFringilla cras malesuada suscipit felis pretium. Rutrum eget eleifend nisi dui pulvinar elementum magnis. Vulputate commodo ultrices id tincidunt imperdiet mauris.",
      THEME_COLORS.navText
    ),
    signature: normalizeStyledField(safeData.signature, "MIRA", THEME_COLORS.accent),
  }
}

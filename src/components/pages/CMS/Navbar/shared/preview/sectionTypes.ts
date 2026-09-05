import type { NavbarContent, NavbarTheme } from "../../navbarTypes"

export type NavbarPreviewSectionContext = {
  theme: NavbarTheme
  content: NavbarContent
}

export type NavbarPreviewSectionProps = {
  context: NavbarPreviewSectionContext
}

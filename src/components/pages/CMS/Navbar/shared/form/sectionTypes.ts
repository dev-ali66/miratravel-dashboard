import type { NavbarContent, NavbarTheme } from "../../navbarTypes"

export type NavbarFormSectionContext = {
  theme: NavbarTheme
  content: NavbarContent
  updateTheme: (patch: Partial<NavbarTheme>) => void
  updateBrand: (patch: Partial<NavbarContent["brand"]>) => void
}

export type NavbarFormSectionProps = {
  context: NavbarFormSectionContext
}

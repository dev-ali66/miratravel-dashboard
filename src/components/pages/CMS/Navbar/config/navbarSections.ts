import type { ComponentType } from "react"

import { BrandFormSection } from "../shared/form/BrandFormSection"
import { ThemeFormSection } from "../shared/form/ThemeFormSection"
import type { NavbarFormSectionProps } from "../shared/form/sectionTypes"
import { BrandPreviewSection } from "../shared/preview/BrandPreviewSection"
import { ThemePreviewSection } from "../shared/preview/ThemePreviewSection"
import type { NavbarPreviewSectionProps } from "../shared/preview/sectionTypes"

export type NavbarSectionKey = "brand" | "theme"

type NavbarSectionRegistryEntry = {
  label: string
  form: ComponentType<NavbarFormSectionProps>
  preview: ComponentType<NavbarPreviewSectionProps>
}

export const navbarSectionRegistry: Record<
  NavbarSectionKey,
  NavbarSectionRegistryEntry
> = {
  brand: {
    label: "Brand",
    form: BrandFormSection,
    preview: BrandPreviewSection,
  },
  theme: {
    label: "Navbar Theme",
    form: ThemeFormSection,
    preview: ThemePreviewSection,
  },
}

export const navbarSectionOrder: NavbarSectionKey[] = ["brand", "theme"]
